// Reuse the entrance's signal language without restarting its scene or renderer.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let state = null;
  function group(route) {
    if (!route || route === 'landing') return 'main';
    if (route === 'artist' || route.startsWith('artist-') || route.startsWith('artist/project/')) return 'artist';
    if (route === 'mentor' || route.startsWith('mentor-') || route.startsWith('mentor/project/')) return 'mentor';
    if (['who', 'about', 'cv', 'contact'].includes(route)) return 'who';
    return route;
  }
  function cancel() {
    if (!state) return;
    clearTimeout(state.timer);
    clearTimeout(state.safety);
    cancelAnimationFrame(state.frame);
    cancelAnimationFrame(state.revealFrame);
    for (const [element, inert] of state.roots) element.inert = inert;
    state.overlay.remove();
    document.body.classList.remove('route-transmitting');
    state = null;
  }
  function commit() {
    const current = state;
    if (!current) return;
    current.covered = true;
    current.committed = false;
    current.overlay.classList.add('route-covered');
    current.overlay.classList.remove('route-revealing');
    document.body.classList.remove('route-transmitting');
    cancelAnimationFrame(current.frame);
    // Leave the covered frame on screen before synchronous page construction.
    current.timer = setTimeout(() => {
      if (state !== current) return;
      try { current.action(); current.committed = true; }
      catch (error) { cancel(); throw error; }
      if (current.external) return;
      current.revealFrame = requestAnimationFrame(() => {
        current.revealFrame = requestAnimationFrame(() => {
          if (state !== current) return;
          // Expand a transparent circular aperture in the black overlay until
          // its radius clears every corner, including ultrawide/portrait screens.
          current.overlay.style.setProperty('--route-iris-end', `${Math.ceil(Math.hypot(innerWidth, innerHeight) / 2) + 4}px`);
          current.overlay.classList.add('route-revealing');
          current.timer = setTimeout(() => {
            if (state !== current) return;
            cancel();
            document.getElementById('content')?.focus({preventScroll:true});
          }, reduced.matches ? 100 : 500);
        });
      });
    }, 32);
  }
  function run(action, {external = false} = {}) {
    if (state) {
      // History changes during blackout should resolve to the latest route.
      state.action = action;
      state.external = external;
      if (state.covered) {
        clearTimeout(state.timer);
        cancelAnimationFrame(state.revealFrame);
        commit();
      }
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = `signal-handoff route-handoff${reduced.matches ? ' signal-handoff-reduced' : ''}`;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('popover', 'manual');
    overlay.innerHTML = `<svg class="signal-rgb-defs"><defs><filter id="route-signal-rgb" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset in="r" dx="5" dy="1" result="red"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/><feOffset in="gb" dx="-4" dy="-1" result="cyan"/><feBlend in="red" in2="cyan" mode="screen"/></filter></defs></svg><div class="signal-monitor"><i class="signal-corner tl"></i><i class="signal-corner tr"></i><i class="signal-corner bl"></i><i class="signal-corner br"></i><span class="signal-camera">CAM_01 / CANQI</span><span class="signal-rec">[ REC ]</span><span class="signal-caption">SWITCHING CHANNEL<br><small>TRANSFER ▪ ▪ ▪</small></span><span class="signal-palette"></span></div><canvas class="signal-noise" width="320" height="180"></canvas><div class="signal-scan"></div><div class="signal-tear"></div><div class="signal-black"></div>`;
    document.body.append(overlay);
    // A top-layer overlay also covers a project dialog during history navigation.
    if (overlay.showPopover) overlay.showPopover();
    else overlay.removeAttribute('popover');
    const roots = [...document.querySelectorAll('#header,#context-bar,#content,#footer')].map(el => [el, el.inert]);
    roots.forEach(([el]) => { el.inert = true; });
    state = {overlay, roots, action, external, covered:false, frame:0, revealFrame:0};
    const current = state;
    if (!reduced.matches) document.body.classList.add('route-transmitting');
    current.timer = setTimeout(commit, reduced.matches ? 200 : 400);
    // Restore interaction even if a tab is suspended during the reveal frames.
    current.safety = setTimeout(() => {
      if (state !== current) return;
      const pending = !current.committed;
      cancel();
      if (pending) current.action();
    }, 5000);
    if (reduced.matches) return;
    const canvas = overlay.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixels = ctx.createImageData(320,180);
    let previous = -100;
    function noise(now) {
      if (state !== current || current.covered || document.hidden) return;
      if (now - previous > 80) {
        previous = now;
        for (let p = 0; p < pixels.data.length; p += 4) {
          const value = Math.random() * 130;
          pixels.data[p] = value;
          pixels.data[p+1] = Math.random() > .94 ? 240 : value;
          pixels.data[p+2] = Math.random() > .94 ? 235 : value;
          pixels.data[p+3] = 255;
        }
        ctx.putImageData(pixels,0,0);
      }
      current.frame = requestAnimationFrame(noise);
    }
    current.frame = requestAnimationFrame(noise);
  }
  addEventListener('pagehide', cancel);
  addEventListener('pageshow', event => { if (event.persisted) cancel(); });
  window.CanqiRouteTransition = {group, run, cancel, get active() { return Boolean(state); }};
})();
