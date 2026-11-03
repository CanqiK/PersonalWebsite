/* ArtCraft-inspired timing, implemented locally without a perpetual animation loop. */
window.CanqiPageMotion = {
  followAmount: dt => 1-Math.exp(-.12*60*dt),
  mount(content) {
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const events=new AbortController();
    const listen=(el,type,fn,options={})=>el.addEventListener(type,fn,{...options,signal:events.signal});
    let frame=0,lastTime=0,target=window.scrollY,position=window.scrollY,expected=window.scrollY,maxScroll=0,complete=null,disposed=false;
    const scopes=new Map();
    const targets=new Map();
    const clamp=y=>Math.max(0,Math.min(maxScroll,y));
    const measure=()=>{maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);target=clamp(target);};
    function stop() { cancelAnimationFrame(frame);frame=0;lastTime=0;target=position=expected=window.scrollY;complete=null; }
    function tick(time) {
      frame=0;
      if(disposed||document.hidden||reduce.matches||document.querySelector('dialog[open]')) {stop();return;}
      const dt=lastTime?Math.min(.05,(time-lastTime)/1000):1/60;
      lastTime=time;
      // Retain subpixel progress even when the browser rounds native scrollY.
      const next=position+(target-position)*window.CanqiPageMotion.followAmount(dt);
      const done=Math.abs(target-next)<.75;
      position=expected=done?target:next;
      window.scrollTo({top:expected,left:window.scrollX,behavior:'instant'});
      if(done) {lastTime=0;const callback=complete;complete=null;callback?.();}
      else frame=requestAnimationFrame(tick);
    }
    const start=()=>{if(!frame&&!document.hidden&&!disposed)frame=requestAnimationFrame(tick);};
    function scrollTo(y,{immediate=false,onComplete}={}) {
      stop();measure();target=clamp(y);
      if(immediate||reduce.matches) {
        position=expected=target;window.scrollTo({top:target,left:window.scrollX,behavior:'instant'});onComplete?.();
      } else {complete=onComplete;start();}
    }
    function ownsNativeScroll(event) {
      return event.composedPath().some(el=>{
        if(!(el instanceof Element)||el===document.body||el===document.documentElement)return false;
        if(el.matches('dialog,textarea,input,select,[contenteditable="true"],[data-native-scroll]'))return true;
        return el.scrollHeight>el.clientHeight+1 && /auto|scroll/.test(getComputedStyle(el).overflowY);
      });
    }
    listen(window,'wheel',event=>{
      if(!fine.matches||reduce.matches||event.defaultPrevented||!event.cancelable||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.querySelector('dialog[open]')||ownsNativeScroll(event))return;
      const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
      if(!delta)return;
      if(!frame || (target-window.scrollY)*delta<0)target=position=window.scrollY;
      const next=clamp(target+delta);
      if(next===window.scrollY&&!frame)return;
      event.preventDefault();complete=null;target=next;start();
    },{passive:false});
    listen(window,'scroll',()=>{if(frame&&Math.abs(window.scrollY-expected)>2)stop();else if(!frame)target=position=expected=window.scrollY;},{passive:true});
    listen(window,'pointerdown',stop,{passive:true});
    listen(window,'touchstart',stop,{passive:true});
    listen(window,'keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Escape'].includes(event.key))stop();});
    listen(window,'resize',measure,{passive:true});
    listen(window,'pagehide',stop);
    const sizeObserver=new ResizeObserver(measure);
    sizeObserver.observe(document.body);sizeObserver.observe(content);measure();

    const selectors=[
      '.artist-intro > *','.artist-section-heading > *','.artist-group-heading','.artist-card',
      '.feature-projector','.feature-controls','.page-heading','.about-portraits > *',
      '.reading-copy > *','.cv-row > h2','.cv-entry','.cv-pdf-wrap','.contact-poster',
      '.branch-title','.branch-copy','.pending','.branch-art','.archive-note',
      '.artist-detail-heading','.artist-detail-meta','.artist-detail-image','.artist-detail-text > section','.artist-detail-next',
      '.project-heading','.project-meta','.project-visual','.project-sections > *','.project-next'
    ].join(',');
    function show(el) {
      el.removeAttribute('data-motion-waiting');
      el.classList.remove('motion-rule-entering');
      const state=targets.get(el);
      if(state){state.animation?.cancel();state.animation=null;state.shown=true;state.observer?.unobserve(el);}
    }
    function reveal(el) {
      const state=targets.get(el);
      if(!state||state.shown)return;
      state.shown=true;state.observer.unobserve(el);el.removeAttribute('data-motion-waiting');
      if(reduce.matches||typeof el.animate!=='function')return;
      const rect=el.getBoundingClientRect();
      // Keep expensive blur off large images/posters and reduce it on touch devices.
      const blur=el.matches('.artist-card,.feature-projector,.artist-detail-image,.project-visual')||rect.width*rect.height>420000?0:fine.matches?8:3;
      const grid=el.closest('.artist-card-grid,.works-grid');
      const delay=grid?Math.max(0,Math.min(180,(rect.left-grid.getBoundingClientRect().left)/grid.clientWidth*180)):0;
      const frames=Array.from({length:31},(_,i)=>{
        const offset=i/30,rest=Math.pow(1-offset,4);
        return {offset,opacity:1-rest,translate:`0 ${28*rest}px`,...(blur?{filter:`blur(${blur*rest}px)`}:{})};
      });
      const animation=el.animate(frames,{duration:900,delay,easing:'linear',fill:'backwards'});
      state.animation=animation;
      if(el.matches('.artist-group-heading'))el.classList.add('motion-rule-entering');
      animation.finished.then(()=>{if(state.animation===animation){state.animation=null;el.classList.remove('motion-rule-entering');}},()=>{});
    }
    function clearScope(scope) {
      const state=scopes.get(scope);if(!state)return;
      state.observer.disconnect();
      state.elements.forEach(el=>{show(el);targets.delete(el);});
      scopes.delete(scope);
    }
    function refresh(scope=content) {
      clearScope(scope);
      if(reduce.matches||!window.IntersectionObserver)return;
      const inDialog=scope.matches('dialog');
      const observer=new IntersectionObserver(entries=>{
        entries.filter(e=>e.isIntersecting).forEach(e=>reveal(e.target));
      },{root:inDialog?scope:null,rootMargin:`0px 0px -${Math.round((inDialog?scope.clientHeight:innerHeight)*.12)}px 0px`,threshold:0});
      const elements=[...scope.querySelectorAll(selectors)].filter(el=>inDialog||!el.closest('dialog'));
      scopes.set(scope,{observer,elements});
      const passed=elements.map(el=>el.getBoundingClientRect().bottom<0);
      elements.forEach((el,index)=>{
        const state={shown:false,animation:null,observer};targets.set(el,state);
        // Content already passed by a direct section link must remain visible.
        if(passed[index]){state.shown=true;return;}
        el.setAttribute('data-motion-waiting','');observer.observe(el);
      });
    }
    listen(content,'focusin',event=>{for(const [el] of targets)if(el.contains(event.target))show(el);});
    listen(content,'close',event=>{if(event.target.matches('dialog'))clearScope(event.target);}, {capture:true});
    listen(document,'visibilitychange',()=>{
      if(document.hidden)stop();
      for(const state of targets.values()) {
        if(state.animation)document.hidden?state.animation.pause():state.animation.play();
      }
    });
    listen(reduce,'change',()=>{
      stop();for(const scope of [...scopes.keys()])clearScope(scope);
      if(!reduce.matches){refresh();content.querySelectorAll('dialog[open]').forEach(refresh);}
    });
    refresh();content.querySelectorAll('dialog[open]').forEach(refresh);
    return {scrollTo,stop,refresh,destroy(){
      disposed=true;stop();events.abort();sizeObserver.disconnect();
      for(const scope of [...scopes.keys()])clearScope(scope);
    }};
  }
};
