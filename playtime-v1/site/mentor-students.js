/* Student projects have their own directory; only individual works open a reader. */
(() => {
  const years=['2025','2026','2027'];
  const text=(value,lang)=>typeof value==='string'?value:value?.[lang]||value?.en||'';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M13 5l7 7-7 7"/></svg>';
  function parse(route){
    if(route!=='mentor-students'&&!route.startsWith('mentor-students/'))return null;
    const parts=route.split('/'),year=years.includes(parts[1])?parts[1]:'2025';
    return {year,base:`mentor-students/${year}`,project:parts[2]==='project'?parts[3]:null};
  }
  function render(lang,route){
    const t=(en,zh)=>lang==='zh'?zh:en;
    const state=parse(route),year=state.year;
    const populatedYears=new Set(Object.values(window.CANQI_PROJECTS).map(p=>p.cohort));
    const works=Object.entries(window.CANQI_PROJECTS).filter(([,p])=>p.cohort===year);
    const authors=[...new Set(works.map(([,p])=>p.studentKey))];
    const groups=authors.map(key=>{
      const entries=works.filter(([,p])=>p.studentKey===key),student=entries[0][1].student;
      return `<section class="student-author-group" id="student-${key}" aria-labelledby="student-${key}-title"><header class="student-author-heading"><h2 id="student-${key}-title">${esc(text(student,lang))}</h2><span>${t(`${entries.length} projects`,`${entries.length} 个项目`)}</span></header><div class="student-project-grid">${entries.map(([id,p],i)=>`<a class="student-project-card" href="#${p.detailRoute}/${id}" aria-label="${esc(text(p.title,lang)+' — '+text(student,lang))}"><span class="student-project-image">${window.CanqiProjects.thumbnail(id,lang,key===authors[0]&&i<2,true)}</span><div class="student-project-meta"><span>${esc(text(p.medium,lang))}</span>${p.videos?.length?`<span>${p.videos[0].provider==='youtube'?'YouTube':t('Film','影片')}</span>`:p.filmPlatform?`<span>${esc(p.filmPlatform)}</span>`:''}</div><div class="student-project-title"><h3>${esc(text(p.title,lang))}</h3>${arrow}</div></a>`).join('')}</div></section>`;
    }).join('');
    const empty=`<section class="student-cohort-empty"><h2>${t(`${year} selection to follow.`,`${year} 届作品待补充。`)}</h2><p>${t('This cohort’s selected projects have not been added yet.','这一届的项目精选尚未收录。')}</p><a href="#mentor-students/2025">${t('Browse the 2025 projects','查看 2025 届作品')}${arrow}</a></section>`;
    const missing=state.project&&!window.CanqiProjects.get(state.project);
    return `<section class="mentor-page mentor-students student-directory"><a class="mentor-back" href="#mentor-sfk">${t('Back to SFK teaching','返回斯芬克教学')}</a><header class="mentor-intro student-directory-intro"><h1>${t('Selected student<br>projects.','指导学生<br>项目精选。')}</h1><p>${t('Digital media, installations and spatial narratives.<br>Student work developed through project mentoring at SFK.','数字媒体、装置与空间叙事。<br>在斯芬克项目指导中逐步完成的学生作品。')}</p></header><nav class="student-cohorts" aria-label="${t('Browse by cohort','按届别浏览')}"><span>${t('Cohort','届别')}</span>${years.map(y=>`<a href="#mentor-students/${y}" ${y===year?'aria-current="page"':''}>${y}<small>${populatedYears.has(y)?t('Selected work','作品精选'):t('To follow','待补充')}</small></a>`).join('')}</nav>${missing?`<p class="student-route-notice" role="status">${t('This project is not in the archive. Browse the selection below.','暂未找到这个项目，请浏览下方作品。')}</p>`:''}<div class="student-directory-index"><p>${works.length?t(`${authors.length} students · ${works.length} projects`,`${authors.length} 位学生 · ${works.length} 个项目`):t('Student project archive','学生项目档案')}</p>${authors.length?`<nav aria-label="${t('Jump to student','跳转至学生')}">${authors.map(key=>`<button type="button" data-student-jump="student-${key}">${esc(text(works.find(([,p])=>p.studentKey===key)[1].student,lang))}</button>`).join('')}</nav>`:''}</div>${groups||empty}<p class="student-directory-rights">${t('Projects © their respective student authors. Project mentoring: Canqi Lin.','作品版权归各位学生作者所有。项目指导：林燦琪。')}</p><dialog class="artist-project-dialog mentor-project-dialog student-project-dialog" id="artist-project-dialog" aria-labelledby="artist-dialog-title"></dialog></section>`;
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-student-jump]');if(!link)return;
    const target=document.getElementById(link.dataset.studentJump);if(!target)return;
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    const heading=target.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});
  });
  window.CanqiStudentArchive={parse,render};
})();
