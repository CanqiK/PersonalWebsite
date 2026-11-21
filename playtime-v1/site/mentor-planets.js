/* Small, static planetary studies. Textures are drawn once, not in the Earth loop. */
window.CanqiMentorPlanets=(()=>{
  const TAU=Math.PI*2;
  function texture(kind){
    const size=320,surface=document.createElement('canvas');surface.width=surface.height=size;
    const ctx=surface.getContext('2d'),image=ctx.createImageData(size,size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const u=(x+.5-size/2)/(size/2),v=(y+.5-size/2)/(size/2),rr=u*u+v*v;if(rr>=1)continue;
      const z=Math.sqrt(1-rr),lat=Math.asin(v),lon=Math.atan2(u,z);
      const swirl=Math.sin(lon*9+lat*18)*.035+Math.sin(lon*23-lat*31)*.012;
      const band=Math.sin((lat+swirl)*37)+.45*Math.sin((lat+swirl)*83);
      const grain=Math.sin(x*12.9898+y*78.233)*43758.5453;const noise=(grain-Math.floor(grain)-.5)*9;
      let rgb;
      if(kind==='jupiter'){
        const stripe=.5+.5*Math.tanh(band*1.4);rgb=[114+stripe*79,76+stripe*82,52+stripe*65];
        const spot=((u-.3)/.24)**2+((v-.29)/.105)**2;
        if(spot<1){const mix=(1-spot)*.72;rgb=rgb.map((c,i)=>c*(1-mix)+[145,64,35][i]*mix);}
      }else if(kind==='saturn')rgb=[176+band*10,155+band*10,110+band*9];
      else if(kind==='neptune')rgb=[39+band*4,83+band*7,137+band*10];
      else{
        const terrain=Math.sin(lon*11+Math.sin(lat*15)*1.5)*Math.sin(lat*16-lon*5);
        rgb=[139+terrain*30,70+terrain*19,43+terrain*13];
      }
      const light=.12+.88*Math.max(0,-u*.52-v*.36+z*.77),edge=Math.pow(z,.2),i=(y*size+x)*4;
      for(let c=0;c<3;c++)image.data[i+c]=Math.max(0,Math.min(255,(rgb[c]+noise)*light*edge));
      image.data[i+3]=Math.min(255,(1-Math.sqrt(rr))*size*255);
    }
    ctx.putImageData(image,0,0);return surface;
  }
  function mount(root){
    if(!root)return;
    const entries=[...root.querySelectorAll('[data-orbit-planet]')].map(canvas=>({canvas,kind:canvas.dataset.orbitPlanet,texture:texture(canvas.dataset.orbitPlanet)}));
    function paint(item){
      const {canvas,kind,texture}=item,w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
      const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
      const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
      const r=kind==='saturn'?w*.235:Math.min(w,h)*.48,cx=w/2,cy=h/2;
      function ring(front){
        ctx.save();ctx.translate(cx,cy);ctx.rotate(-.32);
        for(let q=1.23;q<2.06;q+=.018){
          if(q>1.72&&q<1.79)continue;
          const a=(.36+.2*Math.sin(q*70))*(front?1:.7);
          ctx.beginPath();ctx.ellipse(0,0,r*q,r*q*.31,0,front?0:Math.PI,front?Math.PI:TAU);
          ctx.strokeStyle=`rgba(175,160,125,${a})`;ctx.lineWidth=r*.019;ctx.stroke();
        }ctx.restore();
      }
      if(kind==='saturn')ring(false);
      ctx.drawImage(texture,cx-r,cy-r,r*2,r*2);
      // Fine ink over the sphere ties the small bodies to the main printed Earth.
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();ctx.fillStyle='rgba(3,8,14,.22)';
      for(let y=cy-r;y<cy+r;y+=4.2)for(let x=cx-r;x<cx+r;x+=4.2){ctx.beginPath();ctx.arc(x,y,.65,0,TAU);ctx.fill();}ctx.restore();
      if(kind==='saturn')ring(true);
    }
    const observer=new ResizeObserver(()=>entries.forEach(paint));entries.forEach(e=>{observer.observe(e.canvas);paint(e);});
    return ()=>{observer.disconnect();entries.forEach(e=>{e.canvas.width=e.canvas.height=0;e.texture.width=e.texture.height=0;});};
  }
  return {mount};
})();
