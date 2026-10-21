/* The room uses three composited planes; no additional WebGL scene. */
window.CanqiHomeScene = {
  fitBoard(width,height,naturalHeight) {
    const area={left:width*.155,top:height*.12,width:width*.72,height:height*.66};
    const scale=Math.min(area.width/1006,area.height/(naturalHeight+32));
    return {scale,width:area.width/scale,left:area.left,
      top:area.top+(area.height-naturalHeight*scale)/2};
  },
  // Project a flat rectangle onto four measured corners (TL, TR, BR, BL).
  // All coordinates are in the same illustrated plate as the furniture.
  projectQuad(width, height, points) {
    const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=points;
    const dx1=x1-x2, dx2=x3-x2, dy1=y1-y2, dy2=y3-y2;
    const sx=x0-x1+x2-x3, sy=y0-y1+y2-y3;
    const denominator=dx1*dy2-dx2*dy1;
    const g=(sx*dy2-dx2*sy)/denominator;
    const h=(dx1*sy-sx*dy1)/denominator;
    return [(x1-x0+g*x1)/width,(y1-y0+g*y1)/width,0,g/width,
      (x3-x0+h*x3)/height,(y3-y0+h*y3)/height,0,h/height,
      0,0,1,0,x0,y0,0,1];
  },
  mount(root) {
    if (!root) return () => {};
    const camera = root.querySelector('.scene-camera');
    const rear = root.querySelector('.scene-rear');
    const windowLayer = root.querySelector('.scene-window');
    const workstation = root.querySelector('.scene-workstation');
    const screen = root.querySelector('.desk-crt');
    const photos = root.querySelector('.desk-props .wall-photos');
    const board = root.querySelector('.investigation-board');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const mobile = matchMedia('(max-width: 760px)');
    const events = new AbortController();
    const on = (el, type, fn) => el.addEventListener(type, fn, {signal: events.signal});
    let frame = 0, last = 0, visible = true, destroyed = false, focused = null;
    let x = 0, y = 0, tx = 0, ty = 0, zoom = 1, tz = 1, fx = 0, fy = 0, tfx = 0, tfy = 0;
    let flashTimer = 0, cooldown = 0;
    let bounds = root.getBoundingClientRect();
    const active = () => !reduce.matches && !mobile.matches && fine.matches;
    const schedule = () => {
      if (!frame && !destroyed && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    function draw(time) {
      frame = 0;
      const amount = active() ? 1 - Math.exp(-Math.min(.05, last ? (time-last)/1000 : 1/60) * 6) : 1;
      last = time;
      x += (tx-x)*amount; y += (ty-y)*amount;
      zoom += (tz-zoom)*amount; fx += (tfx-fx)*amount; fy += (tfy-fy)*amount;
      camera.style.transform = `translate3d(${fx}px,${fy}px,0) scale(${zoom})`;
      rear.style.transform = `translate3d(${-x*2}px,${-y*1.3}px,0)`;
      windowLayer.style.transform = `translate3d(${-x*4}px,${-y*2.5}px,0)`;
      workstation.style.transform = `translate3d(${-x*8}px,${-y*5}px,0)`;
      if (Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(tz-zoom)*100+Math.abs(tfx-fx)+Math.abs(tfy-fy) > .015) schedule();
      else last = 0;
    }
    function reset() { tx=ty=tfx=tfy=0; tz=1; focused=null; schedule(); }
    function measure() {
      bounds = root.getBoundingClientRect();
      bounds.scrollY=window.scrollY;
      // Keep the whole composition visible: cover-cropping cuts off the CRT on
      // narrower desktop windows and hides the ceiling on ultrawide screens.
      const width = root.clientWidth;
      const height = root.clientHeight;
      root.style.setProperty('--plate-width', `${width}px`);
      root.style.setProperty('--plate-height', `${height}px`);
      root.style.setProperty('--plate-left', `${(root.clientWidth-width)/2}px`);
      root.style.setProperty('--plate-top', `${root.clientHeight-height}px`);
      if (mobile.matches) {
        ['width','left','top','transform'].forEach(key=>board.style.removeProperty(key));
      } else {
        const layout=window.CanqiHomeScene.fitBoard(width,height,board.offsetHeight);
        board.style.width=`${layout.width}px`;
        board.style.left=`${layout.left}px`;
        board.style.top=`${layout.top}px`;
        board.style.transform=`scale(${layout.scale})`;
      }
      const project = (element,w,h,corners) => {
        element.style.transform=`matrix3d(${window.CanqiHomeScene.projectQuad(w,h,corners).join(',')})`;
      };
      if (!mobile.matches) {
        const platePoints = corners => corners.map(([x,y])=>[x*width/1536,y*height/1024]);
        // Actual lit glass corners inside the existing monitor bezel.
        project(screen,160,200,platePoints([[79,724],[185,710],[198,834],[92,854]]));
        // A common tabletop plane, receding toward the desk's vanishing point.
        // Both small prints sit behind the front edge and clear the cup/chair.
        project(photos,220,160,platePoints([[370,900],[525,900],[500.7,940],[330.2,940]]));
      } else {
        screen.style.removeProperty('transform');
        photos.style.removeProperty('transform');
      }
      reset();
    }
    function focusPanel(panel) {
      if (panel===focused) return;
      focused=panel;
      if (!active() || document.documentElement.classList.contains('home-intro-active')) return;
      tz=panel ? 1.022 : 1;
      if(panel) {
        const r=panel.getBoundingClientRect();
        const scene=root.getBoundingClientRect();
        tfx=-(r.left+r.width/2-scene.left-scene.width/2)*.022;
        tfy=-(r.top+r.height/2-scene.top-scene.height/2)*.022;
      } else tfx=tfy=0;
      schedule();
    }
    const panelOf = target => target instanceof Element ? target.closest('.home-file,.paper-stack,.home-id,.home-bookmark') : null;
    on(root, 'pointermove', e => {
      if(!active() || document.documentElement.classList.contains('home-intro-active')) return;
      // Client coordinates account for scrolling without a layout read on every move.
      const rectTop=bounds.top+(bounds.scrollY||0)-window.scrollY;
      tx=Math.max(-1,Math.min(1,(e.clientX-bounds.left)/bounds.width*2-1));
      ty=Math.max(-1,Math.min(1,(e.clientY-rectTop)/bounds.height*2-1));
      schedule();
    });
    on(root, 'pointerenter', () => { bounds=root.getBoundingClientRect(); bounds.scrollY=window.scrollY; });
    on(root, 'pointerleave', reset);
    on(root, 'pointerover', e => focusPanel(panelOf(e.target)));
    on(root, 'focusin', e => focusPanel(panelOf(e.target)));
    on(root, 'focusout', e => { if(!root.contains(e.relatedTarget)) reset(); });
    on(screen, 'click', () => {
      if(reduce.matches || performance.now()<cooldown) return;
      cooldown=performance.now()+1400;
      root.classList.add('room-power-pulse');
      clearTimeout(flashTimer);
      flashTimer=setTimeout(()=>root.classList.remove('room-power-pulse'),780);
    });
    function visibility() {
      const paused=document.hidden || !visible;
      root.classList.toggle('scene-paused',paused);
      if(paused) { cancelAnimationFrame(frame); frame=0; last=0; }
      else schedule();
    }
    on(document,'visibilitychange',visibility);
    [reduce,fine,mobile].forEach(query=>on(query,'change',measure));
    const resize=new ResizeObserver(measure); resize.observe(root);
    const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visibility();});
    intersection.observe(root);
    measure();
    return () => {
      destroyed=true; events.abort(); resize.disconnect(); intersection.disconnect();
      cancelAnimationFrame(frame); clearTimeout(flashTimer);
    };
  }
};
