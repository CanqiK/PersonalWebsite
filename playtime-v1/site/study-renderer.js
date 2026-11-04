/* One drawing queue, visible-first work and a bounded cache shared across routes. */
window.CanqiStudies=(()=>{
  const workerURL=new URL('study-worker.js?v=performance-29',document.currentScript.src);
  const records=new Map(),cache=new Map();
  const budget=16*1024*1024;
  let bytes=0,worker=null,workerFailed=false,active=null,serial=0,timer=0,options={};
  const release=image=>{if(image.close)image.close();else image.width=image.height=0;};
  function remember(key,image,spec) {
    const cost=spec.width*spec.height*4;
    if(cost>budget)return false;
    while(bytes+cost>budget&&cache.size){const [old,item]=cache.entries().next().value;cache.delete(old);bytes-=item.cost;release(item.image);}
    cache.set(key,{image,cost});bytes+=cost;return true;
  }
  function getCached(key) {
    const item=cache.get(key);if(!item)return null;
    cache.delete(key);cache.set(key,item);return item.image;
  }
  function paint(canvas,state,image) {
    if(!canvas.isConnected||!state.near)return;
    canvas.width=state.spec.width;canvas.height=state.spec.height;
    canvas.getContext('2d').drawImage(image,0,0);
    state.painted=state.key;
  }
  function prune() {
    for(const [canvas] of records)if(!canvas.isConnected){observer?.unobserve(canvas);records.delete(canvas);}
  }
  function finish(job,image) {
    if(active!==job){release(image);return;}
    active=null;
    for(const [canvas,state] of records)if(state.key===job.key)paint(canvas,state,image);
    if(!remember(job.key,image,job.spec))release(image);
    schedule();
  }
  function fallback(job) {
    const canvas=document.createElement('canvas');
    const painter=CanqiStudyPainter.create(canvas,job.spec);
    job.surface=canvas;
    const slice=()=>{
      timer=0;
      if(active!==job){release(canvas);return;}
      if(document.hidden)return;
      if(painter.step(performance.now()+4))finish(job,canvas);
      else timer=setTimeout(slice,0);
    };
    job.resume=slice;timer=setTimeout(slice,0);
  }
  function disableWorker() {
    worker?.terminate();worker=null;workerFailed=true;
    if(active&&!active.resume)fallback(active);
  }
  function start(job) {
    active=job;
    if(!workerFailed&&typeof Worker==='function'&&typeof OffscreenCanvas==='function') {
      try {
        if(!worker) {
          worker=new Worker(workerURL);
          worker.onmessage=({data})=>{
            if(!active||data.id!==active.id){data.bitmap?.close();return;}
            if(data.error){disableWorker();return;}
            finish(active,data.bitmap);
          };
          worker.onerror=event=>{event.preventDefault();disableWorker();};
        }
        worker.postMessage({id:job.id,spec:job.spec});return;
      } catch {disableWorker();return;}
    }
    fallback(job);
  }
  function pump() {
    timer=0;prune();
    if(active||document.hidden)return;
    let next=null;
    for(const [canvas,state] of records) {
      if(!state.near||!state.spec||state.painted===state.key||canvas.closest('dialog:not([open])'))continue;
      const cached=getCached(state.key);
      if(cached){paint(canvas,state,cached);continue;}
      if(!next||state.distance<next.distance)next=state;
    }
    if(next)start({id:++serial,key:next.key,spec:next.spec});
  }
  function schedule(){if(!timer&&!active&&!document.hidden)timer=setTimeout(pump,0);}
  function measure(items) {
    // Read all geometry before any canvas allocation or pixel writes.
    const measurements=items.map(canvas=>({canvas,rect:(canvas.closest('.feature-incoming')?.parentElement||canvas).getBoundingClientRect()}));
    for(const {canvas,rect} of measurements) {
      const state=records.get(canvas);if(!state)continue;
      state.near=rect.width>0&&rect.height>0&&rect.bottom>-320&&rect.top<innerHeight+320&&rect.right>0&&rect.left<innerWidth&&!canvas.closest('dialog:not([open])');
      if(!state.near)continue;
      const cap=canvas.closest('.artist-card')?540:canvas.closest('.feature-slide')?1200:1800;
      let width=Math.min(cap,Math.max(180,Math.round(rect.width*Math.min(devicePixelRatio||1,2))));
      let height=Math.max(1,Math.round(width*rect.height/rect.width));
      const scale=Math.min(1,Math.sqrt(1800000/(width*height)));
      width=Math.round(width*scale);height=Math.round(height*scale);
      state.spec={width,height,n:Number(canvas.dataset.study),digital:Boolean(canvas.closest('.home,#home-intro')),treatment:options.treatment,dot:options.dot};
      state.key=JSON.stringify(state.spec);
      state.distance=Math.max(0,rect.top-innerHeight,-rect.bottom);
    }
    schedule();
  }
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    for(const entry of entries){const state=records.get(entry.target);if(state)state.near=entry.isIntersecting;}
    measure(entries.filter(entry=>entry.isIntersecting).map(entry=>entry.target));
  },{rootMargin:'320px 0px'}):null;
  function draw(root,settings) {
    options={...settings};prune();
    const canvases=[...root.querySelectorAll('canvas[data-study]')];
    for(const canvas of canvases)if(!records.has(canvas)){records.set(canvas,{painted:null,near:false});observer?.observe(canvas);}
    // Let intersection delivery measure new cards after layout; reading every
    // offscreen descendant here would defeat the browser's content containment.
    measure(observer?canvases.filter(canvas=>records.get(canvas).near||canvas.closest('.feature-incoming')):canvases);
  }
  function reset() {
    clearTimeout(timer);timer=0;
    worker?.terminate();worker=null;
    if(active?.surface)release(active.surface);
    active=null;records.clear();observer?.disconnect();
  }
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden){if(active?.resume&&!timer)timer=setTimeout(active.resume,0);else schedule();}
  });
  window.addEventListener('pagehide',()=>{reset();for(const item of cache.values())release(item.image);cache.clear();bytes=0;});
  // Re-register canvases after a back/forward cache restore.
  window.addEventListener('pageshow',event=>{if(event.persisted)draw(document,options);});
  if(!observer)window.addEventListener('scroll',()=>{if(!timer&&!active)timer=setTimeout(()=>{timer=0;measure([...records.keys()]);},80);},{passive:true});
  return {draw,reset};
})();
