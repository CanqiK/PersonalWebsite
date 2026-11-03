/* A reading-progress landing capsule. Updated only on scroll/resize/content changes. */
(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'return-rocket';
  button.hidden = true;
  button.innerHTML = `<svg viewBox="0 0 40 80" aria-hidden="true" focusable="false">
    <g class="rocket-flame"><path fill="#b45b25" d="M16 58h8v10h-2v8h-4v-8h-2z"/><path fill="#f39c38" d="M17 59h6v9h-2v5h-2v-5h-2z"/><path fill="#f9e8b0" d="M18 59h4v7h-4z"/></g>
    <path fill="#282c29" d="M15 3h10v4h2v12h2v34h-3v7H14v-7h-3V19h2V7h2z"/>
    <path fill="#dfdfcd" d="M16 5h8v4h2v13h1v29h-2v5H15v-5h-2V22h1V9h2z"/>
    <path fill="#a5ada4" d="M14 20h3v31h-2v4h-2V23h1zM24 9h2v42h-3v5h2v-5h2V22h-1V9z"/>
    <path fill="#f4f0d8" d="M18 7h4v10h-4zM18 22h4v28h-4z"/>
    <path fill="#b84430" d="M19 7h5v7h-5z"/><path fill="#e7a95c" d="M20 8h1v2h-1z"/>
    <path fill="#343e3a" d="M12 23h3v9h-3zM25 23h3v9h-3zM18 19h4v3h-4zM17 54h6v5h-6z"/>
    <path fill="#7c8379" d="M17 33h2v2h-2zM21 33h2v2h-2zM17 38h2v2h-2zM21 38h2v2h-2zM17 43h2v2h-2zM21 43h2v2h-2z"/>
    <path fill="#2b312e" d="M12 46h3v6h-3v5H9v5H5v3H1v-3h3v-4h4v-5h4zM25 46h3v7h4v5h4v4h3v3h-4v-3h-4v-5h-3v-5h-3z"/>
    <path fill="#b7bdae" d="M12 49h2v3h-2v5H9v4H5v2H3v-1h2v-3h4v-5h3zM26 49h2v5h3v5h4v3h2v1h-2v-2h-4v-4h-3v-5h-2z"/>
    <path class="rocket-pad" fill="#8c9385" d="M3 68h34v2H3zM9 72h22v1H9z"/>
  </svg><span class="rocket-tip" role="tooltip"></span>`;
  document.body.append(button);
  const content = document.getElementById('content');
  let frame = 0, movingTimer = 0, scroller = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function update() {
    frame = 0;
    const dialog = document.querySelector('.artist-project-dialog[open],.mentor-project-dialog[open]');
    const show = !document.body.classList.contains('on-main');
    button.hidden = !show;
    if (!show) return;
    // A modal lives in the browser's top layer; its control must live there too.
    const parent = dialog || document.body;
    if (button.parentNode !== parent) parent.append(button);
    scroller = dialog || document.scrollingElement;
    const zh = document.documentElement.lang.startsWith('zh');
    const label = zh ? '回到顶部' : 'Back to top';
    button.setAttribute('aria-label', label);
    button.querySelector('.rocket-tip').textContent = label;
    const rect = dialog?.getBoundingClientRect();
    let start = rect ? rect.top + 76 : 16;
    if (!rect) for (const el of document.querySelectorAll('#header,#context-bar')) {
      if (!el.hidden) start += el.offsetHeight;
    }
    const bottom = rect ? Math.min(innerHeight,rect.bottom) : innerHeight;
    const end = Math.max(16,bottom - button.offsetHeight - (rect ? 20 : 62));
    start = clamp(start,16,end);
    const max = Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    const progress = max ? clamp(scroller.scrollTop/max,0,1) : 0;
    button.style.setProperty('--rocket-y',`${Math.round(start+(end-start)*progress)}px`);
    button.style.right = `${rect ? Math.max(4,innerWidth-rect.right+(innerWidth<=600?2:12)) : innerWidth<=600?5:18}px`;
    button.classList.toggle('is-landed',max>0 && progress>=.997);
  }
  function queue() { if (!frame) frame=requestAnimationFrame(update); }
  document.addEventListener('scroll',event=>{
    if (event.target!==document && event.target!==scroller) return;
    button.classList.add('is-moving');
    clearTimeout(movingTimer);
    movingTimer=setTimeout(()=>button.classList.remove('is-moving'),160);
    queue();
  },{capture:true,passive:true});
  button.addEventListener('click',()=>{
    if (scroller instanceof HTMLDialogElement) {
      scroller.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
      const title=scroller.querySelector('h2');
      if(title){title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}
    } else window.dispatchEvent(new Event('canqi:back-to-top'));
  });
  addEventListener('resize',queue,{passive:true});
  addEventListener('hashchange',queue);
  new ResizeObserver(queue).observe(content);
  new MutationObserver(queue).observe(content,{childList:true});
  new MutationObserver(queue).observe(document.body,{attributes:true,attributeFilter:['class']});
  new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  new MutationObserver(queue).observe(content,{subtree:true,attributes:true,attributeFilter:['open']});
  content.addEventListener('load',queue,true);
  queue();
})();
