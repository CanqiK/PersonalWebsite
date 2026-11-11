/* Project records use the existing project dialog and existing work routes. */
(() => {
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(value,lang)=>typeof value==='string'?value:(value?.[lang]||value?.en||'');
  const get=id=>window.CANQI_PROJECTS?.[id];
  const asset=key=>window.CANQI_PROJECT_IMAGES?.[key];
  const title=(id,lang)=>text(get(id)?.title,lang);
  const currentLang=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
  const label=(en,zh,lang)=>lang==='zh'?zh:en;
  function image(key,alt,cls='',eager=false,small=false) {
    const a=asset(key);if(!a)return '';
    return `<img class="${cls}" src="${esc(small?a.thumb:a.file)}" width="${a.width}" height="${a.height}" alt="${esc(alt)}" loading="${eager?'eager':'lazy'}" decoding="async">`;
  }
  function thumbnail(id,lang='en',eager=false,small=true) {
    const p=get(id);
    return p?.hero?`<span class="photo-print" data-print-photo>${image(p.hero,text(p.heroCaption||p.title,lang),'project-thumbnail',eager,small)}<canvas class="photo-print-canvas" aria-hidden="true"></canvas></span>`:'';
  }
  function figure(item,lang,eager=false) {
    const a=asset(item.asset);if(!a)return '';
    const cap=text(item.caption,lang),full=label('View image','查看图片',lang);
    if(item.zoom===false)return `<figure class="reader-figure ${a.width/a.height<.85?'reader-portrait':''}"><div class="reader-figure-media">${image(item.asset,cap,'',eager)}</div><figcaption><span>${esc(cap)}</span></figcaption></figure>`;
    return `<figure class="reader-figure ${a.width/a.height<.85?'reader-portrait':''}"><button type="button" class="reader-image-open" data-reader-image="${esc(item.asset)}" data-reader-caption="${esc(cap)}" aria-label="${esc(cap+' — '+full)}">${image(item.asset,cap,'',eager)}</button><figcaption><span>${esc(cap)}</span><button type="button" class="reader-image-open" data-reader-image="${esc(item.asset)}" data-reader-caption="${esc(cap)}">${label('View image ↗','查看图片 ↗',lang)}</button></figcaption></figure>`;
  }
  function sectionImages(section,lang) {
    const images=section.images||[];
    const group=(items,paired=false)=>items.length?`<div class="reader-figures${paired?' reader-pair reader-pair-compact':''}">${items.map(item=>figure(item,lang)).join('')}</div>`:'';
    if(section.imageLayout==='triptych')return `<div class="reader-figures reader-triptych">${images.map(item=>figure(item,lang)).join('')}</div>`;
    if(section.imageLayout==='leading-pair')return group(images.slice(0,2),true)+group(images.slice(2));
    return group(images,section.imageLayout==='compact-pair');
  }
  function gallery(items,id,heading,lang) {
    const valid=items.filter(item=>asset(item.asset));if(!valid.length)return '';
    if(valid.length===1)return figure(valid[0],lang);
    const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M13 5l7 7-7 7"/></svg>';
    const total=String(valid.length).padStart(2,'0'),trackId=`gallery-${id}`;
    return `<div class="reader-gallery" data-reader-gallery role="region" aria-roledescription="${label('carousel','轮播图集',lang)}" aria-label="${esc(text(heading,lang))}"><div class="reader-gallery-track" id="${esc(trackId)}" data-gallery-track data-native-scroll tabindex="0" aria-label="${label('Images. Use the left and right arrow keys to browse.','图片。使用左右方向键切换。',lang)}">${valid.map((item,i)=>`<div class="reader-gallery-slide" role="group" aria-roledescription="${label('slide','图片',lang)}" aria-label="${i+1} / ${valid.length}" aria-hidden="${i?'true':'false'}" ${i?'inert':''}>${figure(item,lang)}</div>`).join('')}</div><div class="reader-gallery-controls"><span class="reader-gallery-status" role="status" aria-live="polite" aria-atomic="true">01 / ${total}</span><div><button type="button" data-gallery-step="-1" aria-controls="${esc(trackId)}" aria-label="${label('Previous image','上一张',lang)}" disabled>${icon}</button><button type="button" data-gallery-step="1" aria-controls="${esc(trackId)}" aria-label="${label('Next image','下一张',lang)}">${icon}</button></div></div></div>`;
  }
  function updateGallery(track) {
    if(!track.isConnected||!track.clientWidth)return;
    const slides=[...track.children],index=Math.min(slides.length-1,Math.max(0,Math.round(track.scrollLeft/track.clientWidth)));
    const root=track.closest('[data-reader-gallery]');root.dataset.galleryIndex=String(index);
    slides.forEach((slide,i)=>{slide.inert=i!==index;slide.setAttribute('aria-hidden',String(i!==index));});
    root.querySelector('.reader-gallery-status').textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    root.querySelector('[data-gallery-step="-1"]').disabled=index===0;
    root.querySelector('[data-gallery-step="1"]').disabled=index===slides.length-1;
  }
  function moveGallery(root,direction) {
    const track=root.querySelector('[data-gallery-track]');
    const current=Number(root.dataset.galleryTarget??root.dataset.galleryIndex??0);
    const index=Math.max(0,Math.min(track.children.length-1,current+direction));
    root.dataset.galleryTarget=String(index);
    track.scrollTo({left:index*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  const galleryTimers=new WeakMap();
  document.addEventListener('scroll',event=>{
    const track=event.target;if(!track.matches?.('[data-gallery-track]'))return;
    clearTimeout(galleryTimers.get(track));
    galleryTimers.set(track,setTimeout(()=>{updateGallery(track);delete track.closest('[data-reader-gallery]')?.dataset.galleryTarget;},120));
  },true);
  document.addEventListener('keydown',event=>{
    const root=event.target.closest?.('[data-reader-gallery]');
    if(!root||!['ArrowLeft','ArrowRight'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
    event.preventDefault();moveGallery(root,event.key==='ArrowRight'?1:-1);
  });
  function videoURL(v,embedded=false) {
    if(v.provider==='local')return v.src;
    if(v.provider==='youtube')return embedded?`https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0${v.start?'&start='+v.start:''}`:`https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}${v.start?'&t='+v.start+'s':''}`;
    return embedded?`https://player.bilibili.com/player.html?bvid=${encodeURIComponent(v.id)}&p=1&autoplay=1&danmaku=0`:`https://www.bilibili.com/video/${encodeURIComponent(v.id)}/`;
  }
  function videoButton(v,id,n,lang) {
    return `<button type="button" class="reader-play" data-project-video="${esc(id)}:${n}" aria-label="${esc(label('Play: ','播放：',lang)+text(v.title,lang))}">${image(v.poster,text(v.title,lang))}<span class="reader-play-control"><span aria-hidden="true">▶</span>${label('Play film','播放影片',lang)}<small>${v.provider==='local'?'MP4':v.provider==='youtube'?'YouTube':'Bilibili'}</small></span></button>`;
  }
  function video(v,id,n,lang) {
    const platform=v.provider==='youtube'?'YouTube':'Bilibili';
    const linkLabel=v.provider==='local'?label('Open video','打开视频',lang):label('Watch on ','在 ',lang)+platform;
    return `<figure class="reader-video${v.portrait?' reader-video-portrait':''}" data-video-record="${esc(id)}:${n}"><div class="reader-video-stage">${videoButton(v,id,n,lang)}</div><figcaption><span>${esc(text(v.title,lang))}</span><a href="${esc(videoURL(v))}" target="_blank" rel="noopener">${linkLabel} ↗</a></figcaption><button type="button" class="reader-video-stop" data-video-stop hidden>${label('Stop video','停止播放',lang)}</button><p class="reader-video-help">${label('If the player cannot load, open the video using the link above.','若播放器无法载入，可通过上方链接打开视频。',lang)}</p></figure>`;
  }
  function sectionVideos(videos,section,id,lang) {
    const selected=videos.map((v,n)=>({v,n})).filter(({v})=>v.section===section);
    const body=selected.map(({v,n})=>video(v,id,n,lang)).join('');
    return selected.length>1&&selected.every(({v})=>v.provider==='local'&&v.portrait)?`<div class="reader-video-pair">${body}</div>`:body;
  }
  function externalLinks(items,lang) {
    const valid=(items||[]).filter(item=>/^https:\/\//.test(item.url));
    return valid.length?`<div class="reader-links">${valid.map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(text(item.label,lang))}<span aria-hidden="true">↗</span></a>`).join('')}</div>`:'';
  }
  function animation(item,lang) {
    if(!item||!asset(item.poster))return '';
    const title=text(item.title,lang),poster=asset(item.poster).file;
    if(item.autoplay){
      const a=asset(item.poster);
      return `<figure class="reader-animation reader-animation-auto" data-reader-animation data-animation-autoplay><picture><source media="(prefers-reduced-motion: reduce)" srcset="${esc(poster)}"><img src="${esc(item.src)}" width="${a.width}" height="${a.height}" alt="${esc(title)}" loading="lazy" decoding="async"></picture><figcaption><span>${esc(title)}</span></figcaption></figure>`;
    }
    return `<figure class="reader-animation" data-reader-animation data-animation-src="${esc(item.src)}" data-animation-poster="${esc(poster)}">${image(item.poster,title)}<figcaption><span>${esc(title)}</span><div class="reader-animation-controls"><button type="button" data-animation-toggle aria-pressed="false">${label('Play animation','播放动画',lang)}</button></div></figcaption></figure>`;
  }
  function setAnimation(root,playing) {
    if(playing)document.querySelectorAll('[data-reader-animation]').forEach(other=>{if(other!==root&&other.querySelector('[aria-pressed="true"]'))setAnimation(other,false);});
    const button=root.querySelector('[data-animation-toggle]');
    root.querySelector('img').src=playing?root.dataset.animationSrc:root.dataset.animationPoster;
    button.setAttribute('aria-pressed',String(playing));
    button.textContent=label(playing?'Stop animation':'Play animation',playing?'停止动画':'播放动画',currentLang());
  }
  function stopAnimations(scope=document) {
    scope.querySelectorAll('[data-reader-animation]:has([aria-pressed="true"])').forEach(root=>setAnimation(root,false));
  }
  function sectionBody(s,lang,id) {
    const p=get(id);
    const e=v=>esc(text(v,lang));
    return `${s.authors?`<p class="reader-authors">${e(s.authors)}</p>`:''}${s.quoteSource?`<p class="reader-quote-source">${e(s.quoteSource)}</p>`:''}<div class="reader-prose">${s.quoteSource?'<blockquote>':''}${s.paragraphs.map(v=>`<p>${e(v)}</p>`).join('')}${s.quoteSource?'</blockquote>':''}</div>${s.sequence?`<ol class="reader-score">${s.sequence.map(([a,b])=>`<li><strong>${e(a)}</strong><p>${e(b)}</p></li>`).join('')}</ol>`:''}${sectionImages(s,lang)}${colourStudy(s.palette,lang)}${s.gallery?.length?gallery(s.gallery,s.id,s.title,lang):''}${sectionVideos(p.videos||[],s.id,id,lang)}${animation(s.animation,lang)}${externalLinks(s.links,lang)}${s.columnSections?.length?`<div class="reader-photo-columns">${s.columnSections.map(part=>`<section id="${esc(part.id)}"><h4>${e(part.title)}</h4>${sectionBody(part,lang,id)}</section>`).join('')}</div>`:''}${(s.subsections||[]).map(part=>`<div class="reader-subsection" id="${esc(part.id)}"><h4>${e(part.title)}</h4>${sectionBody(part,lang,id)}</div>`).join('')}`;
  }
  function colourStudy(palette,lang) {
    if(!palette)return '';
    const e=value=>esc(text(value,lang));
    return `<div class="reader-colour-study">${palette.groups.map(group=>`<section class="reader-colour-group"><h4>${e(group.title)}<span>${e(group.share)}</span></h4><ul class="reader-swatches">${group.colours.filter(c=>/^#[\da-f]{6}$/i.test(c.hex)).map(c=>`<li><span class="reader-swatch" style="background-color:${esc(c.hex)}" aria-hidden="true"></span><div><strong>${e(c.name)}</strong><span class="reader-swatch-ratio">${esc(c.ratio)}</span></div><small>${esc(c.hex)} · ${esc(c.pantone)} TPG</small></li>`).join('')}</ul></section>`).join('')}<p class="reader-colour-note">${e(palette.note)}</p></div>`;
  }
  function render(id,lang='en',modal=true) {
    const p=get(id);if(!p)return '';
    const e=v=>esc(text(v,lang)),route=modal?(p.branch==='mentor'?'mentor/project':'artist/project'):'work';
    const bar=modal?`<div class="artist-detail-bar reader-bar"><span>CANQI / ${p.branch==='mentor'?label('TEACHING ARCHIVE','教学档案',lang):label('PROJECT ARCHIVE','项目档案',lang)}</span><div><button type="button" data-reader-language>${lang==='zh'?'EN':'中文'}</button><button type="button" class="artist-detail-close" data-project-close>${label('Close','关闭',lang)} ×</button></div></div>`:`<div class="reader-bar reader-standalone-bar"><a href="#works">← ${label('Works','作品',lang)}</a><button type="button" data-reader-language>${lang==='zh'?'EN':'中文'}</button></div>`;
    const versions=p.versions?`<nav class="reader-versions" aria-label="${label('Project iterations','项目迭代',lang)}">${p.versions.map(v=>`<a href="#${route}/${v.id}" ${v.id===id?'aria-current="page"':''}><span class="reader-date">${v.date}</span><strong>${e(v.title)}</strong><span>${e(v.note)}</span></a>`).join('')}</nav>`:'';
    const toc=p.sections.length>2?`<nav class="reader-toc" aria-label="${label('On this page','本页内容',lang)}"><details ${matchMedia('(min-width:651px)').matches?'open':''}><summary>${label('CONTENTS','阅读目录',lang)}</summary><ol>${p.sections.map((s,i)=>`<li><button type="button" data-reader-jump="${s.id}"><span>${String(i+1).padStart(2,'0')}</span>${e(s.title)}</button></li>`).join('')}</ol></details></nav>`:'';
    const sections=p.sections.map((s,i)=>`<section class="reader-section${s.quoteSource?' reader-reflection':''}" id="${s.id}" tabindex="-1"><header><span class="reader-chapter">${String(i+1).padStart(2,'0')}</span><h3>${e(s.title)}</h3></header>${sectionBody(s,lang,id)}</section>`).join('');
    const timeline=p.timeline?`<section class="reader-timeline"><h3>${label('Project chronology','项目时间线',lang)} / ${esc(p.year)}</h3><ol>${p.timeline.map(v=>`<li><span>${esc(v.date)}</span><p>${e(v.text)}</p></li>`).join('')}</ol></section>`:'';
    const credits=p.credits?`<section class="reader-credits"><h3>${label('Collaborators','合作署名',lang)}</h3><dl>${p.credits.map(([a,b])=>`<div><dt>${e(a)}</dt><dd>${e(b)}</dd></div>`).join('')}</dl></section>`:'';
    const heading=modal?'h2':'h1';
    const mentorBack=p.mentorSection==='mentor-sfk'?'mentor-sfk':'mentor-gafa';
    return `<article class="${modal?'artist-detail':'page'} project-reader" data-reader-project="${esc(id)}">${bar}<header class="reader-heading"><div class="reader-kicker"><span>${e(p.subtitle||p.medium)}</span><span>${esc(p.year)}</span></div><${heading} id="artist-dialog-title">${e(p.title)}</${heading}><p class="reader-medium">${e(p.medium)}</p><p class="reader-summary">${e(p.summary)}</p>${externalLinks(p.links,lang)}</header>${figure({asset:p.hero,caption:p.heroCaption||p.medium},lang,true)}${versions}<section class="reader-overview ${p.role?'':'reader-overview-facts'}">${p.role?`<div class="reader-role"><span>${label('MY ROLE','我的职责',lang)}</span><p>${e(p.role)}</p></div>`:''}<dl class="reader-facts">${(p.facts||[]).map(([a,b])=>`<div><dt>${e(a)}</dt><dd>${e(b)}</dd></div>`).join('')}</dl></section>${sections||timeline||credits?`<div class="reader-layout ${toc?'':'reader-layout-short'}">${toc}<div class="reader-body">${sections}${timeline}${credits}</div></div>`:''}<p class="reader-rights">${label('Artwork and text © their respective authors. Please request permission before reuse.','作品与文字版权归各自作者所有，转载或使用请先联系授权。',lang)} <a href="copyright.html" target="_blank" rel="noopener">${label('Image use & credits','图片使用与署名',lang)} ↗</a></p><nav class="reader-related" aria-label="${label('Related projects','相关项目',lang)}"><span>${label('CONTINUE READING','继续阅读',lang)}</span>${p.branch==="mentor"?`<a href="#${mentorBack}">${mentorBack==='mentor-sfk'?label("Back to SFK teaching","返回斯芬克教学",lang):label("Back to GAFA teaching","返回广美教学",lang)}<span aria-hidden="true">↗</span></a>`:""}${(p.related||[]).filter(r=>get(r)).map(r=>`<a href="#${route}/${r}">${esc(title(r,lang))}<span aria-hidden="true">↗</span></a>`).join('')}</nav></article>`;
  }
  function jump(root,id) {
    const section=Array.from(root.querySelectorAll('.reader-section')).find(s=>s.id===id);if(!section)return;
    const dialog=section.closest('dialog'),behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
    if(dialog)dialog.scrollTo({top:dialog.scrollTop+section.getBoundingClientRect().top-dialog.getBoundingClientRect().top-76,behavior});
    else window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-160,behavior});
    section.focus({preventScroll:true});
  }
  function stopVideos(scope=document) {
    stopAnimations(scope);
    scope.querySelectorAll('.reader-video:has(iframe,video)').forEach(figure=>{
      const local=figure.querySelector('video');
      if(local){local.pause();local.removeAttribute('src');local.load();}
      const [id,n]=figure.dataset.videoRecord.split(':'),v=get(id)?.videos?.[Number(n)];
      if(v)figure.querySelector('.reader-video-stage').innerHTML=videoButton(v,id,n,currentLang());
      else figure.querySelector('iframe')?.remove();
      figure.querySelector('[data-video-stop]').hidden=true;
    });
  }
  let lightbox=null;
  function closeImage(){if(lightbox){const old=lightbox;lightbox=null;old.close();old.remove();}}
  function showImage(link) {
    const a=asset(link.dataset.readerImage);if(!a)return;
    closeImage();
    const lang=currentLang(),cap=link.dataset.readerCaption;
    lightbox=document.createElement('dialog');lightbox.className='reader-lightbox';
    lightbox.setAttribute('aria-label',label('Project image','作品大图',lang));
    lightbox.innerHTML=`<div class="reader-lightbox-bar"><span>${esc(cap)}</span><button type="button" data-reader-zoom aria-pressed="false">${label('Zoom in','放大',lang)}</button><button type="button" data-reader-image-close autofocus>${label('Close','关闭',lang)} ×</button></div><div class="reader-lightbox-scroll" data-native-scroll><img src="${esc(a.file)}" alt="${esc(cap)}" decoding="async"></div>`;
    document.body.append(lightbox);lightbox.addEventListener('close',()=>{closeImage();if(link.isConnected)link.focus({preventScroll:true});},{once:true});lightbox.showModal();
  }
  document.addEventListener('click',event=>{
    const target=event.target.closest?.('button,a');if(!target)return;
    if(target.matches('[data-animation-toggle]')){setAnimation(target.closest('[data-reader-animation]'),target.getAttribute('aria-pressed')!=='true');return;}
    if(target.matches('[data-gallery-step]')){moveGallery(target.closest('[data-reader-gallery]'),Number(target.dataset.galleryStep));return;}
    if(target.matches('[data-reader-language]')){document.getElementById('language')?.click();return;}
    if(target.matches('[data-reader-jump]')){jump(target.closest('.project-reader'),target.dataset.readerJump);return;}
    if(target.matches('[data-reader-image]')){event.preventDefault();showImage(target);return;}
    if(target.matches('[data-reader-image-close]')){closeImage();return;}
    if(target.matches('[data-reader-zoom]')){const zoom=lightbox.classList.toggle('is-zoomed');target.setAttribute('aria-pressed',String(zoom));target.textContent=label(zoom?'Fit image':'Zoom in',zoom?'适应窗口':'放大',currentLang());return;}
    if(target.matches('[data-video-stop]')){const figure=target.closest('.reader-video');stopVideos(figure.parentElement);figure.querySelector('.reader-play')?.focus({preventScroll:true});return;}
    if(!target.matches('[data-project-video]'))return;
    const [id,n]=target.dataset.projectVideo.split(':'),v=get(id)?.videos?.[Number(n)];if(!v)return;
    stopVideos();
    if(v.provider==='local'){
      const player=document.createElement('video');
      player.controls=true;player.playsInline=true;player.preload='metadata';player.src=videoURL(v);
      player.setAttribute('aria-label',text(v.title,currentLang()));
      target.parentElement.replaceChildren(player);player.closest('.reader-video').querySelector('[data-video-stop]').hidden=false;
      player.focus();player.play().catch(()=>{});return;
    }
    const frame=document.createElement('iframe');frame.src=videoURL(v,true);frame.title=text(v.title,currentLang());frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    target.parentElement.replaceChildren(frame);frame.closest('.reader-video').querySelector('[data-video-stop]').hidden=false;frame.focus();
  });
  document.addEventListener('close',event=>{if(event.target.matches?.('#artist-project-dialog')&&!event.target.open){stopVideos(event.target);event.target.replaceChildren();delete event.target.dataset.project;}},true);
  window.addEventListener('hashchange',closeImage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){document.querySelectorAll('.reader-video video').forEach(v=>v.pause());stopAnimations();}});
  window.CanqiProjects={get,render,thumbnail,jump,stopVideos};
})();
