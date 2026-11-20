/* A blue-green halftone Earth in a quiet stellar field; all rendering stays local. */
(() => {
  const TAU=Math.PI*2,rad=Math.PI/180;
  const land=[];
  const coordinates=window.CANQI_GLOBE_LAND||[];
  for(let i=0;i<coordinates.length;i+=2){
    const lon=coordinates[i]*rad,lat=coordinates[i+1]*rad;
    land.push([Math.cos(lat)*Math.sin(lon),-Math.sin(lat),Math.cos(lat)*Math.cos(lon)]);
  }
  const sea=Array.from({length:2600},(_,i)=>{
    const y=1-(i+.5)*2/2600,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));
    return [Math.cos(a)*r,y,Math.sin(a)*r];
  });
  function mount(root){
    if(!root)return;
    const canvas=root.querySelector('.student-orbit-visual canvas'),ctx=canvas?.getContext('2d',{alpha:true});
    if(!ctx)return;
    const toggle=root.querySelector('[data-globe-toggle]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
    let paused=motion.matches,visible=false,disposed=false,frame=0,last=0,time=0,width=0;
    const tilt=-13*rad,ct=Math.cos(tilt),st=Math.sin(tilt);
    const orbitTilt=-26*rad,oc=Math.cos(orbitTilt),os=Math.sin(orbitTilt);
    const circle=(x,y,r)=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU)};
    function paint(){
      if(!width)return;
      const w=width,cx=w*.5,cy=w*.5,R=w*.355,angle=-95*rad+time*TAU/110;
      const ca=Math.cos(angle),sa=Math.sin(angle),ratio=canvas.width/w;
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,w);
      const project=p=>{
        const x=p[0]*ca+p[2]*sa,z=-p[0]*sa+p[2]*ca;
        return [x*ct-p[1]*st,x*st+p[1]*ct,z];
      };
      function orbit(a){const x=Math.cos(a)*R*1.31,y=Math.sin(a)*R*.51;return [cx+x*oc-y*os,cy+x*os+y*oc,Math.sin(a)];}
      function path(front){
        ctx.beginPath();let started=false;
        for(let i=0;i<=180;i++){const p=orbit(i/180*TAU);if((p[2]>=0)!==front){started=false;continue;}if(!started)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);started=true;}
        ctx.strokeStyle=front?'#839994':'#42535b';ctx.lineWidth=.7;ctx.stroke();
      }
      const sat=orbit(.6+time*TAU/29);
      function satellite(){
        const dx=sat[0]-cx,dy=sat[1]-cy,dir=Math.atan2(dy,dx),scale=Math.max(.7,w/570);
        if(sat[2]>.1){
          ctx.beginPath();ctx.moveTo(sat[0],sat[1]);ctx.lineTo(cx+Math.cos(dir-.17)*R,cy+Math.sin(dir-.17)*R);ctx.lineTo(cx+Math.cos(dir+.17)*R,cy+Math.sin(dir+.17)*R);ctx.closePath();ctx.fillStyle='rgba(190,193,160,.09)';ctx.fill();
          ctx.beginPath();ctx.moveTo(sat[0],sat[1]);ctx.lineTo(cx+Math.cos(dir)*R,cy+Math.sin(dir)*R);ctx.strokeStyle='rgba(199,202,173,.42)';ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);
        }
        ctx.save();ctx.translate(sat[0],sat[1]);ctx.rotate(dir+Math.PI);ctx.scale(scale,scale);
        ctx.strokeStyle='#c7c7b2';ctx.lineWidth=.85;ctx.fillStyle='#182f3c';
        for(const y of [-27,10]){ctx.fillRect(-7,y,14,17);ctx.strokeRect(-7,y,14,17);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(0,y+17);ctx.moveTo(-7,y+8.5);ctx.lineTo(7,y+8.5);ctx.stroke();}
        ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,10);ctx.stroke();ctx.fillStyle='#cac8b8';ctx.fillRect(-6,-6,12,12);ctx.strokeRect(-6,-6,12,12);
        ctx.strokeStyle='#777966';ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,6);ctx.moveTo(-6,6);ctx.lineTo(6,-6);ctx.stroke();
        ctx.strokeStyle='#dfddce';ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(12,0);ctx.moveTo(12,-6);ctx.quadraticCurveTo(20,0,12,6);ctx.moveTo(16,0);ctx.lineTo(22,0);ctx.stroke();ctx.restore();
      }
      path(false);if(sat[2]<0)satellite();
      const ocean=ctx.createRadialGradient(cx-R*.37,cy-R*.4,R*.08,cx,cy,R);
      ocean.addColorStop(0,'#143f5b');ocean.addColorStop(.48,'#0c2d48');ocean.addColorStop(.8,'#071c2e');ocean.addColorStop(1,'#030c16');
      ctx.beginPath();circle(cx,cy,R);ctx.fillStyle=ocean;ctx.fill();ctx.strokeStyle='#567380';ctx.lineWidth=.65;ctx.stroke();
      ctx.save();ctx.beginPath();circle(cx,cy,R-.8);ctx.clip();
      ctx.beginPath();for(const p of sea){const [x,y,z]=project(p);if(z>0)circle(cx+x*R,cy+y*R,Math.max(.35,R*.0042)*(.45+z*.55));}ctx.fillStyle='#46728c';ctx.fill();
      const bins=Array.from({length:12},()=>[]);
      for(const p of land){const [x,y,z]=project(p);if(z<=.005)continue;const light=Math.max(0,-x*.35-y*.25+z*.85);const level=Math.min(11,Math.floor((.2+light*.8)*11));bins[level].push([cx+x*R,cy+y*R,R*.012*(.43+.57*z),z]);}
      bins.forEach((points,i)=>{
        const light=i/11;ctx.fillStyle=`rgb(${Math.round(18+light*21)},${Math.round(48+light*37)},${Math.round(40+light*20)})`;
        ctx.beginPath();for(const [x,y,r] of points)circle(x,y,r*.87);ctx.fill();
        ctx.strokeStyle=`rgb(${Math.round(55+light*112)},${Math.round(97+light*100)},${Math.round(72+light*75)})`;ctx.lineWidth=Math.max(.55,R*.0038);
        ctx.beginPath();for(const [x,y,r] of points)circle(x,y,r);ctx.stroke();
        ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();for(const [x,y,r] of points)circle(x,y,r*.25);ctx.fill();
      });ctx.restore();
      path(true);if(sat[2]>=0)satellite();
    }
    function active(){return visible&&!paused&&!document.hidden&&!root.closest('.mentor-page')?.querySelector('dialog[open]');}
    function tick(now){
      frame=0;if(disposed||!active()){last=0;return;}
      if(!last)last=now;
      if(now-last>=1000/30){time+=Math.min((now-last)/1000,.08);last=now;paint();}
      frame=requestAnimationFrame(tick);
    }
    function sync(){if(disposed)return;const running=active();root.dataset.orbitRunning=String(running);if(running){if(!frame)frame=requestAnimationFrame(tick);}else{cancelAnimationFrame(frame);frame=0;last=0;}}
    function resize(){const next=canvas.getBoundingClientRect().width;if(!next)return;width=next;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*dpr);paint();}
    function label(){const lang=document.documentElement.lang.startsWith('zh')?'zh':'en';toggle.dataset.paused=String(paused);toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',lang==='zh'?(paused?'播放地球与流星动画':'暂停地球与流星动画'):(paused?'Play Earth and meteor animation':'Pause Earth and meteor animation'));toggle.title=toggle.getAttribute('aria-label');}
    function click(event){event.preventDefault();paused=!paused;label();sync();}
    function preference(){paused=motion.matches;label();sync();paint();}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});observer.observe(canvas);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
    const dialog=root.closest('.mentor-page')?.querySelector('dialog');const modalObserver=new MutationObserver(sync);if(dialog)modalObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
    toggle.addEventListener('click',click);motion.addEventListener('change',preference);document.addEventListener('visibilitychange',sync);
    resize();label();
    return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();modalObserver.disconnect();toggle.removeEventListener('click',click);motion.removeEventListener('change',preference);document.removeEventListener('visibilitychange',sync);};
  }
  window.CanqiMentorGlobe={mount};
})();
