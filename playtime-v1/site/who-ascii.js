// Live glyphs: independent twinkle, proximity dissolve and expanding click waves.
// Rasterize glyphs once; repaint only cells whose character or brightness changed.
(() => {
  const phrase='CANQI / SPACE / PERFORMANCE / CROCURSIONISM / INSTALLATION / NATURE / TECHNOLOGY / HUMAN RELATIONS / ';
  const alphabet=' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:/+=*#%@!?';
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const random=x=>{const n=Math.sin(x*12.9898+78.233)*43758.5453;return n-Math.floor(n);};
  function mount(){
    const canvas=document.createElement('canvas');
    canvas.className='who-ascii-background';canvas.setAttribute('aria-hidden','true');
    const hint=document.createElement('span');
    hint.className='who-ascii-hint';hint.textContent='CLICK';hint.hidden=true;hint.setAttribute('aria-hidden','true');
    document.body.prepend(canvas);document.body.append(hint);
    const ctx=canvas.getContext('2d');
    if(!ctx){canvas.remove();hint.remove();return ()=>{};}
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const events=new AbortController(),image=new Image();
    let width=0,height=0,cols=0,rows=0,cw=10,ch=19,dpr=1,atlas=null,tileW=0,tileH=0;
    let ink=new Float32Array(),seed=new Float32Array(),arrivalDelays=new Float32Array(),base=new Uint8Array(),drawnGlyph=new Int16Array(),drawnAlpha=new Int16Array(),protectedCells=new Uint8Array();
    let disposed=false,frame=0,resizeTimer=0,protectTimer=0,last=0,lastPaint=-100,time=0,arrival=0,ripples=[];
    const pointer={x:0,y:0,tx:0,ty:0,strength:0,target:0};
    const ignore='a,button,input,select,textarea,summary,[role="button"],dialog';
    const noHint=ignore+',p,h1,h2,h3,strong,time,figure,.cv-entry,.contact-poster';
    function surface(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
    function protectCopy(){
      if(disposed)return;
      protectedCells.fill(0);
      document.querySelectorAll('.who-page p,.who-page h1,.who-page h2,.who-page h3,.who-page .cv-entry,.who-page a').forEach(el=>{
        const r=el.getBoundingClientRect();if(r.bottom<0||r.top>height)return;
        const left=Math.max(0,Math.floor((r.left-12)/cw)),right=Math.min(cols,Math.ceil((r.right+12)/cw));
        for(let y=Math.max(0,Math.floor((r.top-8)/ch));y<Math.min(rows,Math.ceil((r.bottom+8)/ch));y++)protectedCells.fill(1,y*cols+left,y*cols+right);
      });
      if(reduce.matches)paint();
    }
    function build(){
      if(disposed)return;
      width=innerWidth;height=innerHeight;const small=width<=700;
      const budget=Math.max(1,Math.sqrt(width*height/(10*19*18000)));
      cw=(small?9:10)*budget;ch=(small?18:19)*budget;
      cols=Math.ceil(width/cw);rows=Math.ceil(height/ch);
      dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(1800000/(width*height)));
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=cols*rows;
      ink=new Float32Array(count);seed=new Float32Array(count);arrivalDelays=new Float32Array(count);base=new Uint8Array(count);
      protectedCells=new Uint8Array(count);drawnGlyph=new Int16Array(count).fill(-1);drawnAlpha=new Int16Array(count).fill(-1);
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const i=y*cols+x;seed[i]=random(i*1.73+5);
        arrivalDelays[i]=Math.min(1,Math.hypot((x+.5)*cw-width*(small?.49:.52),(y+.5)*ch-height*.57)/Math.max(width*.8,480))*1.15;
        base[i]=Math.max(0,alphabet.indexOf(phrase[(x+Math.floor(random(y+90)*phrase.length))%phrase.length]));
      }
      tileW=Math.ceil(cw*dpr);tileH=Math.ceil(ch*dpr);
      atlas=surface(tileW*16,tileH*Math.ceil(alphabet.length/16));
      const a=atlas.getContext('2d');a.fillStyle='#e6e4dc';a.textAlign='center';a.textBaseline='middle';
      a.font=`500 ${(small?12:13)*budget*dpr}px "Courier New",monospace`;
      for(let i=1;i<alphabet.length;i++)a.fillText(alphabet[i],(i%16+.5)*tileW,(Math.floor(i/16)+.51)*tileH);
      if(image.naturalWidth){
        const sample=surface(cols,rows),s=sample.getContext('2d',{willReadFrequently:true});
        s.fillStyle='#fff';s.fillRect(0,0,cols,rows);s.filter='blur(.55px)';
        const size=Math.min(1100,Math.max(440,height*.98,width*.57))*(small?1.25:1.65);
        const imageH=size*image.naturalHeight/image.naturalWidth;
        s.drawImage(image,(width*(small?.49:.52)-size/2)/cw,(height*.57-imageH/2)/ch,size/cw,imageH/ch);
        const pixels=s.getImageData(0,0,cols,rows).data;
        for(let i=0;i<count;i++)ink[i]=Math.pow(clamp(1-(pixels[i*4]*.2126+pixels[i*4+1]*.7152+pixels[i*4+2]*.0722)/255),.62);
      }
      protectCopy();paint();start();
    }
    function paint(){
      if(disposed||document.hidden||!atlas)return;
      const still=reduce.matches,small=width<=700;
      const hoverRadius=Math.min(300,Math.max(120,width*.175));
      const maxRadius=Math.max(width*.8,480),waveWidth=Math.min(420,width*.32);
      const scrambleTick=Math.floor(time*24),ambientTick=Math.floor(time*3.2);
      const hovering=pointer.strength>.001,arriving=time-arrival<1.65;
      const waves=still?[]:ripples.map(ripple=>{
        const life=(time-ripple.time)/1.8;
        return {x:ripple.x,y:ripple.y,radius:smooth(life)*maxRadius,strength:smooth(life/.22)*(1-smooth((life-.78)/.22))};
      });
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const i=y*cols+x,n=seed[i],px=(x+.5)*cw,py=(y+.5)*ch;
        let char=base[i],opacity=.045+ink[i]*(small?.27:.38);
        const pulse=still?0:Math.sin(time*(.7+n*.8)+n*64)*.5+.5;
        if(pulse>.94){char=1+Math.floor(random(i+ambientTick*19)*(alphabet.length-1));opacity+=.035+ink[i]*.07;}
        if(!still){
          const hover=hovering?(1-smooth(Math.hypot(px-pointer.x,py-pointer.y)/hoverRadius))*pointer.strength:0;
          opacity*=1-hover;if(hover>.001&&n<hover*2.5)opacity=0;
          let wave=0;
          for(const ripple of waves){
            const ring=1-smooth(Math.abs(Math.hypot(px-ripple.x,py-ripple.y)-ripple.radius)/(waveWidth*.5));
            wave=Math.max(wave,ring*ripple.strength);
          }
          if(wave>.001&&n<wave*.5){char=1+Math.floor(random(i*3.1+scrambleTick)*(alphabet.length-1));opacity=.68;}
          if(arriving)opacity*=smooth((time-arrival-arrivalDelays[i])/.5);
        }
        opacity=Math.min(opacity,protectedCells[i] ? .16 : .68);
        const level=Math.round(opacity*48);
        if(drawnGlyph[i]===char&&drawnAlpha[i]===level)continue;
        drawnGlyph[i]=char;drawnAlpha[i]=level;
        const left=Math.round(x*cw*dpr)/dpr,top=Math.round(y*ch*dpr)/dpr;
        const w=Math.round((x+1)*cw*dpr)/dpr-left,h=Math.round((y+1)*ch*dpr)/dpr-top;
        ctx.clearRect(left,top,w,h);
        if(char&&level){ctx.globalAlpha=level/48;ctx.drawImage(atlas,char%16*tileW,Math.floor(char/16)*tileH,tileW,tileH,left,top,w,h);}
      }
      ctx.globalAlpha=1;
    }
    function tick(now){
      frame=0;if(disposed||document.hidden||reduce.matches)return;
      const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;time+=dt;
      pointer.x+=(pointer.tx-pointer.x)*(1-Math.exp(-14*dt));pointer.y+=(pointer.ty-pointer.y)*(1-Math.exp(-14*dt));
      pointer.strength+=(pointer.target-pointer.strength)*(1-Math.exp(-6*dt));
      ripples=ripples.filter(r=>time-r.time<1.8);
      const fps=width<=700?20:(ripples.length||pointer.strength>.001?30:18);
      if(now-lastPaint>=1000/fps){lastPaint=now;paint();}
      frame=requestAnimationFrame(tick);
    }
    function start(){if(!disposed&&!document.hidden&&!reduce.matches&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
    function leave(){pointer.target=0;hint.hidden=true;}
    function move(event){
      if(reduce.matches||event.pointerType==='touch')return;
      const blocked=Boolean(event.target.closest(ignore));
      if(!pointer.target){pointer.x=event.clientX;pointer.y=event.clientY;}
      pointer.tx=event.clientX;pointer.ty=event.clientY;pointer.target=blocked?0:1;
      hint.hidden=blocked||Boolean(event.target.closest(noHint))||event.clientY<170;
      hint.style.transform=`translate(${Math.min(width-65,event.clientX+16)}px,${Math.min(height-30,event.clientY+18)}px)`;
    }
    document.addEventListener('pointermove',move,{passive:true,signal:events.signal});
    document.addEventListener('pointerout',event=>{if(!event.relatedTarget)leave();},{signal:events.signal});
    addEventListener('blur',leave,{signal:events.signal});
    document.addEventListener('click',event=>{
      if(reduce.matches||event.defaultPrevented||event.button!==0||event.target.closest(ignore)||event.clientY<170)return;
      ripples.push({x:event.clientX,y:event.clientY,time});if(ripples.length>8)ripples.shift();
    },{signal:events.signal});
    document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;leave();if(!document.hidden){paint();start();}},{signal:events.signal});
    reduce.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;ripples=[];leave();paint();start();},{signal:events.signal});
    addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,160);},{signal:events.signal});
    addEventListener('scroll',()=>{if(!protectTimer)protectTimer=setTimeout(()=>{protectTimer=0;protectCopy();},100);},{passive:true,signal:events.signal});
    addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;leave();},{signal:events.signal});
    addEventListener('pageshow',start,{signal:events.signal});
    image.onload=()=>{arrival=time;if(!reduce.matches)ripples=[{x:innerWidth*(innerWidth<=700?.49:.52),y:innerHeight*.57,time}];build();};image.onerror=()=>{paint();start();};image.src='assets/crocursionism-logo.webp';
    build();
    return ()=>{disposed=true;cancelAnimationFrame(frame);clearTimeout(resizeTimer);clearTimeout(protectTimer);events.abort();image.onload=null;image.onerror=null;ripples=[];atlas=null;canvas.remove();hint.remove();};
  }
  window.CanqiWhoAscii={mount};
})();
