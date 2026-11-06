/* A responsive, sliced room plate: furniture keeps one uniform scale. */
window.CanqiHomeScene = {
  fitRoom(width,height) {
    const scale=Math.min(width/1536,height/1024);
    const top=height-1024*scale;
    const extra=Math.max(0,width-1536*scale)/2;
    let left=0;
    // Only the two empty wall / desktop strips absorb extra viewport width.
    const slices=[[0,500,0],[500,2,extra],[502,528,0],[1030,70,extra],[1100,436,0]].map(([x,w,gap])=>{
      const slice={sourceX:x,sourceWidth:w,left,width:w*scale+gap};
      left+=slice.width;
      return slice;
    });
    return {scale,top,slices};
  },
  roomMarkup(width,height,frame,foreground=false) {
    const image='<image href="assets/investigation-room-lowpoly.webp" width="1536" height="1024"/>';
    if(foreground) {
      const right=frame.slices[4].left-1100*frame.scale;
      // Trace the existing faceted lamp, including the open space between arms.
      const lamp='M1288 574 L1336 526 L1352 524 L1359 500 L1379 499 L1399 509 L1394 521 L1390 547 L1409 609 L1393 615 L1335 599 L1305 588 Z M1394 521 L1414 519 L1423 535 L1506 648 L1520 648 L1527 660 L1521 678 L1508 678 L1464 823 L1474 831 L1472 850 L1461 853 L1460 864 L1509 873 L1509 899 L1432 907 L1388 895 L1388 866 L1445 861 L1445 850 L1433 844 L1434 828 L1444 822 L1484 674 L1482 654 L1406 552 L1390 547 Z';
      return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><defs><clipPath id="home-lamp-silhouette"><path d="${lamp}"/></clipPath></defs><g transform="translate(${right} ${frame.top}) scale(${frame.scale})" clip-path="url(#home-lamp-silhouette)">${image}</g></svg>`;
    }
    // Extend a continuous wall band between ceiling and furniture, rather than
    // bottom-aligning the entire plate over an unrelated filler image.
    const rows=[{y:0,h:110,top:0,height:110*frame.scale},
      {y:110,h:290,top:110*frame.scale,height:290*frame.scale+frame.top},
      {y:400,h:624,top:400*frame.scale+frame.top,height:624*frame.scale}];
    const strips=frame.slices.flatMap(s=>rows.map(r=>`<svg x="${s.left}" y="${r.top}" width="${s.width+.2}" height="${r.height+.2}" viewBox="${s.sourceX} ${r.y} ${s.sourceWidth} ${r.h}" preserveAspectRatio="none">${image}</svg>`)).join('');
    return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">${strips}</svg>`;
  },
  fitBoard(width,height,naturalHeight) {
    const area={left:width*.155,top:height*.12,width:width*.755,height:height*.66};
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
    const backdrop = workstation.querySelector('.scene-backdrop');
    const foreground = document.createElement('div');
    foreground.className='scene-foreground';
    foreground.setAttribute('aria-hidden','true');
    workstation.append(foreground);
    const rain = windowLayer.querySelector('.scene-rain').cloneNode(true);
    rain.classList.add('scene-fitted-rain');
    rain.setAttribute('aria-hidden','true');
    workstation.append(rain);
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
      // Preserve the furniture proportions; only empty architecture can expand.
      const width = root.clientWidth;
      const height = root.clientHeight;
      const room = window.CanqiHomeScene.fitRoom(width,height);
      rain.style.cssText=`left:0;top:${82*room.scale}px;width:${144*room.scale}px;height:${584*room.scale+room.top}px`;
      root.style.setProperty('--plate-width', `${width}px`);
      root.style.setProperty('--plate-height', `${height}px`);
      root.style.setProperty('--plate-left', `${(root.clientWidth-width)/2}px`);
      root.style.setProperty('--plate-top', `${root.clientHeight-height}px`);
      if (mobile.matches) {
        root.classList.remove('scene-fitted');
        backdrop.replaceChildren();
        foreground.replaceChildren();
        ['width','left','top','transform'].forEach(key=>board.style.removeProperty(key));
      } else {
        root.classList.add('scene-fitted');
        backdrop.innerHTML=window.CanqiHomeScene.roomMarkup(width,height,room);
        foreground.innerHTML=window.CanqiHomeScene.roomMarkup(width,height,room,true);
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
        const platePoints = corners => corners.map(([x,y])=>[x*room.scale,y*room.scale+room.top]);
        // Actual lit glass corners inside the existing monitor bezel.
        project(screen,160,200,platePoints([[79,724],[185,710],[198,834],[92,854]]));
        // A common tabletop plane, receding toward the desk's vanishing point.
        // Both small prints sit behind the front edge and clear the cup/chair.
        project(photos,220,160,platePoints([[350,900],[480,900],[460,936],[320,936]]));
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
      foreground.remove();
      rain.remove();
    };
  }
};
