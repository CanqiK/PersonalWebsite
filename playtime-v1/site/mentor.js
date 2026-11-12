/* Teaching stays in its own branch; student work is part of the course archive. */
window.CanqiMentor={
 render(lang='en',route='mentor'){
  const t=(en,zh)=>lang==='zh'?zh:en;
  const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M13 5l7 7-7 7"/></svg>';
  const entry=(id,date,title,role,copy)=>`<article class="mentor-card mentor-text-card" id="${id}"><p class="mentor-entry-date">${date}</p><h3>${title}</h3><div class="mentor-card-details"><p class="mentor-entry-role">${role}</p><p class="mentor-entry-copy">${copy}</p></div><p class="mentor-entry-note">${t('Documentation to follow.','课程与项目资料待补充。')}</p></article>`;
  if(route==='mentor-students')return `<section class="mentor-page mentor-students"><a class="mentor-back" href="#mentor-sfk">${t('Back to SFK teaching','返回斯芬克教学')}</a><header class="mentor-intro"><h1>${t('Selected student<br>projects.','指导学生<br>项目精选。')}</h1><p>${t('SFK International Art Education<br>Digital media project mentoring','斯芬克国际艺术教育<br>数字媒体项目指导')}</p></header><div class="mentor-student-intro"><h2>${t('Work developed through mentoring','在指导中逐步完成的作品')}</h2><p>${t('A collection of student projects developed with my guidance in digital media and spatial performance.','这里将汇集我在数字媒体与空间表演方向指导的学生项目。')}</p></div><div class="mentor-student-empty"><p>${t('Project selection in preparation','项目精选整理中')}</p><h2>${t('Student work will be presented here.','学生作品将在这里呈现。')}</h2><p>${t('Project images, student credits, concepts and mentoring notes will be added as the records are collected.','后续将逐项补充作品图像、学生署名、项目概念及指导内容。')}</p></div></section>`;
  return `<div class="mentor-page">
   <header class="mentor-intro"><h1>${t('As a mentor.','作为导师。')}</h1><p>${t('Teaching, curriculum development and the work we make together.','教学、课程研发，以及我们一起做出来的作品。')}</p></header>
   <div class="mentor-institutions" data-native-scroll role="region" aria-label="${t('Teaching at GAFA and SFK','广美与斯芬克教学')}" tabindex="0">
   <section class="mentor-institution" id="mentor-gafa" aria-labelledby="mentor-gafa-title">
    <div class="mentor-institution-heading"><h2 id="mentor-gafa-title">${t('Guangzhou Academy<br>of Fine Arts','广州美术学院')}</h2><p>${t('Externally appointed course lecturer<br>School of Architecture and Applied Arts','建筑艺术设计学院<br>外聘专业课导师')}</p></div>
    <div class="mentor-programmes"><a class="mentor-card mentor-feature" href="#mentor/project/gafa-presence" aria-label="${t('Explore Present the Absent, teaching and exhibition at GAFA','查看「在场不在场」广美课程与展览')}">
     ${window.CanqiProjects.thumbnail('gafa-presence',lang,true,false)}
     <div class="mentor-feature-copy"><p class="mentor-feature-course">${t('Decoration & Furnishing (Public Art) · 2025','装饰与陈设（公共艺术） · 2025')}</p><h3>${t('Present<br>the Absent','在场<br>不在场')}</h3><div class="mentor-feature-bottom"><p>${t('From everyday experience to six installations and one shared exhibition.','从生活经验出发，完成六组装置与一场共同的展览。')}</p><span>${t('Explore the course','进入课程档案')}${arrow}</span></div></div>
    </a>
    ${entry('gafa-landscape-2026',t('19 OCT 2026 · FOUR WEEKS','2026.10.19 起 · 四周'),t('Public Art<br>Landscape Architecture','公共艺术课<br>风景园林班'),t('Externally appointed lecturer','外聘讲师'),t('A four-week Public Art course for the Landscape Architecture class at Guangzhou Academy of Fine Arts, beginning on 19 October 2026.','面向广州美术学院风景园林班的公共艺术课程，2026 年 10 月 19 日开始，为期四周。'))}
    ${entry('gafa-graduation-2026',t('NOV 2026 — JUN 2027','2026.11 — 2027.06'),t('Graduation Design','毕业设计课程'),t('Graduation design supervisor','毕业设计导师'),t('Graduation design supervision at the School of Architecture, Guangzhou Academy of Fine Arts, from November 2026 to June 2027.','广州美术学院建筑学院毕业设计指导，课程时间为 2026 年 11 月至 2027 年 6 月。'))}
    </div>
   </section>
   <section class="mentor-institution mentor-sfk" id="mentor-sfk" aria-labelledby="mentor-sfk-title"><div class="mentor-institution-heading"><h2 id="mentor-sfk-title">${t('SFK International<br>Art Education','斯芬克国际艺术教育')}</h2><p>${t('Digital media teaching<br>& curriculum development','数字媒体教研<br>与教学指导')}</p></div><div class="mentor-programmes"><a class="mentor-card mentor-sfk-panel mentor-students-link" href="#mentor-students"><p class="mentor-feature-course">${t('PROJECT MENTORING','项目指导')}</p><h3>${t('Selected<br>student projects.','指导学生<br>项目精选。')}</h3><div class="mentor-sfk-copy"><p>${t('Student work in digital media and spatial performance, developed through project mentoring.','我所指导的数字媒体与空间表演方向学生作品。')}</p></div><span class="mentor-students-cta">${t('Explore student projects','进入学生项目列表')}${arrow}</span></a>
    <a class="mentor-card mentor-course-record" id="sfk-today-2026" href="#mentor/project/sfk-living-art">
      ${window.CanqiProjects.thumbnail('sfk-living-art',lang,false,false)}
      <div class="mentor-course-copy">
      <p class="mentor-entry-date">${t('23 JUL — 01 AUG 2026 · TODAY ART MUSEUM','2026.07.23 — 08.01 · 今日美术馆')}</p>
      <h3>${t('Living Art','生命艺术')}</h3>
      <p class="mentor-course-subtitle">${t('Art & Technology Summer School','艺术科技夏令营')}</p>
      <div class="mentor-card-details">
      <p class="mentor-entry-role">${t('Exhibition coordination · Teaching · Spatial & graphic design','展览统筹 · 教学 · 场地与平面设计')}</p>
      <p class="mentor-entry-copy">${t('Three studios, one shared exhibition. Research, project development and selected student works at Today Art Museum.','三个班级，共同完成一场展览。记录今日美术馆的课程、展览规划与学生作品。')}</p>
      </div>
      <span class="mentor-students-cta">${t('Explore the course & exhibition','进入课程与展览档案')}${arrow}</span>
      </div>
    </a>
    <a class="mentor-card mentor-course-record" id="sfk-mit-tongji-2026" href="#mentor/project/sfk-mit-tongji-2026">
      ${window.CanqiProjects.thumbnail('sfk-mit-tongji-2026',lang,false,true)}
      <div class="mentor-course-copy">
      <p class="mentor-entry-date">${t('7–16 AUG 2026 · SHANGHAI','2026.08.07 — 08.16 · 上海')}</p>
      <h3>${t('Atlas of<br>Moving Matter','流动物质图谱')}</h3>
      <p class="mentor-course-subtitle">${t('MIT × Tongji Summer School','MIT × 同济夏校')}</p>
      <div class="mentor-card-details"><p class="mentor-entry-role">${t('Curriculum & project mentoring · Class coordination','指导教研 · 项目指导 · 班级工作梳理')}</p>
      <p class="mentor-entry-copy">${t('11 digital-media students, five groups. From urban research to interactive installations, with four selected projects presented here.','11 位数媒学生，5 个小组。从城市研究到交互装置，这里选呈四组作品。')}</p></div>
      <span class="mentor-students-cta">${t('Explore the course & student work','进入课程与学生作品')}${arrow}</span>
      </div>
    </a>
    <a class="mentor-card mentor-course-record" id="sfk-winter-2026" href="#mentor/project/sfk-winter-2026">
      ${window.CanqiProjects.thumbnail('sfk-winter-2026',lang,false,true)}
      <div class="mentor-course-copy">
      <p class="mentor-entry-date">${t('JAN 2026 · 10 DAYS ON SITE','2026.01 · 在地 10 天')}</p>
      <h3>${t('Human–Machine<br>Co-Creation','人机·共塑')}</h3>
      <p class="mentor-course-subtitle">${t('Interaction & Digital Media Winter School','交互与数字媒体冬令营')}</p>
      <div class="mentor-card-details"><p class="mentor-entry-role">${t('Project mentoring · Harvard × Tongji class','项目指导 · 哈佛 × 同济班')}</p>
      <p class="mentor-entry-copy">${t('Four students, four installations. Concepts, making and outcomes from the group I mentored.','四位学生，四组装置。记录我所指导小组的项目概念、制作与最终成果。')}</p></div>
      <span class="mentor-students-cta">${t('Explore the course & student work','进入课程与学生作品')}${arrow}</span>
      </div>
    </a>
    <a class="mentor-card mentor-course-record" id="sfk-nyu-2025" href="#mentor/project/sfk-nyu-2025">
      ${window.CanqiProjects.thumbnail('sfk-nyu-2025',lang,false,true)}
      <div class="mentor-course-copy">
      <p class="mentor-entry-date">${t('10–19 AUG 2025 · BEIJING','2025.08.10 — 08.19 · 北京')}</p>
      <h3>${t('Multimodal<br>Experiments','多模态实验')}</h3>
      <p class="mentor-course-subtitle">${t('NYU Digital Media & Interaction Summer School','NYU 数媒交互夏校')}</p>
      <div class="mentor-card-details"><p class="mentor-entry-role">${t('Project mentoring · Kevin Cunningham & Cao Yuxi','项目指导 · 与 Kevin Cunningham、曹雨西合作')}</p>
      <p class="mentor-entry-copy">${t('Six students, six projects. Installation, moving image and the Unbounded exhibition.','六位学生，六个项目。装置、影像与「无界」结营展览。')}</p></div>
      <span class="mentor-students-cta">${t('Explore the course & student work','进入课程与学生作品')}${arrow}</span>
      </div>
    </a>
   </div></section>
   </div>
   <dialog class="artist-project-dialog mentor-project-dialog" id="artist-project-dialog" aria-labelledby="artist-dialog-title"></dialog>
  </div>`;
 }
};
