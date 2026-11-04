/* Colour halftone, painted once per visible image/size. Hover is compositor-only. */
window.CanqiPhotoPrint=(()=>{
  'use strict';
  const records=new Map(),cache=new Map();
  const budget=12*1024*1024;
  let cacheBytes=0,active=null,timer=0,options={treatment:'halftone',dot:3};
  const release=canvas=>{canvas.width=canvas.height=0;};
  function cached(key){const value=cache.get(key);if(value){cache.delete(key);cache.set(key,value);}return value;}
  function remember(key,canvas){
    const cost=canvas.width*canvas.height*4;if(cost>budget)return;
    const previous=cache.get(key);if(previous){cacheBytes-=previous.cost;release(previous.canvas);cache.delete(key);}
    while(cacheBytes+cost>budget&&cache.size){const [old,v]=cache.entries().next().value;cache.delete(old);cacheBytes-=v.cost;release(v.canvas);}
    cache.set(key,{canvas,cost});cacheBytes+=cost;
  }
  function remove(host,state){observer?.unobserve(host);resize?.unobserve(host);state.img.removeEventListener('load',state.load);records.delete(host);}
  function prune(){for(const [host,state] of records)if(!host.isConnected)remove(host,state);}
  function measure(host,state){
    if(!host.isConnected||!state.near||!state.img.complete||!state.img.naturalWidth)return;
    // client dimensions exclude the existing page/paper transforms.
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    const ratio=Math.min(devicePixelRatio||1,1.5,1800/w,Math.sqrt(1800000/(w*h)));
    const width=Math.max(1,Math.round(w*ratio)),height=Math.max(1,Math.round(h*ratio));
    const dot=Math.max(3.6,Math.min(11,Number(options.dot||3)*1.8));
    const key=[state.img.currentSrc||state.img.src,width,height,dot].join('|');
    state.spec={width,height,cell:dot*ratio};state.key=key;
    host.classList.toggle('photo-print-continuous',options.treatment==='continuous');
    schedule();
  }
  function paint(host,state,canvas){
    if(!host.isConnected||!state.near)return;
    state.canvas.width=canvas.width;state.canvas.height=canvas.height;
    state.canvas.getContext('2d').drawImage(canvas,0,0);
    state.painted=state.key;host.classList.add('photo-print-ready');
  }
  function finish(job){
    if(active!==job){release(job.surface);return;}
    active=null;
    for(const [host,state] of records)if(state.key===job.key)paint(host,state,job.surface);
    remember(job.key,job.surface);schedule();
  }
  function start(state){
    const {width,height,cell}=state.spec,img=state.img;
    const cols=Math.ceil(width/cell),rows=Math.ceil(height/cell);
    const sample=document.createElement('canvas');sample.width=cols;sample.height=rows;
    const sampleContext=sample.getContext('2d',{willReadFrequently:true});
    // Match object-fit:cover exactly, so the two layers never jump on hover.
    const scale=Math.max(width/img.naturalWidth,height/img.naturalHeight);
    const sw=width/scale,sh=height/scale;
    sampleContext.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,0,0,cols,rows);
    let pixels;try{pixels=sampleContext.getImageData(0,0,cols,rows).data;}catch{state.painted=state.key;release(sample);schedule();return;}
    release(sample);
    const surface=document.createElement('canvas');surface.width=width;surface.height=height;
    const ctx=surface.getContext('2d');
    ctx.fillStyle='#171716';ctx.fillRect(0,0,width,height);
    const job={key:state.key,surface,row:0,cancelled:false};active=job;
    const step=()=>{
      timer=0;
      if(active!==job||job.cancelled){release(surface);return;}
      if(document.hidden)return;
      const deadline=performance.now()+4;
      do{
        const y=job.row;
        for(let x=0;x<cols;x++){
          const i=(y*cols+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
          const luminance=(.2126*r+.7152*g+.0722*b)/255;
          // Bright areas merge into paper; shadows break into smaller ink dots.
          const radius=cell*(.12+.56*Math.pow(luminance,.52));
          const lift=1.14;
          ctx.fillStyle=`rgb(${Math.min(255,Math.round(r*lift))} ${Math.min(255,Math.round(g*lift))} ${Math.min(255,Math.round(b*lift))})`;
          ctx.beginPath();ctx.arc((x+.5)*width/cols,(y+.5)*height/rows,radius,0,Math.PI*2);ctx.fill();
        }
        job.row++;
      }while(job.row<rows&&performance.now()<deadline);
      if(job.row<rows)timer=setTimeout(step,0);else finish(job);
    };
    job.resume=step;timer=setTimeout(step,0);
  }
  function pump(){
    timer=0;prune();if(active||document.hidden)return;
    for(const [host,state] of records){
      if(!state.near||!state.spec||state.painted===state.key||options.treatment==='continuous')continue;
      const hit=cached(state.key);if(hit){paint(host,state,hit.canvas);continue;}
      start(state);return;
    }
  }
  function schedule(){if(!timer&&!active&&!document.hidden)timer=setTimeout(pump,0);}
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    for(const entry of entries){const state=records.get(entry.target);if(!state)continue;state.near=entry.isIntersecting;if(state.near)measure(entry.target,state);}
  },{rootMargin:'160px 0px'}):null;
  const resize=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{
    for(const entry of entries){const state=records.get(entry.target);if(state?.near)measure(entry.target,state);}
  }):null;
  function draw(root=document,settings=options){
    options={...options,...settings};prune();
    for(const host of root.querySelectorAll('[data-print-photo]')){
      let state=records.get(host);
      if(!state){
        const img=host.querySelector('img'),canvas=host.querySelector('canvas');if(!img||!canvas)continue;
        state={img,canvas,near:!observer,painted:null};state.load=()=>measure(host,state);
        records.set(host,state);img.addEventListener('load',state.load);observer?.observe(host);resize?.observe(host);
      }
      host.classList.toggle('photo-print-continuous',options.treatment==='continuous');
      if(state.near)measure(host,state);
    }
  }
  function reset(){
    clearTimeout(timer);timer=0;if(active){active.cancelled=true;release(active.surface);active=null;}
    for(const [host,state] of records)remove(host,state);observer?.disconnect();resize?.disconnect();
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(active?.resume&&!timer)timer=setTimeout(active.resume,0);else schedule();}});
  window.addEventListener('pagehide',()=>{reset();for(const v of cache.values())release(v.canvas);cache.clear();cacheBytes=0;});
  window.addEventListener('pageshow',e=>{if(e.persisted)draw(document);});
  return {draw,reset};
})();
