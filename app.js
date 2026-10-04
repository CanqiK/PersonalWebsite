(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const content = $('#content');
  let lang = 'en';
  try { lang = localStorage.getItem('canqi-wireframe-language') === 'zh' ? 'zh' : 'en'; } catch {}
  let filter = 'all';
  let currentRoute = '';
  const effects = { treatment: 'halftone', dot: 5 };
  const t = (en, zh) => lang === 'zh' ? zh : en;
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M13 5l7 7-7 7"/></svg>';
  const works = [
    { id:'power-off', title:'Power Off', zh:'断电', year:'2022', medium:['Immersive theatre performance','沉浸式戏剧表演'], category:'performance', study:0 },
    { id:'bsod', title:'Power Off — B.S.O.D.', zh:'Power Off — B.S.O.D.', year:'2022', medium:['Derivative performance','衍生剧目'], category:'performance', study:1 },
    { id:'gavel-room', title:'The Gavel Room', zh:'槌室', year:'2023–2025', medium:['Installation · experimental theatre','装置 · 实验戏剧'], category:'installation', study:2 },
    { id:'fishbird', title:'Fishbird [Sumeru]', zh:'鱼鸟「须弥」', year:'2025', medium:['Exhibition space · installation','展厅空间 · 装置'], category:'spatial', study:3 },
    { id:'carnival', title:'Carnival Nervous System', zh:'狂欢节神经系统', year:'2024', medium:['Medium to be added','媒介待补充'], category:'other', study:4 },
    { id:'chang', title:'CHANG | “隙”', zh:'CHANG | “隙”', year:'2023', medium:['Theatre festival concept installation','戏剧节概念装置'], category:'installation', study:5 }
  ];
  const titleOf = w => lang === 'zh' ? w.zh : w.title;
  const art = (n, label = '') => `<canvas data-study="${n}" role="img" aria-label="${label || t('Abstract halftone composition — image placeholder, not project documentation','抽象半调图形 — 图像占位，非作品记录')}"></canvas>`;
  const caption = () => `<figcaption class="image-caption"><span>${t('IMAGE STUDY / PLACEHOLDER','图像实验 / 占位图')}</span><span>CANQI</span></figcaption>`;
  const link = (href, en, zh) => `<a class="text-link" href="#${href}">${t(en,zh)}${arrow}</a>`;
  const role = () => t('Performative installation artist.<br>Spatial narrative designer.<br>Experimental theatre director.','行为装置艺术家。<br>空间叙事设计师。<br>实验戏剧导演。');
  const branchName = b => b === 'artist' ? t('As an artist','作为艺术家') : b === 'mentor' ? t('As a mentor','作为导师') : t('Who am I?','我是谁？');
  const routeNames = { works:['Works','作品'], about:['About','关于'], cv:['CV','履历'], contact:['Have you seen Canqi?','你见过燦琪吗？'] };

  function cover() {
    return `<div class="paper-stack"><article class="cover" aria-label="${t('Portfolio cover','作品集封面')}">
      <div class="cover-topline"><span>${t('ART / SPACE / PERFORMANCE','艺术 / 空间 / 表演')}</span><span>PORTFOLIO — 2026</span></div>
      <h1 class="cover-title">CANQI</h1>
      <div class="cover-subline"><span>燦琪 / CANQI LIN</span><span>${t('A SELECTED BODY OF WORK','个人创作选集')}</span></div>
      <div class="cover-middle">${art(2)}<span class="cover-vertical" aria-hidden="true">CANQI</span></div>
      <div class="cover-cutout" aria-hidden="true"><span>${t('Between','介于')}</span><span>${t('body & space.','身体与空间。')}</span></div>
      <div class="cover-bottom"><strong>${t('An ongoing<br>practice.','持续<br>实践。')}</strong><p>${t('Performative installation, spatial narrative and experimental theatre.<br><br>Cover image: abstract study / placeholder.','行为装置、空间叙事与实验戏剧。<br><br>封面图像：抽象视觉实验 / 占位图。')}</p></div>
      <a class="cover-open" href="#artist"><span>${t('Open the practice','打开艺术实践')}</span>${arrow}</a>
    </article></div>`;
  }
  function landing() {
    return `<section class="landing"><div class="landing-top"><span>CANQI / 燦琪</span><span>${t('AN ARTIST’S PERSONAL INDEX','一位艺术家的个人索引')}</span></div>
    <a class="entrance" href="#main" aria-label="${t('Enter CANQI portfolio','进入燦琪的个人网站')}"><span class="mini-cover"><strong>CANQI</strong>${art(2)}<small><span>燦琪 / SELECTED WORKS</span><span>2026</span></small></span><span class="enter-label">${t('Enter the index','进入个人索引')}${arrow}</span></a>
    <h1 class="landing-note">${t('Art, space, and everything in between.','艺术、空间，以及两者之间。')}</h1></section>`;
  }
  function home() {
    return `<section class="home"><aside class="home-aside"><p class="artist-role">${role()}</p><p class="micro">${t('A personal index<br>of works and practice.','关于作品与实践的<br>个人索引。')}<br><br>CANQI LIN / 林灿琪</p>${link('artist','Explore the works','探索作品')}</aside>${cover()}<aside class="home-aside right"><span class="vertical-note">${t('SELECTED WORKS & PERSONAL ARCHIVE','创作选集与个人档案')}</span><p class="micro">${t('Three ways in.<br>One ongoing practice.','三个入口。<br>一种持续的实践。')}</p>${link('who','Who am I?','我是谁？')}</aside></section>`;
  }
  function artist() {
    return `<section class="page"><div class="branch-layout"><div><h1 class="branch-title">${t('As an<br>artist.','作为<br>艺术家。')}</h1><p class="branch-copy">${role()}</p><a class="branch-link" href="#works"><h2>${t('Works','作品')}${arrow}</h2><p>${t('Six selected projects / 2022–2025','六个精选项目 / 2022–2025')}</p></a></div><figure class="branch-art">${art(0)}${caption()}</figure></div></section>`;
  }
  function mentor() {
    return `<section class="page"><div class="branch-layout"><div><h1 class="branch-title">${t('As a<br>mentor.','作为<br>导师。')}</h1><p class="branch-copy">${t('Externally appointed lecturer, School of Architecture and Applied Arts, Guangzhou Academy of Fine Arts.<br><br>Digital media project mentor.','广州美术学院建筑艺术设计学院外聘讲师。<br><br>数字媒体项目指导。')}</p><section class="pending"><h2>${t('A space in progress.','一个正在形成的空间。')}</h2><p>${t('The structure of this section is still open. Teaching content and student work will be added once selected.','此分支下的栏目待定。教学内容与学生作品将在选定后补充。')}</p></section></div><figure class="branch-art">${art(3)}${caption()}</figure></div></section>`;
  }
  function who() {
    return `<section class="page"><div class="branch-layout"><div><h1 class="branch-title">${t('Who<br>am I?','我<br>是谁？')}</h1><p class="branch-copy">CANQI / 燦琪<br>Canqi Lin / 林灿琪</p></div><figure class="branch-art">${art(4)}${caption()}</figure></div><nav class="branch-index" aria-label="${t('About CANQI','关于燦琪')}"><a href="#about">${t('About','关于')}${arrow}</a><a href="#cv">${t('CV','履历')}${arrow}</a><a href="#contact">${t('Have you seen Canqi?','你见过燦琪吗？')}${arrow}</a></nav></section>`;
  }
  function archive() {
    const filters = [['all','All','全部'],['performance','Performance','表演'],['installation','Installation','装置'],['spatial','Spatial','空间']];
    return `<section class="page"><div class="page-heading"><h1>${t('Works.','作品。')}</h1><p>${t('An index of selected works.<br>Performance, installation, and spatial narrative.','创作选集。<br>表演、装置与空间叙事。')}</p></div><div class="archive-toolbar"><div class="filters" role="group" aria-label="${t('Filter works','筛选作品')}">${filters.map(([id,en,zh])=>`<button type="button" data-filter="${id}" aria-pressed="${filter===id}">${t(en,zh)}</button>`).join('')}</div><span class="result-count" aria-live="polite" id="result-count"></span></div><div class="works-grid" id="works-grid"></div><p class="archive-note">${t('Images are abstract layout studies, not documentation of the works. Project titles and dates follow the existing portfolio index.','当前图像为抽象版式实验，非真实作品记录。作品名称与年份沿用已有作品内容索引。')}</p></section>`;
  }
  function fillWorks() {
    const visible = works.filter(w => filter === 'all' || w.category === filter);
    $('#works-grid').innerHTML = visible.map(w=>`<a class="work-item" href="#work/${w.id}"><span class="work-image">${art(w.study)}<span class="open-mark">${arrow}</span></span><h2>${titleOf(w)}</h2><span class="work-meta"><span>${t(...w.medium)}</span><span>${w.year}</span></span></a>`).join('');
    $('#result-count').textContent = `${String(visible.length).padStart(2,'0')} / ${String(works.length).padStart(2,'0')}`;
  }
  function about() {
    return `<section class="page reading"><div class="page-heading"><h1>${t('About.','关于。')}</h1><p>CANQI LIN / 林灿琪</p></div><div class="reading-grid"><figure>${art(4)}${caption()}</figure><div class="reading-copy"><p>${t('Canqi Lin works across performative installation, spatial narrative, and experimental theatre.','林灿琪的实践横跨行为装置、空间叙事与实验戏剧。')}</p><h2>${t('Practice & approach','创作与方法')}</h2><p class="small-copy">${t('Artist statement to be added. This space is reserved for the questions, methods, and relationships that connect the works.','艺术家陈述待补充。此处将介绍贯穿作品的研究问题、工作方法与关联。')}</p><h2>${t('Alongside the practice','创作之外')}</h2><p class="small-copy">${t('Externally appointed lecturer at the School of Architecture and Applied Arts, Guangzhou Academy of Fine Arts; digital media project mentor.','广州美术学院建筑艺术设计学院外聘讲师，数字媒体项目指导。')}</p><div style="margin-top:30px">${link('cv','Read the CV','查看履历')}</div></div></div></section>`;
  }
  function cv() {
    const sections = [['Education','教育经历'],['Selected exhibitions & performances','精选展览与演出'],['Teaching & appointments','教学与任职'],['Awards & residencies','奖项与驻地']];
    return `<section class="page reading"><div class="page-heading"><h1>${t('Curriculum<br>vitae.','个人<br>履历。')}</h1><p>CANQI LIN / 林灿琪</p></div><div class="cv-list">${sections.map(([en,zh])=>`<section class="cv-row"><h2>${t(en,zh)}</h2><p>${t('Verified entries to be added.','待补充已核实的履历。')}</p></section>`).join('')}</div><p class="cv-status">${t('A downloadable CV will be available once the public version is confirmed.','公开版本确认后，将在此提供 CV 下载。')}</p></section>`;
  }
  function contact() {
    return `<section class="page"><div class="contact-layout"><h1 class="contact-title">${t('Have you<br>seen<br>Canqi?','你见过<br>燦琪<br>吗？')}</h1><section class="contact-panel"><h2>${t('Let’s get in touch.','让我们开始联系。')}</h2><p>${t('For exhibitions, residencies, research, and collaborations.','关于展览、驻地、研究与合作。')}</p><p class="contact-status">${t('Contact details to be added.<br>The public email and social links will appear here.','联系方式待补充。<br>公开邮箱与社交链接将在此呈现。')}</p>${link('about','A little about me','关于我的一些事')}</section></div></section>`;
  }
  function project(id) {
    const w = works.find(x => x.id === id);
    if (!w) return `<section class="page"><h1>${t('Project not found.','未找到作品。')}</h1>${link('works','Return to works','返回作品列表')}</section>`;
    const next = works[(works.indexOf(w)+1)%works.length];
    return `<article class="page reading"><div class="page-heading project-heading"><h1>${titleOf(w)}</h1><p>${lang==='en' && w.title!==w.zh ? w.zh : w.title}</p></div><div class="project-meta"><span>${t(...w.medium)}</span><span>${w.year}</span><span>${t('Selected work','精选作品')} / ${String(works.indexOf(w)+1).padStart(2,'0')}</span></div><figure class="project-visual">${art(w.study)}${caption()}</figure><div class="project-sections"><section><h2>${t('The work','关于作品')}</h2><p>${t('Project statement, context, and the artist’s role to be added.','项目陈述、背景与创作者角色待补充。')}</p></section><section><h2>${t('Process & research','过程与研究')}</h2><p>${t('Research questions, working material, installation documentation, and credits to be added.','研究问题、过程材料、作品记录与完整署名待补充。')}</p></section></div><nav class="project-next" aria-label="${t('Project navigation','作品导航')}"><a href="#works">${t('Back to works','返回作品')}</a><a href="#work/${next.id}">${t('Next','下一件')} / ${titleOf(next)} ${arrow}</a></nav></article>`;
  }
  function setupNavigation(route) {
    const leaf = route.split('/')[0];
    const branch = ['artist','works','work'].includes(leaf) ? 'artist' : leaf === 'mentor' ? 'mentor' : ['who','about','cv','contact'].includes(leaf) ? 'who' : '';
    $('#header').hidden = leaf === 'landing';
    $('#context-bar').hidden = !branch;
    document.querySelectorAll('[data-branch]').forEach(a => { if(a.dataset.branch === branch) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
    if (!branch) return;
    const leafTitle = leaf === 'work' ? titleOf(works.find(w=>w.id===route.split('/')[1]) || {title:'Unknown project',zh:'未知作品'}) : routeNames[leaf] ? t(...routeNames[leaf]) : '';
    $('#breadcrumb').innerHTML = `<a href="#main">${t('Index','主页')}</a><span aria-hidden="true">/</span>${leaf === branch ? `<span aria-current="page">${branchName(branch)}</span>` : `<a href="#${branch}">${branchName(branch)}</a>${leaf === 'work' ? `<span aria-hidden="true">/</span><a href="#works">${t('Works','作品')}</a>`:''}<span aria-hidden="true">/</span><span aria-current="page">${leafTitle}</span>`}`;
    const items = branch === 'artist' ? ['works'] : branch === 'who' ? ['about','cv','contact'] : [];
    $('#secondary').innerHTML = items.map(key=>`<a href="#${key}" ${key===leaf || (key==='works' && leaf==='work') ? 'aria-current="page"':''}>${key==='contact' ? t('Have you seen Canqi? (Contact)','你见过燦琪吗？（联系）') : t(...routeNames[key])}</a>`).join('');
  }
  function render({focus=true}={}) {
    const route = location.hash.slice(1) || 'landing';
    const pages = {landing,main:home,artist,mentor,who,works:archive,about,cv,contact};
    setupNavigation(route);
    content.innerHTML = route.startsWith('work/') ? project(route.split('/')[1]) : pages[route] ? pages[route]() : `<section class="page"><h1>${t('Page not found.','未找到页面。')}</h1>${link('main','Return to the index','返回主页')}</section>`;
    if (route === 'works') fillWorks();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-en][data-zh]').forEach(el=>el.textContent=el.dataset[lang]);
    $('#language').textContent=lang === 'en' ? '中文' : 'EN';
    $('#language').setAttribute('aria-label',lang === 'en' ? '切换到中文' : 'Switch to English');
    const pageTitle = content.querySelector('h1')?.innerText.replace(/\s+/g,' ').trim() || 'Portfolio';
    document.title = pageTitle === 'CANQI' ? 'CANQI 燦琪 — Portfolio' : `${pageTitle} — CANQI 燦琪`;
    drawStudies();
    if (route !== currentRoute) {
      window.scrollTo(0,0);
      if (focus) content.focus({preventScroll:true});
      if (currentRoute === 'landing' && route === 'main') {content.classList.add('route-enter');setTimeout(()=>content.classList.remove('route-enter'),450);}
    }
    currentRoute = route;
  }

  // Procedural image studies: authored layout assets, never a substitute for actual work documentation.
  // Each study is a continuous scalar field; halftone dots encode its brightness by area.
  function field(x,y,n) {
    const a = Math.atan2(y-.47,x-.53), r = Math.hypot(x-.53,y-.47);
    let value;
    switch(n%6) {
      case 0: value = .5+.36*Math.sin(x*10+y*3+2*Math.sin(y*9))+.12*Math.cos(y*15); break;
      case 1: value = .54+.29*Math.sin((x+y)*17)+.24*Math.cos(y*8-x*3); if(x>.2&&x<.65&&y>.3&&y<.74)value*=.22; break;
      case 2: value = .45+.32*Math.cos(18*r-3*a)+.2*Math.sin(11*x+9*y); break;
      case 3: value = .5+.35*Math.sin(7*a+9*r)+.12*Math.cos(20*y); break;
      case 4: value = .53+.31*Math.cos(13*x+3*Math.sin(y*6))+.2*Math.sin(9*y-2*x); break;
      default: value = .48+.4*Math.sin(12*(x-y)+2*Math.sin(x*8))+.12*Math.cos(y*24);
    }
    // Small deterministic paper variations remain stable across renders.
    const noise = (Math.sin(x*239+y*173+n*7)*43758.5)%1;
    return Math.max(.02,Math.min(.98,value+noise*.035));
  }
  function drawStudies() {
    document.querySelectorAll('canvas[data-study]').forEach(canvas=> {
      const rect=canvas.getBoundingClientRect();
      const width=Math.min(1100,Math.max(180,Math.round(rect.width * Math.min(devicePixelRatio || 1,1.5))));
      const height=Math.round(width*(rect.height/rect.width || 1));
      canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext('2d');if(!ctx)return;
      const n=Number(canvas.dataset.study);
      ctx.fillStyle='#e6e4dc';ctx.fillRect(0,0,width,height);
      if(effects.treatment === 'continuous') {
        const pixels=ctx.createImageData(width,height);
        for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
          const v=field(x/width,y/height,n);const p=(y*width+x)*4;
          pixels.data[p]=23+v*207;pixels.data[p+1]=23+v*205;pixels.data[p+2]=22+v*198;pixels.data[p+3]=255;
        }
        ctx.putImageData(pixels,0,0);
      } else {
        const step=effects.dot*width/360;
        ctx.fillStyle='#171716';ctx.beginPath();
        for(let y=step/2;y<height;y+=step)for(let x=step/2;x<width;x+=step) {
          const r=step*.72*Math.sqrt(1-field(x/width,y/height,n));
          ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2);
        }
        ctx.fill();
      }
    });
  }
  $('.skip').addEventListener('click',event=>{event.preventDefault();content.focus();content.scrollIntoView({block:'start'});});
  $('#language').addEventListener('click',()=> {lang=lang==='en'?'zh':'en';try{localStorage.setItem('canqi-wireframe-language',lang);}catch{}render({focus:false});});
  content.addEventListener('click',event=> {
    const button=event.target.closest('[data-filter]');if(!button)return;
    filter=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
    fillWorks();drawStudies();
  });
  $('#treatment').addEventListener('change',e=>{effects.treatment=e.target.value;drawStudies();});
  let effectFrame=0;
  $('#dot-size').addEventListener('input',e=>{effects.dot=Number(e.target.value);cancelAnimationFrame(effectFrame);effectFrame=requestAnimationFrame(drawStudies);});
  $('#grain').addEventListener('input',e=>document.documentElement.style.setProperty('--grain',String(Number(e.target.value)/100)));
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawStudies,160);});
  window.addEventListener('hashchange',()=>render());
  render({focus:false});
})();
