(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const content = $('#content');
  let lang = 'en';
  try { lang = localStorage.getItem('canqi-wireframe-language') === 'zh' ? 'zh' : 'en'; } catch {}
  let selectedProject = '';
  let currentRoute = '';
  const effects = { treatment: 'halftone', dot: 3 };
  const t = (en, zh) => lang === 'zh' ? zh : en;
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M13 5l7 7-7 7"/></svg>';
  const works = [
    { id:'power-off', title:'Power Off', zh:'断电', year:'2022', medium:['Immersive theatre performance','沉浸式戏剧表演'], category:'performance', study:0 },
    { id:'bsod', title:'Power Off — B.S.O.D.', zh:'Power Off — B.S.O.D.', year:'2022', medium:['Derivative performance','衍生剧目'], category:'performance', study:1 },
    { id:'gavel-room', title:'The Gavel Room', zh:'槌室', year:'2023–2025', medium:['Installation · experimental theatre','装置 · 实验戏剧'], category:'installation', study:2 },
    { id:'fishbird', title:'Fishbird [Sumeru]', zh:'鱼鸟「须弥」', year:'2025', medium:['Exhibition space · installation','展厅空间 · 装置'], category:'spatial', study:3 },
    { id:'carnival', title:'Carnival Nervous System', zh:'狂欢节神经系统', year:'2024', medium:['Art installation · exhibition design','艺术装置 · 展陈设计'], category:'other', study:4 },
    { id:'chang', title:'CHANG | “隙”', zh:'CHANG | “隙”', year:'2023', medium:['Theatre festival concept installation','戏剧节概念装置'], category:'installation', study:5 }
  ];
  const selectedWorks = [
    works[0], works[1],
    {...works[2], year:'2023', medium:['Installation · visual experimental theatre','装置视觉实验戏剧']},
    {id:'gavel-crypt',title:'Gavel Room — The Crypt',zh:'槌室 — The Crypt',year:'2023',medium:['Video installation · spatial exhibition','影像装置空间展'],category:'installation',study:2},
    {id:'gavel-film',title:'Gavel Room 2025',zh:'槌室 2025 影像',year:'2025',medium:['Moving image','影像'],category:'installation',study:2},
    works[4], works[3], works[5]
  ];
  const otherGroups = [
    {id:'theatre',en:'Theatre',zh:'戏剧',items:[
      {id:'three-alcoholics',title:'Three Alcoholics',zh:'三个酒鬼',year:'2023',medium:['Stage installation design','舞台装置设计'],study:0},
      {id:'floating-life',title:'The Floating Life',zh:'山海浮生',year:'2022',medium:['Project management · lighting design','项目管理 · 灯光设计'],study:1}
    ]},
    {id:'spatial',en:'Spatial',zh:'空间',items:[
      {id:'miao',title:'miao',zh:'淼',year:'2026',medium:['Retail display','门店陈设'],study:3},
      {id:'meilishuo',title:'Leather project: world',zh:'群花',year:'2026',medium:['MEILISHUO Exhibition display design for the Canton Fair, Guangzhou.','美丽说 广交会沉浸式装置展厅设计'],study:4},
      {id:'molabo',title:'molabo',zh:'molabo',year:'2023',medium:['Coffee shop interior concept','咖啡门店室内方案'],study:5},
      {id:'kingnalri',title:'KINAREE',zh:'金那里',year:'',medium:['Restaurant interior concept','餐饮空间概念设计'],study:3},
      {id:'flowing-interior',title:'Flowing Interior',zh:'曲水流觞',year:'',medium:['Interior design','室内设计'],study:4}
    ]},
    {id:'concepts',en:'Concepts / 4-Topias',zh:'概念 / 4-Topias',items:[
      {id:'dys-topia',title:'DYS TOPIA AGL',zh:'DYS TOPIA AGL',year:'',medium:['Infant Genetic Engineering Education Incubator','婴儿基因工程教育孵化器'],study:5},
      {id:'u-topia',title:'U TOPIA — The Under',zh:'U TOPIA — The Under',year:'',medium:['Modular Underground City System','模块化地下城市系统'],study:0},
      {id:'hetero-topia',title:'HETERO TOPIA — Kaleidoscope',zh:'HETERO TOPIA — Kaleidoscope',year:'',medium:["World’s Civilisations Monuments",'世界文明纪念碑'],study:1},
      {id:'hybri-topia',title:'HYBRI TOPIA — Ballon I’ Prolifa',zh:'HYBRI TOPIA — Ballon I’ Prolifa',year:'',medium:['Nightclub branding space model','夜店品牌空间模型'],study:2}
    ]}
  ];
  const allArtistWorks = [...selectedWorks,...otherGroups.flatMap(group=>group.items)];
  function updateWorkSelection() {
    content.querySelectorAll('[data-work-id]').forEach(card=>{
      card.classList.toggle('is-selected',card.dataset.workId===selectedProject);
    });
  }
  const featuredWorks = [works[0],works[1],selectedWorks[2],works[3]];
  let featuredIndex = 0;
  let featuredTimer = 0;
  let disposeProjector = null;
  let slideTimers = [];
  let scrollFrame = 0;
  let pageMotion = null;
  window.addEventListener('canqi:back-to-top', () => {
    const focusTop = () => content.focus({preventScroll:true});
    if (pageMotion) pageMotion.scrollTo(0,{onComplete:focusTop});
    else {window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});focusTop();}
  });
  let lastArtistSection = 'artist-featured';
  let homePaperIndex = 0;
  let homePaperTurning = false;
  let homePaperWheel = 0;
  let homePaperTimers = [];
  let homeTouchStart = null;
  let suppressHomeClickUntil = 0;
  let homeIntroTransition = null;
  const titleOf = w => lang === 'zh' ? w.zh : w.title;
  const art = (n, label = '') => `<canvas data-study="${n}" role="img" aria-label="${label || t('Abstract halftone composition — image placeholder, not project documentation','抽象半调图形 — 图像占位，非作品记录')}"></canvas>`;
  const projectImage = (w,eager=false,small=true) => window.CanqiProjects?.thumbnail(w.id,lang,eager,small) || art(w.study);
  const hasProjectImage = w => Boolean(window.CanqiProjects?.get(w.id)?.hero);
  const imageNote = w => hasProjectImage(w) ? t('Project documentation','项目资料') : t('Image study / placeholder','图像实验 / 占位图');
  const caption = () => `<figcaption class="image-caption"><span>${t('IMAGE STUDY / PLACEHOLDER','图像实验 / 占位图')}</span><span>CANQI</span></figcaption>`;
  const link = (href, en, zh) => `<a class="text-link" href="#${href}">${t(en,zh)}${arrow}</a>`;
  const role = () => t('Performative installation artist.<br>Spatial narrative designer.<br>Experimental theatre director.','行为装置艺术家。<br>空间叙事设计师。<br>实验戏剧导演。');
  const branchName = b => b === 'artist' ? t('As an artist','作为艺术家') : b === 'mentor' ? t('As a mentor','作为导师') : t('Who am I?','我是谁？');
  const routeNames = { works:['Works','作品'], about:['About','关于'], cv:['CV','履历'], contact:['Have you seen Canqi?','你见过燦琪吗？'] };

  function coverSheet(w) {
    const number=String(featuredWorks.indexOf(w)+1).padStart(2,'0');
    return `<article class="cover" data-project="${w.id}" aria-label="${t('Featured project newspaper','精选项目报纸')} — ${titleOf(w)}">
      <div class="cover-topline"><span>CANQI / ${t('SELECTED PROJECT','精选项目')}</span><span>${number} / 04 — ${w.year}</span></div>
      <h1 class="cover-title">${titleOf(w)}</h1>
      <div class="cover-subline"><span>${lang==='zh'?w.title:w.zh}</span><span>${t(...w.medium)}</span></div>
      <div class="cover-middle">${projectImage(w,true)}<span class="cover-vertical" aria-hidden="true">CANQI</span></div>
      <div class="cover-cutout" aria-hidden="true"><span>${w.year}</span><span class="cover-cutout-small">${t('PROJECT','项目')} ${number}</span></div>
      <div class="cover-bottom"><strong>${number}<small> / 04</small></strong><p>${t(...w.medium)}<br><br>${imageNote(w)}</p></div>
      <a class="cover-open" href="#artist/project/${w.id}"><span>${t('Open project','进入项目')}</span>${arrow}</a>
    </article>`;
  }
  function cover() {
    const underlay=`<div class="paper-underlay paper-underlay-back" aria-hidden="true"><span class="underlay-masthead">CANQI / ${t('PROJECT ARCHIVE','项目档案')}</span><span class="underlay-frame"></span><span class="underlay-line long"></span><span class="underlay-line"></span><span class="underlay-line short"></span><span class="underlay-side-frame"></span><span class="underlay-footer">${t('IMAGE / TEXT / PROCESS','图像 / 文字 / 过程')}</span></div>`;
    return `<div class="paper-stack" id="home-paper-stack" role="region" tabindex="0" aria-label="${t('Featured newspapers. Scroll, swipe horizontally or use left and right arrow keys to turn.','精选项目报纸。滚动、左右滑动或按左右方向键翻页。')}">${underlay}<div class="paper-underlay paper-underlay-middle" aria-hidden="true"><span class="underlay-masthead">CANQI / ${t('SELECTED WORKS','精选作品')}</span><span class="underlay-frame"></span><span class="underlay-line long"></span><span class="underlay-line"></span><span class="underlay-line short"></span><span class="underlay-side-frame"></span><span class="underlay-footer">${t('STUDY / DOCUMENT / INDEX','实验 / 记录 / 索引')}</span></div><div class="home-paper-front" id="home-paper-front">${coverSheet(featuredWorks[homePaperIndex])}</div></div>`;
  }
  function clearHomeIntro() {
    if (!homeIntroTransition) return;
    const state = homeIntroTransition;
    homeIntroTransition = null;
    state.animations.forEach(animation => animation.cancel());
    state.audio?.dispose();
    state.overlay.remove();
    content.classList.remove('home-arriving','home-arrived');
    if(content.querySelector('.investigation-board'))startWallThreads();
    document.documentElement.classList.remove('home-intro-pending','home-intro-active','home-intro-revealing');
    state.locked.forEach(([element,inert]) => { element.inert = inert; });
  }
  async function startHomeIntro() {
    const html = document.documentElement;
    if (!html.classList.contains('home-intro-pending')) return;
    clearTimeout(window.homeIntroFallback);
    // Consume the handoff marker so reload and ordinary home navigation stay direct.
    const url = new URL(location.href);
    url.searchParams.delete('intro');
    url.hash = 'main';
    history.replaceState(null,'',url);
    const overlay = $('#home-intro');
    const state = {overlay,animations:[],locked:[content,$('#header'),$('#footer')].map(element=>[element,element.inert])};
    let audioEnabled = true;
    try {
      audioEnabled = sessionStorage.getItem('canqi-intro-sound') !== 'off';
      sessionStorage.removeItem('canqi-intro-sound');
    } catch {}
    homeIntroTransition = state;
    const animate = (element,frames,options) => {
      const animation = element.animate(frames,{fill:'forwards',...options});
      state.animations.push(animation);
      return animation.finished;
    };
    try {
      overlay.innerHTML = `<div class="home-intro-shade"></div><div class="intro-poster"><span class="mini-cover"><strong>CANQI</strong>${art(2)}<small><span>燦琪 / SELECTED WORKS</span><span>2026</span></small></span></div>`;
      const poster = overlay.querySelector('.intro-poster');
      const shade = overlay.querySelector('.home-intro-shade');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      state.locked.forEach(([element])=>{element.inert=true;});
      html.classList.add('home-intro-active');
      html.classList.remove('home-intro-pending');
      if (reduced) {
        poster.hidden = true;
        html.classList.add('home-intro-revealing');
        await animate(shade,[{opacity:1},{opacity:0}],{duration:180});
        return;
      }
      content.classList.add('home-arriving');
      // Keep visual entry independent of sound permissions or audio support.
      import('./interaction-audio.js?v=feedback-2').then(async sound => {
        if (homeIntroTransition !== state) return;
        const audio = sound.createIntroAudio(audioEnabled);
        state.audio = audio;
        await audio.ready;
        if (homeIntroTransition === state && !overlay.classList.contains('is-scattering')) audio.cue('drop');
      }).catch(() => {});
      if (homeIntroTransition !== state) return;
      drawStudies(overlay);
      const landed = 'translate(-50%,-50%) rotate(-4deg)';
      state.audio?.cue('drop');
      await animate(poster,[{transform:'translate(-50%,calc(-50% - 110vh)) rotate(-9deg)'},{transform:landed}],{duration:680,easing:'cubic-bezier(.16,1,.3,1)'});
      const grow = Math.min(1.8,Math.max(1.12,Math.min(innerWidth*.86,540)/poster.offsetWidth));
      await animate(poster,[{transform:landed},{transform:`translate(-50%,-50%) rotate(0) scale(${grow})`}],{duration:440,delay:120,easing:'cubic-bezier(.65,0,.35,1)'});
      overlay.classList.add('is-scattering');
      state.audio?.cue('scatter');
      content.classList.add('home-arrived');
      html.classList.add('home-intro-revealing');
      await animate(shade,[{opacity:1},{opacity:0}],{duration:600,easing:'ease'});
    } catch (error) {
      // Cancelling on route changes or Escape is expected; other failures fail open.
      if (error.name !== 'AbortError') console.warn('Home introduction skipped:',error);
    } finally {
      if (homeIntroTransition === state) {
        clearHomeIntro();
        content.focus({preventScroll:true});
      }
    }
  }
  function home() {
    const identities=[
      {href:'artist',number:'01',en:'Canqi as artist',zh:'燦琪，作为艺术家',kind:['ART / PERFORMANCE','艺术 / 表演']},
      {href:'mentor',number:'02',en:'Canqi as mentor',zh:'燦琪，作为导师',kind:['TEACHING / MENTORING','教学 / 指导']},
      {href:'artist-spatial',number:'03',en:'Canqi as designer',zh:'燦琪，作为设计师',kind:['SPACE / DESIGN','空间 / 设计']}
    ];
    const pin=id=>`<span class="wall-pin" data-wall-pin="${id}" aria-hidden="true"></span>`;
    return `<section class="home home-investigation" aria-label="${t('Canqi’s investigation wall','燦琪的线索墙')}">
      <div class="scene-camera">
      <div class="scene-rear" aria-hidden="true"><div class="scene-plate scene-backdrop"></div></div>
      <div class="scene-window" aria-hidden="true"><div class="scene-plate scene-backdrop"><div class="scene-rain"></div></div></div>
      <div class="scene-workstation">
      <div class="scene-plate scene-backdrop" aria-hidden="true"></div>
      <div class="investigation-board">
        <svg class="wall-threads" aria-hidden="true"><g></g></svg>
        <aside class="home-aside home-left">
          <div class="home-file">${pin('file')}<span class="home-file-tab">CANQI / ${t('PERSONAL FILE','个人档案')} — 001</span><p class="artist-role">${role()}</p></div>

        </aside>
        <div class="home-center">
          <div class="wall-paper-pin">${pin('project')}</div>
          ${cover()}
          <a class="home-bookmark" href="#artist-selected">${pin('works')}<span class="home-bookmark-words"><span>${t('Explore','探索')}</span> <span>${t('the','精选')}</span> <span>${t('works','作品')}</span></span><span class="home-bookmark-arrow">${arrow}</span></a>
        </div>
        <aside class="home-aside right home-right"><div class="home-identities" aria-label="${t('Canqi identities','燦琪的身份')}">${identities.map(item=>`<a class="home-id" href="#${item.href}">${pin(item.href)}<span class="home-id-top"><span>CANQI / ID ${item.number}</span><span>燦琪</span></span><span class="home-id-body"><span class="home-id-photo" aria-hidden="true">C.</span><strong>${t(item.en,item.zh)}</strong></span><span class="home-id-bottom"><span>${t(...item.kind)}</span>${arrow}</span></a>`).join('')}</div>${link('who','Who am I?','我是谁？')}</aside>
      </div>
      <div class="desk-props scene-plate">
        <button class="desk-crt" type="button" aria-label="${t('Crocursionism — flicker the room lights','Crocursionism — 让房间灯光闪动')}" title="${t('Click to flicker the lights','点击，让灯光闪动')}"><img decoding="async" src="assets/crocursionism-logo.jpg" alt="Crocursionism" width="1326" height="1280"></button>
          <div class="wall-photos">
            <a class="wall-photo wall-photo-portrait" href="#about" aria-label="${t('About Canqi','关于燦琪')}"><img decoding="async" src="assets/canqi-portrait.jpg" alt="${t('Canqi in a bird mask','佩戴鸟形面具的燦琪')}" width="640" height="640"><span>CANQI / ${t('PORTRAIT','肖像')}</span></a>
            <a class="wall-photo wall-photo-seaside" href="#who" aria-label="${t('Who am I?','我是谁？')}"><img decoding="async" src="assets/canqi-seaside.png" alt="${t('Canqi by the sea','海边的燦琪')}" width="723" height="714"><span>${t('Who am I?','我是谁？')} ${arrow}</span></a>
          </div>
      </div>
      </div><div class="room-light-dip" aria-hidden="true"></div></div>
    </section>`;
  }
  let disposeHomeScene=null;
  let disposeWhoAscii=null;
  let wallObserver=null;
  let wallFrame=0;
  function stopWallThreads(){
    wallObserver?.disconnect();wallObserver=null;
    cancelAnimationFrame(wallFrame);
  }
  function startWallThreads(){
    stopWallThreads();
    const board=content.querySelector('.investigation-board');
    if(!board)return;
    const svg=board.querySelector('.wall-threads');
    const draw=()=>{
      if(!board.isConnected)return;
      const bounds=board.getBoundingClientRect();
      svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
      const positions={};
      board.querySelectorAll('[data-wall-pin]').forEach(pin=>{
        const r=pin.getBoundingClientRect();
        positions[pin.dataset.wallPin]=[r.left+r.width/2-bounds.left,r.top+r.height/2-bounds.top];
      });
      const pairs=[['file','project'],['project','artist'],['project','mentor'],['works','artist-spatial'],['mentor','artist-spatial']];
      svg.querySelector('g').innerHTML=pairs.map(([a,b])=>{
        const p=positions[a],q=positions[b];
        return `<path d="M${p[0]},${p[1]} Q${(p[0]+q[0])/2},${(p[1]+q[1])/2+7} ${q[0]},${q[1]}"/>`;
      }).join('');
    };
    const schedule=()=>{cancelAnimationFrame(wallFrame);wallFrame=requestAnimationFrame(draw);};
    wallObserver=new ResizeObserver(schedule);
    wallObserver.observe(board);
    wallObserver.observe(board.closest('.home-investigation'));
    board.querySelectorAll('.home-left,.home-center,.home-right').forEach(el=>wallObserver.observe(el));
    board.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule,{once:true}));
    schedule();
  }
  function artistCard(w, small = false, index = 0) {
    return `<a class="artist-card ${small ? 'artist-card-small' : ''}" href="#artist/project/${w.id}" data-project-open="${w.id}" data-work-id="${w.id}"><span class="artist-card-image">${projectImage(w)}</span><div class="artist-card-copy"><h4 class="artist-card-title">${titleOf(w)}</h4><span class="artist-card-meta"><span>${w.year || '—'}</span><span class="artist-card-arrow" aria-hidden="true">${arrow}</span></span></div></a>`;
  }
  function featureImage(w) {
    return `<div class="feature-slide">${projectImage(w,true,false)}<span class="feature-vignette" aria-hidden="true"></span><span class="feature-film" aria-hidden="true"></span></div>`;
  }
  function featureCopy(w) {
    return `<div class="feature-copy-top"><span>${t('FEATURED PROJECT','精选项目')} / ${String(featuredWorks.indexOf(w)+1).padStart(2,'0')}—04</span><span>${imageNote(w)}</span></div><div class="feature-copy-main"><div><span class="feature-index">${String(featuredWorks.indexOf(w)+1).padStart(2,'0')} / 04</span><h2>${titleOf(w)}</h2><p>${lang === 'zh' ? w.title : w.zh}</p></div><a class="feature-enter" href="#artist/project/${w.id}" data-project-open="${w.id}">${t('Enter project','进入项目')}${arrow}</a></div><div class="feature-copy-bottom"><span>${w.year}</span><span>${t(...w.medium)}</span><span>CANQI / 燦琪</span></div>`;
  }
  function artist() {
    const selectedGroups = [
      {en:'POWER OFF / 断电',zh:'POWER OFF / 断电',items:selectedWorks.slice(0,2)},
      {en:'THE GAVEL ROOM / 槌室',zh:'THE GAVEL ROOM / 槌室',items:selectedWorks.slice(2,5)},
      {en:'INDEPENDENT PROJECTS',zh:'独立项目',items:selectedWorks.slice(5)}
    ];
    return `<div class="artist-page">
      <section class="artist-featured" id="artist-featured" aria-labelledby="artist-heading">
        <div class="artist-intro"><h1 id="artist-heading">${t('As an artist.','作为艺术家。')}</h1><p>${t('Selected projects, spatial narratives and performances.','精选项目、空间叙事与表演。')}</p></div>
        <div class="feature-projector" id="feature-projector" aria-label="${t('Featured project slideshow','精选项目幻灯片')}"><div class="feature-media" id="feature-media">${featureImage(featuredWorks[featuredIndex])}</div><div class="feature-copy" id="feature-copy">${featureCopy(featuredWorks[featuredIndex])}</div></div>
        <div class="feature-controls"><span>${t('01 / FEATURED PROJECTS','01 / 精选项目')}</span><div><button type="button" data-slide="previous" aria-label="${t('Previous project','上一个项目')}">←</button><button type="button" data-slide="next" aria-label="${t('Next project','下一个项目')}">→</button></div><span>${t('AUTO ADVANCE / 06 SEC','自动切换 / 06 秒')}</span></div>
      </section>
      <div class="artist-index-grid">
      <section class="artist-collection" id="artist-selected" aria-labelledby="selected-heading"><div class="artist-section-heading"><span>02 / ${t('THE INDEX','索引')}</span><h2 id="selected-heading">${t('Selected<br>works.','精选<br>作品。')}</h2><p>${t('Projects and their related works. Select a card to open the project within this page.','项目及其关联作品。点击作品卡片，在当前页面内展开项目。')}</p></div>
        ${selectedGroups.map(group=>`<section class="artist-work-group"><div class="artist-group-heading"><h3>${t(group.en,group.zh)}</h3><span>${String(group.items.length).padStart(2,'0')} ${t('WORKS','件作品')}</span></div><div class="artist-card-grid">${group.items.map((w,i)=>artistCard(w,false,i)).join('')}</div></section>`).join('')}

      </section>
      <section class="artist-collection artist-other" id="artist-other" aria-labelledby="other-heading"><div class="artist-section-heading"><span>03 / ${t('THE ARCHIVE','档案')}</span><h2 id="other-heading">${t('Other<br>works.','其他<br>作品。')}</h2><p>${t('A smaller index of theatre, spatial and conceptual projects.','戏剧、空间和概念项目的小型索引。')}</p></div>
        ${otherGroups.map(group=>`<section class="artist-work-group" id="artist-${group.id}"><div class="artist-group-heading"><h3>${t(group.en,group.zh)}</h3><span>${String(group.items.length).padStart(2,'0')} ${t('WORKS','件作品')}</span></div><div class="artist-card-grid artist-card-grid-small">${group.items.map((w,i)=>artistCard(w,true,i)).join('')}</div></section>`).join('')}

      </section>
      </div>
      <dialog class="artist-project-dialog" id="artist-project-dialog" aria-labelledby="artist-dialog-title"></dialog>
    </div>`;
  }
  function mentor() {return window.CanqiMentor.render(lang,location.hash.slice(1));}
  let lastMentorSection='mentor-gafa';
  function updateMentorNav() {
    const rail=content.querySelector('.mentor-institutions');if(!rail)return;
    if(rail.scrollWidth>rail.clientWidth+1&&!content.querySelector('dialog[open]')) {
      const middle=rail.getBoundingClientRect().left+rail.clientWidth/2;
      const nearest=[...rail.children].reduce((best,section)=>{
        const rect=section.getBoundingClientRect(),distance=Math.abs(rect.left+rect.width/2-middle);
        return !best||distance<best.distance?{id:section.id,distance}:best;
      },null);
      if(nearest)lastMentorSection=nearest.id;
    }
    document.querySelectorAll('#secondary [data-mentor-section]').forEach(a=>{
      if(a.dataset.mentorSection===lastMentorSection)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
    });
  }
  function syncMentorRoute(route,animate=false) {
    const dialog=$('#artist-project-dialog');if(!dialog)return;
    if(route.startsWith('mentor/project/')) {
      const id=route.split('/')[2],record=window.CanqiProjects.get(id);
      if(!record||record.branch!=='mentor')return;
      lastMentorSection=record.mentorSection||'mentor-gafa';
      document.title=`${record.title[lang]||record.title.en} — CANQI 燦琪`;
      if(dialog.dataset.project!==id) {
        pageMotion?.stop();window.CanqiProjects.stopVideos(dialog);
        dialog.innerHTML=window.CanqiProjects.render(id,lang,true);dialog.dataset.project=id;
        if(!dialog.open)dialog.showModal();dialog.scrollTop=0;pageMotion?.refresh(dialog);
      }
    }else{
      if(dialog.open)dialog.close();
      if(route==='mentor-gafa'||route==='mentor-sfk'||route==='mentor') {
        document.title=`${t('As a mentor.','作为导师。')} — CANQI 燦琪`;
        lastMentorSection=route==='mentor'?'mentor-gafa':route;
        const rail=content.querySelector('.mentor-institutions'),section=document.getElementById(lastMentorSection);
        if(rail&&section&&rail.scrollWidth>rail.clientWidth+1)rail.scrollTo({left:rail.scrollLeft+section.getBoundingClientRect().left-rail.getBoundingClientRect().left,behavior:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
        if(route!=='mentor')scrollToSection(lastMentorSection,animate,updateMentorNav);
      }
    }
    updateMentorNav();
  }
  function startMentor() {
    const rail=content.querySelector('.mentor-institutions');
    if(!rail)return;
    rail.addEventListener('scroll',updateMentorNav,{passive:true});
    rail.addEventListener('keydown',event=>{
      if(event.target!==rail||!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();location.hash=event.key==='ArrowRight'?'mentor-sfk':'mentor-gafa';
    });
    $('#artist-project-dialog').addEventListener('close',()=>{
      if(location.hash.startsWith('#mentor/project/')){
        const projectHref=location.hash;
        history.replaceState(null,'',`#${lastMentorSection}`);setupNavigation(lastMentorSection);currentRoute=lastMentorSection;
        document.title=`${t('As a mentor.','作为导师。')} — CANQI 燦琪`;
        content.querySelector(`a[href="${CSS.escape(projectHref)}"]`)?.focus({preventScroll:true});
      }
    });
  }

  function who() {
    return `<div class="who-page">${about()}${cv()}${contact()}<p class="who-interaction-credit">${t('Interaction inspired by','互动效果灵感来自')} <a href="https://www.contentarchitecture.dev/#pricing" target="_blank" rel="noopener noreferrer">The Content Architecture</a>.</p></div>`;
  }
  function archive() {
    return `<section class="page"><div class="page-heading"><h1>${t('Works.','作品。')}</h1><p>${t('Performance, installation and spatial narrative.','表演、装置与空间叙事。')}</p></div><div class="works-grid" id="works-grid"></div><p class="archive-note">${t('Projects, process and documentation. Abstract studies mark works whose images are still to be added.','作品、过程与记录。尚未补充作品图像的条目保留抽象图像。')}</p></section>`;
  }
  function fillWorks() {
    $('#works-grid').innerHTML=allArtistWorks.map(w=>artistCard(w)).join('');
    updateWorkSelection();
  }
  function about() {
    return `<section class="page reading" id="about"><div class="page-heading"><h1>${t('About.','关于。')}</h1><p>CANQI LIN / 林燦琪</p></div><div class="reading-grid"><div class="about-portraits"><figure><img decoding="async" class="about-portrait" src="assets/canqi-portrait.jpg" alt="${t('Canqi Lin wearing a bird mask in a black-and-white portrait.','林燦琪佩戴鸟形面具的黑白肖像。')}" width="640" height="640"><figcaption class="image-caption"><span>${t('CANQI LIN / PORTRAIT','林燦琪 / 肖像')}</span><span>CANQI</span></figcaption></figure><img decoding="async" class="about-snapshot" src="assets/canqi-seaside.png" alt="${t('Canqi by the sea, with a ship in the background.','林燦琪在海边，背后是一艘船。')}" width="723" height="714" loading="lazy"></div><div class="reading-copy"><p>${t('Canqi Lin is a performative installation artist, visual storyteller, experimental theatre director and spatial designer.','林燦琪是一位行为装置艺术家、视觉叙事创作者、实验戏剧导演与空间设计师。')}</p><p class="small-copy about-background">${t('Beginning with architecture and environmental art, he expanded his practice into spatial theatre, installation and digital media. He studied at Guangzhou Academy of Fine Arts and completed an MFA in Spatial Performance and Design in the AAIS Interprofessional Studio at the Architectural Association in London.','他从建筑与环境艺术设计出发，逐步将创作延伸至空间戏剧、装置艺术与数字媒体。他本科毕业于广州美术学院，并在伦敦建筑联盟学院 AAIS 跨专业工作室取得空间表演与设计硕士学位。')}</p><h2>${t('Practice & approach','创作与方法')}</h2><p class="small-copy">${t('His work uses space as a narrative medium, bringing performance, physical installation and digital interaction together to explore how people, technology, nature and social relationships shape one another.','他的创作以空间为叙事媒介，结合表演、实体装置与数字交互，探讨人与技术、自然及社会关系如何相互塑造。')}</p><h2>${t('Teaching & design','教学与设计')}</h2><p class="small-copy">${t('Alongside his artistic practice, he works on digital-arts teaching and curriculum development at SFK International Art Education. He has mentored digital-media projects there and taught interdisciplinary spatial design as an externally appointed lecturer at Guangzhou Academy of Fine Arts.','在艺术实践之外，他现于斯芬克国际艺术教育从事数字艺术教学与课程研发，曾担任数字媒体项目导师，并受聘于广州美术学院讲授跨学科空间设计课程。')}</p><div class="about-next">${link('cv','Read the CV','查看履历')}</div></div></div></section>`;
  }
  function cv() {
    const sections = [
      {heading:['Education','教育背景'],entries:[
        ['09.2021 — 06.2023','MFA, Spatial Performance and Design','空间表演与设计硕士','Architectural Association School of Architecture, AAIS Interprofessional Studio, London.','伦敦建筑联盟学院 AAIS 跨专业工作室。'],
        ['07.2017 — 06.2021','BA, Environmental Art and Design','环境艺术设计学士','School of Architecture and Applied Arts, Guangzhou Academy of Fine Arts.','广州美术学院建筑艺术设计学院。']
      ]},
      {heading:['Teaching & professional roles','教学与工作经历'],entries:[
        [['04.2026 — Present','2026.04 — 至今'],'Academic Supervisor and Curriculum Development','数字艺术科系教研','SFK International Art Education; teaching, curriculum and programme development.','斯芬克国际艺术教育；负责数字艺术教学、课程及教学产品研发。',true],
        ['04.2024 — 04.2026','Digital Media Project Mentor','数字媒体项目导师','SFK International Art Education; mentoring digital-media and spatial-performance projects.','斯芬克国际艺术教育；指导数字媒体与空间表演项目。'],
        ['10.2024 — 12.2024','Externally Appointed Lecturer','外聘专业课讲师','School of Architecture and Applied Arts, Guangzhou Academy of Fine Arts; interdisciplinary spatial and digital design.','广州美术学院建筑艺术设计学院；讲授空间与数字设计跨学科课程。'],
        ['2023 — 03.2024','Spatial Designer','空间设计师','HEYTEA, Shenzhen headquarters; retail interiors, display systems and store concepts.','喜茶深圳总部空间设计部；参与门店空间、陈设系统与概念设计。']
      ]},
      {heading:['Selected projects & presentations','精选项目与展出'],entries:[
        ['10.2026','Leather project: world','群花','MEILISHUO Exhibition display design for the Canton Fair, Guangzhou.','美丽说 广交会沉浸式装置展厅设计',true],
        ['01.2026','MIAO / 淼','MIAO / 淼','Commercial display and installation design, Guangzhou.','商业展陈及装置设计，广州。'],
        ['10.2025','Fishbird [Sumeru]','鱼鸟「须弥」','Curatorial and installation design for BUZHITANSUO art space, Guangzhou.','不止探索艺术空间的策展与装置设计，广州。'],
        ['12.2024','Carnival Nervous System','狂欢节神经系统','Art-installation exhibition design and production.','艺术装置展陈设计与制作。'],
        ['01.2024','Zen Machine','禅宗机器人','Interactive installation presented in “Uncertain Variables” at Artsect Gallery.','互动装置，展于 Artsect 画廊主题展“未定变量”。'],
        ['03.2023 — 05.2023','The Gavel Room','槌室','Experimental theatre and installation; creator, director and stage designer. A related work was presented at The Crypt Gallery’s POLYPHONIC exhibition in London.','实验戏剧与装置；项目创意人、导演及舞台设计师。相关作品于伦敦 The Crypt Gallery 的“POLYPHONIC”展出。'],
        ['08.2022','The Floating Life','山海浮生','Edinburgh Festival Fringe; project management, lighting design and photography.','爱丁堡艺穗节项目；项目管理、灯光设计与摄影。'],
        ['03.2022 — 05.2022','POWER OFF / POWER OFF — B.S.O.D.','断电 / 断电蓝屏','Immersive performances in Glasgow and London; project founder, director and spatial-installation designer.','格拉斯哥及伦敦的沉浸式戏剧；项目创始人、导演及空间装置设计师。']
      ]}
    ];
    return `<section class="page reading" id="cv"><div class="page-heading"><h1>${t('Curriculum<br>vitae.','个人<br>履历。')}</h1><p>CANQI LIN / 林燦琪<br>${t('SELECTED RECORD / 2026','精选履历 / 2026')}</p></div><div class="cv-list">${sections.map(section=>`<section class="cv-row"><h2>${t(...section.heading)}</h2><div class="cv-entries">${section.entries.map(([date,en,zh,enDetail,zhDetail,ongoing])=>`<div class="cv-entry"><time>${Array.isArray(date)?t(...date):date}</time><div><div class="cv-entry-title"><strong>${t(en,zh)}</strong>${ongoing?`<span class="cv-entry-status">${t('ONGOING','进行中')}</span>`:''}</div><p>${t(enDetail,zhDetail)}</p></div></div>`).join('')}</div></section>`).join('')}</div><div class="cv-pdf-wrap"><a class="cv-pdf-link" href="assets/canqi-lin-cv-2026-en.pdf" target="_blank" rel="noopener" type="application/pdf"><span><strong>${t('View full CV','查看完整履历')}</strong><small>${t('ENGLISH PDF / 2026','英文 PDF / 2026')}</small></span>${arrow}</a></div></section>`;
  }
  function contact() {
    const icons={
      email:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
      linkedin:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M7 10v7M11 17v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7" cy="7" r=".6"/>',
      instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
      rednote:'<path d="M4 4h6c2 0 2 2 2 2s0-2 2-2h6v15h-6c-2 0-2 1-2 1s0-1-2-1H4Z"/><path d="M12 6v14M7 8h2m6 0h2M7 12h2m6 0h2"/>',
      youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3Z"/>'
    };
    const contacts=[
      {id:'email',label:'Email',account:'louvslefv@gmail.com'},
      {id:'linkedin',label:'LinkedIn',account:'Canqi Lin',url:'https://www.linkedin.com/in/canqi-lin-61aa2a243/'},
      {id:'instagram',label:'Instagram',account:'@lcanqi',url:'https://www.instagram.com/lcanqi/',qr:true},
      {id:'rednote',label:t('Rednote','小红书'),account:'502184641',url:'https://www.xiaohongshu.com/user/profile/5c358d61000000000503e5d8?xsec_token=YB6QJ4M-4y8vqn2avj5wCOjzaIj6DVa7XMfYGkpDXWYLo=&xsec_source=app_share',qr:true},
      {id:'youtube',label:'YouTube',account:'@klocii4744',url:'https://www.youtube.com/@klocii4744'}
    ];
    const slips=contacts.map(c=>{
      const body=`<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[c.id]}</svg><strong class="contact-platform">${c.label}</strong><span class="contact-account">${c.account}</span><span class="contact-action">${c.id==='email'?t('COPY','复制'):t('OPEN ↗','打开 ↗')}</span>`;
      const action=c.url?`<a class="contact-slip-action" data-poster-slip href="${c.url.replaceAll('&','&amp;')}" target="_blank" rel="noopener noreferrer" aria-label="${c.label}: ${c.account} — ${t('opens in a new tab','在新标签页打开')}">${body}</a>`:`<button class="contact-slip-action" type="button" data-poster-slip data-copy-email aria-label="${t('Copy email address','复制邮箱地址')}: ${c.account}">${body}</button>`;
      return `<div class="poster-slip">${action}${c.qr?`<button class="contact-qr-toggle" type="button" data-contact-qr="${c.id}" aria-expanded="false" aria-controls="contact-qr-${c.id}">${t('QR code','二维码')}</button>`:''}</div>`;
    }).join('');
    const qrPanels=contacts.filter(c=>c.qr).map(c=>`<div class="contact-qr-panel" id="contact-qr-${c.id}" hidden><div class="contact-qr-heading"><strong>${c.label} / ${c.account}</strong><button type="button" data-qr-close aria-label="${t('Close QR code','关闭二维码')}">×</button></div><div class="contact-qr-image contact-qr-image--${c.id}"><img decoding="async" src="assets/contact-${c.id}-qr.jpg" alt="${t(`Scan to find Canqi on ${c.label}`,`扫描二维码在${c.label}找到 Canqi`)}" loading="lazy"></div><p>${t('Scan with your phone, or use the tab above to open the profile.','用手机扫描，或点击上方纸条直接打开主页。')}</p></div>`).join('');
    return `<section class="page contact-page" id="contact"><div class="contact-poster"><span class="poster-tape poster-tape-left" aria-hidden="true"></span><span class="poster-tape poster-tape-right" aria-hidden="true"></span><div class="poster-body"><span class="poster-kicker">CANQI / ${t('NOTICE 001','寻人启事 001')}</span><h1 class="poster-heading">HAVE YOU<br>SEEN CANQI?</h1><figure class="poster-portrait"><img decoding="async" src="assets/canqi-portrait.jpg" alt="${t('Canqi Lin wearing a bird mask.','佩戴鸟形面具的林燦琪。')}" width="640" height="640"></figure><p class="poster-caption">${t('LAST SEEN BETWEEN PERFORMANCE, INSTALLATION AND SPACE.','最后出现于表演、装置与空间之间。')}</p><p class="poster-description">${t('For exhibitions, residencies, research and collaborations, take a tab. Copy an email. Follow a trace.','关于展览、驻地、研究与合作，请取一张纸条。复制邮箱，或循着线索找到我。')}</p><div class="poster-bottom"><span>${t('TAKE A TAB / KEEP LOOKING','撕下一张 / 继续寻找')}</span><a href="#about">${t('About Canqi','关于燦琪')} ${arrow}</a></div></div><div class="poster-tearoffs" role="group" aria-label="${t('Tear-off contact tabs','可撕取的联系纸条')}">${slips}</div>${qrPanels}<p class="poster-status" id="poster-status" aria-live="polite"></p></div></section>`;
  }
  function project(id) {
    if(window.CanqiProjects?.get(id))return window.CanqiProjects.render(id,lang,false);
    const w = allArtistWorks.find(x => x.id === id);
    if (!w) return `<section class="page"><h1>${t('Project not found.','未找到作品。')}</h1>${link('works','Return to works','返回作品列表')}</section>`;
    const next = allArtistWorks[(allArtistWorks.indexOf(w)+1)%allArtistWorks.length];
    return `<article class="page reading"><div class="page-heading project-heading"><h1>${titleOf(w)}</h1><p>${lang==='en' && w.title!==w.zh ? w.zh : w.title}</p></div><div class="project-meta"><span>${t(...w.medium)}</span><span>${w.year}</span><span>${t('Selected work','精选作品')} / ${String(allArtistWorks.indexOf(w)+1).padStart(2,'0')}</span></div><figure class="project-visual">${art(w.study)}${caption()}</figure><div class="project-sections"><section><h2>${t('The work','关于作品')}</h2><p>${t('Project statement, context, and the artist’s role to be added.','项目陈述、背景与创作者角色待补充。')}</p></section><section><h2>${t('Process & research','过程与研究')}</h2><p>${t('Research questions, working material, installation documentation, and credits to be added.','研究问题、过程材料、作品记录与完整署名待补充。')}</p></section></div><nav class="project-next" aria-label="${t('Project navigation','作品导航')}"><a href="#works">${t('Back to works','返回作品')}</a><a href="#work/${next.id}">${t('Next','下一件')} / ${titleOf(next)} ${arrow}</a></nav></article>`;
  }
  function artistDetail(id) {
    if(window.CanqiProjects?.get(id))return window.CanqiProjects.render(id,lang,true);
    const w=allArtistWorks.find(item=>item.id===id);
    if(!w)return `<div class="artist-detail"><button type="button" class="artist-detail-close" data-project-close>${t('Close','关闭')} ×</button><h2 id="artist-dialog-title">${t('Project not found.','未找到作品。')}</h2></div>`;
    const list=allArtistWorks;
    const next=list[(list.indexOf(w)+1)%list.length];
    return `<article class="artist-detail"><div class="artist-detail-bar"><span>CANQI / ${t('PROJECT INDEX','作品索引')}</span><button type="button" class="artist-detail-close" data-project-close aria-label="${t('Close project','关闭项目')}">${t('Close / back to artist','关闭 / 返回艺术家页面')} ×</button></div><header class="artist-detail-heading"><span>${String(list.indexOf(w)+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}</span><h2 id="artist-dialog-title">${titleOf(w)}</h2><p>${lang==='zh'?w.title:w.zh}</p></header><div class="artist-detail-meta"><span>${w.year||'—'}</span><span>${t(...w.medium)}</span><span>${t('Project detail','项目详情')}</span></div><figure class="artist-detail-image">${art(w.study)}${caption()}</figure><div class="artist-detail-text"><section><h3>${t('The work','关于作品')}</h3><p>${t('Project statement, context and the artist’s role will be added after review.','项目陈述、背景与创作者角色将在核实后补充。')}</p></section><section><h3>${t('Process & documentation','过程与记录')}</h3><p>${t('Process material, project images and complete credits to be added.','过程材料、作品图像与完整署名待补充。')}</p></section></div><a class="artist-detail-next" href="#artist/project/${next.id}">${t('Next project','下一件作品')} / ${titleOf(next)} ${arrow}</a></article>`;
  }
  function updateArtistNav() {
    if(!content.querySelector('.artist-page'))return;
    let active='artist-featured';
    for(const id of ['artist-featured','artist-selected','artist-other']) {
      if(document.getElementById(id)?.getBoundingClientRect().top <= 180)active=id;
    }
    lastArtistSection=active;
    document.querySelectorAll('#secondary a[data-artist-section]').forEach(a=>{
      if(a.dataset.artistSection===active)a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  }
  function updateWhoNav() {
    if(!content.querySelector('.who-page'))return;
    let active='about';
    for(const id of ['about','cv','contact']) {
      if(document.getElementById(id)?.getBoundingClientRect().top <= 180)active=id;
    }
    document.querySelectorAll('#secondary a[data-who-section]').forEach(a=>{
      if(a.dataset.whoSection===active)a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  }
  function scrollToSection(id, animate=true, updateNav=updateArtistNav,topAtDocumentStart=false) {
    const target=document.getElementById(id);
    if(!target)return;
    cancelAnimationFrame(scrollFrame);
    const end=topAtDocumentStart?0:Math.max(0,window.scrollY+target.getBoundingClientRect().top-($('#context-bar').offsetHeight+12));
    if(pageMotion){pageMotion.scrollTo(end,{immediate:!animate,onComplete:updateNav});return;}
    const start=window.scrollY;
    const delta=end-start;
    if(!animate || matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo(0,end);updateNav();return;}
    const duration=Math.min(1250,Math.max(650,Math.abs(delta)*.45));
    const begun=performance.now();
    const step=now=>{
      const p=Math.min(1,(now-begun)/duration);
      const eased=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
      window.scrollTo(0,start+delta*eased);
      if(p<1)scrollFrame=requestAnimationFrame(step);else updateNav();
    };
    scrollFrame=requestAnimationFrame(step);
  }
  function scrollToArtistSection(id,animate=true){scrollToSection(id,animate,updateArtistNav);}
  function scrollToWhoSection(id,animate=true){const section=id==='who'?'about':id;scrollToSection(section,animate,updateWhoNav,section==='about');}
  function syncArtistRoute(route, animate=false) {
    const dialog=$('#artist-project-dialog');
    if(!dialog)return;
    if(route.startsWith('artist/project/')) {
      const id=route.split('/')[2];
      if(dialog.dataset.project!==id) {
        pageMotion?.stop();
        selectedProject=id;
        updateWorkSelection();
        window.CanqiProjects?.stopVideos(dialog);
        dialog.innerHTML=artistDetail(id);
        dialog.dataset.project=id;
        if(!dialog.open)dialog.showModal();
        dialog.scrollTop=0;
        drawStudies(dialog);
        pageMotion?.refresh(dialog);
      }
    } else {
      if(dialog.open)dialog.close();
      delete dialog.dataset.project;
      if(route.startsWith('artist-')&&document.getElementById(route))scrollToArtistSection(route,animate);
      updateArtistNav();
    }
  }
  function changeFeature(direction=1) {
    const media=$('#feature-media');
    const copy=$('#feature-copy');
    if(!media||!copy||media.classList.contains('is-changing'))return;
    const next=(featuredIndex+direction+featuredWorks.length)%featuredWorks.length;
    media.classList.add('is-changing');
    copy.classList.add('is-leaving');
    const incoming=document.createElement('div');
    incoming.className=`feature-incoming${direction<0?' from-left':''}`;
    incoming.innerHTML=featureImage(featuredWorks[next]);
    media.appendChild(incoming);
    drawStudies(incoming);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      featuredIndex=next;
      media.replaceChildren(...incoming.childNodes);
      media.className='feature-media';
      copy.innerHTML=featureCopy(featuredWorks[next]);
      copy.classList.remove('is-leaving');
      return;
    }
    slideTimers.push(setTimeout(()=>media.classList.add(direction<0?'is-moving-back':'is-moving'),300));
    slideTimers.push(setTimeout(()=>{
      featuredIndex=next;
      copy.innerHTML=featureCopy(featuredWorks[next]);
      copy.classList.remove('is-leaving');
      copy.classList.add('is-entering');
    },1650));
    slideTimers.push(setTimeout(()=>{
      media.replaceChildren(...incoming.childNodes);
      media.className='feature-media';
      copy.classList.remove('is-entering');
      slideTimers=[];
    },2000));
  }
  function stopHomePaper() {
    homePaperTimers.forEach(clearTimeout);
    homePaperTimers=[];
    homePaperTurning=false;
    homePaperWheel=0;
    homeTouchStart=null;
  }
  function turnHomePaper(direction) {
    const stack=$('#home-paper-stack');
    if(!stack||homePaperTurning)return;
    const front=$('#home-paper-front');
    const next=(homePaperIndex+direction+featuredWorks.length)%featuredWorks.length;
    const update=()=>{
      homePaperIndex=next;
      front.innerHTML=coverSheet(featuredWorks[next]);
      drawStudies(front);
    };
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){update();return;}
    homePaperTurning=true;
    const outgoing=direction>0?'paper-out-next':'paper-out-previous';
    const incoming=direction>0?'paper-in-next':'paper-in-previous';
    stack.classList.add(outgoing);
    homePaperTimers.push(setTimeout(()=>{
      stack.classList.remove(outgoing);
      stack.classList.add(incoming);
      update();
      requestAnimationFrame(()=>requestAnimationFrame(()=>stack.classList.remove(incoming)));
    },340));
    homePaperTimers.push(setTimeout(()=>{
      homePaperTurning=false;
      homePaperTimers=[];
    },850));
  }
  function startArtist() {
    updateWorkSelection();
    clearInterval(featuredTimer);
    const projector=$('.feature-projector');
    const dialog=$('#artist-project-dialog');
    let projectorVisible=true,projectorHovered=false;
    const pauseProjector=()=>projector.classList.toggle('projector-paused',document.hidden||!projectorVisible||dialog.open||projectorHovered||projector.contains(document.activeElement));
    const enterProjector=()=>{projectorHovered=matchMedia('(hover:hover) and (pointer:fine)').matches;pauseProjector();};
    const leaveProjector=()=>{projectorHovered=false;pauseProjector();};
    const focusProjector=()=>queueMicrotask(pauseProjector);
    projector.addEventListener('pointerenter',enterProjector);
    projector.addEventListener('pointerleave',leaveProjector);
    projector.addEventListener('focusin',focusProjector);
    projector.addEventListener('focusout',focusProjector);
    const visibility=new IntersectionObserver(entries=>{projectorVisible=entries[0].isIntersecting;pauseProjector();});
    visibility.observe(projector);
    const dialogState=new MutationObserver(pauseProjector);
    dialogState.observe(dialog,{attributes:true,attributeFilter:['open']});
    document.addEventListener('visibilitychange',pauseProjector);
    disposeProjector=()=>{
      visibility.disconnect();dialogState.disconnect();document.removeEventListener('visibilitychange',pauseProjector);
      projector.removeEventListener('pointerenter',enterProjector);projector.removeEventListener('pointerleave',leaveProjector);
      projector.removeEventListener('focusin',focusProjector);projector.removeEventListener('focusout',focusProjector);
    };
    pauseProjector();
    featuredTimer=setInterval(()=>{
      if(!projector.classList.contains('projector-paused')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)changeFeature(1);
    },6000);
    $('#artist-project-dialog').addEventListener('close',()=>{
      if(location.hash.startsWith('#artist/project/')){
        history.replaceState(null,'',`#${lastArtistSection}`);
        setupNavigation(lastArtistSection);
        currentRoute=lastArtistSection;
      }
    });
    updateArtistNav();
  }
  function stopArtist() {
    clearInterval(featuredTimer);
    disposeProjector?.();disposeProjector=null;
    slideTimers.forEach(clearTimeout);
    slideTimers=[];
    cancelAnimationFrame(scrollFrame);
  }
  function setupNavigation(route) {
    const leaf = route.split('/')[0];
    const isArtist=leaf==='artist'||route.startsWith('artist-');
    const branch = isArtist||['works','work'].includes(leaf) ? 'artist' : (leaf === 'mentor'||leaf.startsWith('mentor-')) ? 'mentor' : ['who','about','cv','contact'].includes(leaf) ? 'who' : '';
    $('#header').hidden = false;
    $('#context-bar').hidden = !branch;
    document.querySelectorAll('[data-branch]').forEach(a => { if(a.dataset.branch === branch) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
    if (!branch) return;
    if(isArtist) {
      $('#breadcrumb').innerHTML=`<a href="#main">${t('Index','主页')}</a><span aria-hidden="true">/</span><a href="#artist">${branchName('artist')}</a>`;
      $('#secondary').innerHTML=[['artist-featured','Featured projects','精选项目'],['artist-selected','Selected works','精选作品'],['artist-other','Other works','其他作品']].map(([id,en,zh])=>`<a href="#${id}" data-artist-section="${id}">${t(en,zh)}</a>`).join('');
      updateArtistNav();
      return;
    }
    if(branch==='mentor') {
      $('#breadcrumb').innerHTML=`<a href="#main">${t('Index','主页')}</a><span aria-hidden="true">/</span><a href="#mentor">${branchName('mentor')}</a>`;
      $('#secondary').innerHTML=[['mentor-gafa','Guangzhou Academy of Fine Arts','广州美术学院'],['mentor-sfk','SFK International Art Education','斯芬克']].map(([id,en,zh])=>`<a href="#${id}" data-mentor-section="${id}">${t(en,zh)}</a>`).join('');
      if(route==='mentor-students'){
        $('#breadcrumb').insertAdjacentHTML('beforeend',`<span aria-hidden="true">/</span><span aria-current="page">${t('Student projects','学生项目')}</span>`);
        $('#secondary [data-mentor-section="mentor-sfk"]').setAttribute('aria-current','location');
      }
      updateMentorNav();return;
    }
    if(branch==='who') {
      const section=leaf==='who'?'about':leaf;
      $('#breadcrumb').innerHTML=`<a href="#main">${t('Index','主页')}</a><span aria-hidden="true">/</span><a href="#who">${branchName('who')}</a>${leaf==='who'?'':`<span aria-hidden="true">/</span><span aria-current="page">${t(...routeNames[leaf])}</span>`}`;
      $('#secondary').innerHTML=[['about','About','关于'],['cv','CV','履历'],['contact','Have you seen Canqi? (Contact)','你见过燦琪吗？（联系）']].map(([id,en,zh])=>`<a href="#${id}" data-who-section="${id}" ${id===section?'aria-current="location"':''}>${t(en,zh)}</a>`).join('');
      updateWhoNav();
      return;
    }
    const leafTitle = leaf === 'work' ? titleOf(allArtistWorks.find(w=>w.id===route.split('/')[1]) || {title:'Unknown project',zh:'未知作品'}) : routeNames[leaf] ? t(...routeNames[leaf]) : '';
    $('#breadcrumb').innerHTML = `<a href="#main">${t('Index','主页')}</a><span aria-hidden="true">/</span>${leaf === branch ? `<span aria-current="page">${branchName(branch)}</span>` : `<a href="#${branch}">${branchName(branch)}</a>${leaf === 'work' ? `<span aria-hidden="true">/</span><a href="#works">${t('Works','作品')}</a>`:''}<span aria-hidden="true">/</span><span aria-current="page">${leafTitle}</span>`}`;
    const items = branch === 'artist' ? ['works'] : [];
    $('#secondary').innerHTML = items.map(key=>`<a href="#${key}" ${key===leaf || (key==='works' && leaf==='work') ? 'aria-current="page"':''}>${key==='contact' ? t('Have you seen Canqi? (Contact)','你见过燦琪吗？（联系）') : t(...routeNames[key])}</a>`).join('');
  }
  function render({focus=true,force=false}={}) {
    const requestedRoute = location.hash.slice(1) || 'main';
    const route = requestedRoute === 'landing' ? 'main' : requestedRoute;
    if (requestedRoute === 'landing') history.replaceState(null,'','#main');
    const pages = {main:home,mentor,works:archive};
    const isArtist=route==='artist'||route.startsWith('artist-')||route.startsWith('artist/project/');
    const wasArtist=currentRoute==='artist'||currentRoute.startsWith('artist-')||currentRoute.startsWith('artist/project/');
    const isMentor=route==='mentor'||route.startsWith('mentor-')||route.startsWith('mentor/project/');
    const wasMentor=currentRoute==='mentor'||currentRoute.startsWith('mentor-')||currentRoute.startsWith('mentor/project/');
    const isWho=['who','about','cv','contact'].includes(route);
    const wasWho=['who','about','cv','contact'].includes(currentRoute);
    const previousWhoScroll=isWho&&wasWho?window.scrollY:0;
    const previousReader=force?document.querySelector('.project-reader'):null;
    const previousReaderSection=previousReader?Array.from(previousReader.querySelectorAll('.reader-section')).filter(s=>s.getBoundingClientRect().top<180).at(-1)?.id:null;
    const previousReaderScroll=force?($('#artist-project-dialog')?.scrollTop||0):0;
    if(isMentor&&wasMentor&&!force&&(route==='mentor-students')===(currentRoute==='mentor-students')){setupNavigation(route);syncMentorRoute(route,route!==currentRoute);currentRoute=route;return;}
    if(isArtist&&wasArtist&&!force) {
      setupNavigation(route);
      syncArtistRoute(route,route!==currentRoute);
      currentRoute=route;
      return;
    }
    if(isWho&&wasWho&&!force) {
      setupNavigation(route);
      scrollToWhoSection(route,route!==currentRoute);
      currentRoute=route;
      return;
    }
    if(wasArtist)stopArtist();
    if(wasWho)cancelAnimationFrame(scrollFrame);
    if(currentRoute==='main')stopHomePaper();
    document.body.classList.toggle('on-mentor',isMentor);
    document.body.classList.toggle('on-artist',isArtist);
    document.body.classList.toggle('on-main',route==='main');
    document.body.classList.toggle('on-who',isWho);
    setupNavigation(route);
    stopWallThreads();
    disposeHomeScene?.();disposeHomeScene=null;
    disposeWhoAscii?.();disposeWhoAscii=null;
    pageMotion?.destroy();pageMotion=null;
    window.CanqiStudies.reset();
    window.CanqiPhotoPrint?.reset();
    window.CanqiProjects?.stopVideos(content);
    content.innerHTML = isArtist ? artist() : isMentor ? mentor() : isWho ? who() : route.startsWith('work/') ? project(route.split('/')[1]) : pages[route] ? pages[route]() : `<section class="page"><h1>${t('Page not found.','未找到页面。')}</h1>${link('main','Return to the index','返回主页')}</section>`;
    if(isArtist&&!wasArtist)window.scrollTo(0,0);
    if (route === 'works') fillWorks();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-en][data-zh]').forEach(el=>el.textContent=el.dataset[lang]);
    $('#language').textContent=lang === 'en' ? '中文' : 'EN';
    $('#language').setAttribute('aria-label',lang === 'en' ? '切换到中文' : 'Switch to English');
    const pageTitle = content.querySelector('h1')?.innerText.replace(/\s+/g,' ').trim() || 'Portfolio';
    document.title = pageTitle === 'CANQI' ? 'CANQI 燦琪 — Portfolio' : `${pageTitle} — CANQI 燦琪`;
    drawStudies();
    if(route==='main'){
      startWallThreads();
      disposeHomeScene=window.CanqiHomeScene?.mount(content.querySelector('.home-investigation'));
    }
    if (isArtist) {
      startArtist();
      syncArtistRoute(route,false);
    }
    if (!isArtist && route !== currentRoute) {
      window.scrollTo(0,0);
      if (focus) content.focus({preventScroll:true});
    }
    if(isWho){
      disposeWhoAscii=window.CanqiWhoAscii?.mount();
      if(force&&wasWho){window.scrollTo(0,previousWhoScroll);updateWhoNav();}
      else scrollToWhoSection(route,false);
    }
    if(isMentor){startMentor();syncMentorRoute(route,false);}
    currentRoute = route;
    if(route!=='main')pageMotion=window.CanqiPageMotion?.mount(content);
    if(previousReader){
      const reader=document.querySelector('.project-reader'),dialog=$('#artist-project-dialog');
      const section=previousReaderSection?document.getElementById(previousReaderSection):null;
      if(reader&&dialog?.open)dialog.scrollTop=section?dialog.scrollTop+section.getBoundingClientRect().top-dialog.getBoundingClientRect().top-76:previousReaderScroll;
      if(reader&&!dialog&&section)window.scrollTo(0,window.scrollY+section.getBoundingClientRect().top-160);
      reader?.querySelector('[data-reader-language]')?.focus({preventScroll:true});
    }
  }

  // Procedural image studies: authored layout assets, never a substitute for actual work documentation.
  // Each study is a continuous scalar field; halftone dots encode its brightness by area.
  function drawStudies(root=document) {
    window.CanqiStudies.draw(root,effects);
    window.CanqiPhotoPrint?.draw(root,effects);
  }
  $('.skip').addEventListener('click',event=>{event.preventDefault();content.focus();content.scrollIntoView({block:'start'});});
  $('#language').addEventListener('click',()=> {lang=lang==='en'?'zh':'en';try{localStorage.setItem('canqi-wireframe-language',lang);}catch{}render({focus:false,force:true});});
  $('#secondary').addEventListener('click',event=>{
    const link=event.target.closest('a[data-artist-section]');
    if(!link)return;
    event.preventDefault();
    const id=link.dataset.artistSection;
    history.pushState(null,'',`#${id}`);
    const dialog=$('#artist-project-dialog');
    if(dialog?.open)dialog.close();
    setupNavigation(id);
    scrollToArtistSection(id,true);
    currentRoute=id;
  });
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||!content.querySelector('.who-page'))return;
    const id=link.getAttribute('href').slice(1);
    if(!['who','about','cv','contact'].includes(id))return;
    event.preventDefault();
    history.pushState(null,'',`#${id}`);
    setupNavigation(id);
    scrollToWhoSection(id,true);
    currentRoute=id;
  });
  content.addEventListener('click',event=>{
    if(performance.now()<suppressHomeClickUntil&&event.target.closest('#home-paper-stack a')){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
  async function copyContactEmail(button){
    const email='louvslefv@gmail.com';
    const status=$('#poster-status');
    let copied=false;
    try{await navigator.clipboard.writeText(email);copied=true;}catch{
      const field=document.createElement('textarea');
      field.value=email;
      field.setAttribute('readonly','');
      field.style.cssText='position:fixed;left:-9999px;top:0';
      document.body.append(field);
      field.select();
      try{copied=document.execCommand('copy');}catch{}
      field.remove();
      button.focus({preventScroll:true});
    }
    if(!button.isConnected)return;
    button.querySelector('.contact-action').textContent=copied?t('COPIED','已复制'):t('RETRY','重试');
    status.textContent=copied?t('Copied — louvslefv@gmail.com','已复制 — louvslefv@gmail.com'):t('Copy unavailable. Select this address to copy: louvslefv@gmail.com','暂时无法自动复制，请选中邮箱手动复制：louvslefv@gmail.com');
  }
  content.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      const close=content.querySelector('.contact-qr-panel:not([hidden]) [data-qr-close]');
      if(close){event.preventDefault();close.click();}
    }
  });
  content.addEventListener('click',event=> {
    const qrToggle=event.target.closest('[data-contact-qr]');
    const qrClose=event.target.closest('[data-qr-close]');
    if(qrToggle||qrClose){
      const open=qrToggle?.getAttribute('aria-expanded')!=='true';
      const previous=content.querySelector('[data-contact-qr][aria-expanded="true"]');
      content.querySelectorAll('.contact-qr-panel').forEach(panel=>panel.hidden=true);
      content.querySelectorAll('[data-contact-qr]').forEach(button=>button.setAttribute('aria-expanded','false'));
      if(qrToggle&&open){
        $(`#contact-qr-${qrToggle.dataset.contactQr}`).hidden=false;
        qrToggle.setAttribute('aria-expanded','true');
      }else if(qrClose)previous?.focus({preventScroll:true});
      return;
    }
    const slip=event.target.closest('[data-poster-slip]');
    if(slip){
      const paper=slip.closest('.poster-slip');
      paper.classList.remove('is-taking');
      void paper.offsetWidth;
      paper.classList.add('is-taking');
      setTimeout(()=>paper.classList.remove('is-taking'),650);
      if(slip.hasAttribute('data-copy-email'))copyContactEmail(slip);
      return;
    }
    const slide=event.target.closest('[data-slide]');
    if(slide){changeFeature(slide.dataset.slide==='previous'?-1:1);return;}
    const close=event.target.closest('[data-project-close]');
    if(close){
      const dialog=$('#artist-project-dialog');
      if(dialog?.open)dialog.close();
      return;
    }
  });
  content.addEventListener('wheel',event=>{
    if(currentRoute!=='main'||!event.target.closest('#home-paper-stack'))return;
    event.preventDefault();
    if(homePaperTurning)return;
    homePaperWheel+=event.deltaY;
    if(Math.abs(homePaperWheel)<35)return;
    turnHomePaper(homePaperWheel>0?1:-1);
    homePaperWheel=0;
  },{passive:false});
  content.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'&&event.target.closest('#home-paper-stack'))homeTouchStart={id:event.pointerId,x:event.clientX,y:event.clientY};
  });
  content.addEventListener('pointerup',event=>{
    if(!homeTouchStart||event.pointerId!==homeTouchStart.id)return;
    const dx=event.clientX-homeTouchStart.x;
    const dy=event.clientY-homeTouchStart.y;
    homeTouchStart=null;
    if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.2)return;
    suppressHomeClickUntil=performance.now()+700;
    turnHomePaper(dx<0?1:-1);
  });
  content.addEventListener('pointercancel',()=>{homeTouchStart=null;});
  content.addEventListener('keydown',event=>{
    if(currentRoute!=='main'||!event.target.closest('#home-paper-stack'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      turnHomePaper(event.key==='ArrowRight'?1:-1);
    }
  });
  const dotSize=$('#dot-size');
  const dotValue=$('#dot-size-value');
  const syncDotControl=()=>{
    dotValue.value=String(effects.dot);
    dotSize.disabled=effects.treatment!=='halftone';
  };
  $('#treatment').addEventListener('change',e=>{effects.treatment=e.target.value;syncDotControl();drawStudies();});
  let effectFrame=0;
  dotSize.addEventListener('input',e=>{
    effects.dot=Number(e.target.value);
    syncDotControl();
    cancelAnimationFrame(effectFrame);
    effectFrame=requestAnimationFrame(()=>drawStudies());
  });
  syncDotControl();
  $('#grain').addEventListener('input',e=>document.documentElement.style.setProperty('--grain',String(Number(e.target.value)/100)));
  const printSettings=$('.print-settings');
  document.addEventListener('pointerdown',event=>{
    if(printSettings.open&&!printSettings.contains(event.target))printSettings.open=false;
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&homeIntroTransition){clearHomeIntro();content.focus({preventScroll:true});}
    if(event.key==='Escape'&&printSettings.open){
      printSettings.open=false;
      printSettings.querySelector('summary').focus();
    }
  });
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawStudies,160);});
  let navFrame=0;
  window.addEventListener('scroll',()=>{
    if(navFrame)return;
    navFrame=requestAnimationFrame(()=>{
      navFrame=0;
      if(document.body.classList.contains('on-mentor'))updateMentorNav();
      else if(document.body.classList.contains('on-artist'))updateArtistNav();
      else if(document.body.classList.contains('on-who'))updateWhoNav();
    });
  },{passive:true});
  window.addEventListener('hashchange',()=>{
    const transition=window.CanqiRouteTransition;
    const next=location.hash.slice(1)||'main';
    clearHomeIntro();
    if(transition&&(transition.active||transition.group(next)!==transition.group(currentRoute))){
      pageMotion?.stop();
      cancelAnimationFrame(scrollFrame);
      transition.run(()=>render());
    }else render();
  });
  $('.entrance-computer').addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!window.CanqiRouteTransition)return;
    event.preventDefault();
    clearHomeIntro();
    pageMotion?.stop();
    cancelAnimationFrame(scrollFrame);
    const destination=event.currentTarget.href;
    window.CanqiRouteTransition.run(()=>location.assign(destination),{external:true});
  });
  window.addEventListener('pagehide',clearHomeIntro);
  render({focus:false});
  startHomeIntro();
})();
