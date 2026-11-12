/* August 2026 course archive, drawn from the supplied curriculum and student portfolios. */
(() => {
  const t=(en,zh)=>({en,zh});
  const pic=(name,en,zh)=>({asset:'mit-'+name,caption:t(en,zh)});
  window.CANQI_PROJECTS=Object.assign(window.CANQI_PROJECTS||{}, {
    'sfk-mit-tongji-2026':{
      branch:'mentor',mentorSection:'mentor-sfk',
      title:t('Atlas of Moving Matter','流动物质图谱'),
      subtitle:t('MIT × Tongji · Art & Technology Summer School','MIT × 同济 · 艺术科技夏校'),
      year:'2026',
      medium:t('Curriculum & project mentoring · Interactive installation','指导教研 · 交互装置'),
      hero:'mit-flux-overview',
      heroCaption:t('Externality Flux · Student-team installation, from the project portfolio.','《热阈衍流》· 学生团队装置，选自项目作品集。'),
      summary:t('Shanghai became a laboratory for turning observations of the city into interactive objects. As a teaching and curriculum mentor, I guided 11 digital-media students across five groups and coordinated the class workflow. This archive presents four selected group projects.','以上海为实验场，将城市观察转化为交互装置。我作为指导教研，负责 11 位数媒学生、5 个小组的项目指导，以及整个班级的工作梳理。这里选呈其中四组作品。'),
      role:t('I worked with the course educators to guide project development, organise the class workflow and support the progression from research to completed installations. I also hosted the closing ceremony. The works below were created by the student teams; the credits identify the students I mentored.','我与课程导师共同推进项目，负责小组指导与班级工作的梳理，协助同学将研究议题发展为可以落地的装置，并主持了结营仪式。以下作品由学生团队创作，署名列出我所指导的同学。'),
      facts:[
        [t('Programme','课程'),t('SFK · MIT × Tongji Summer School','SFK · MIT × 同济夏校')],
        [t('Date & location','时间与地点'),t('7–16 August 2026 · Shanghai · Tongji University','2026.08.07 — 08.16 · 上海 · 同济大学')],
        [t('Course direction','课程方向'),t('Atlas of Moving Matter · Sci-Fi Objects × Urban Systems × Interactive Prototypes','流动物质图谱 · 科幻物件 × 城市系统 × 交互原型')],
        [t('My mentoring scope','指导范围'),t('11 digital-media students · 5 groups','11 位数字媒体学生 · 5 个小组')],
        [t('Course educators','课程导师'),'Kaiho Yu · Kye'],
        [t('Selection shown here','本页精选'),t('4 group projects · 2 images per group','4 组作品 · 每组 2 张图')]
      ],
      sections:[
        {
          id:'mit-context',title:t('From science fiction to science fabrication','从科幻构想到可体验的物件'),
          authors:t('Course direction: Atlas of Moving Matter · Kaiho Yu.','课程方向：Atlas of Moving Matter · Kaiho Yu。'),
          paragraphs:[t('The course reads Shanghai through its industrial traces, flows of people and materials, digital life and invisible climates. Field observations become questions about the future, then physical and digital prototypes that visitors can encounter. Research, storytelling and making develop together.','课程从工业痕迹、人和物的流动、数字生活以及不可见的气候切入，阅读上海的城市系统。现场观察形成面向未来的问题，再通过实体与数字原型转化为观众可以体验的作品，让研究、叙事与制作同步推进。')],
          sequence:[
            [t('Read the city','阅读城市'),t('Gather observations, interviews, recordings and material samples from everyday urban life.','从日常城市生活中收集观察、访谈、录音与材料样本。')],
            [t('Speculate on the future','构想未来'),t('Turn a real issue into a future scenario and a proposition for a Sci-Fi Object.','将现实议题转化为未来情境，提出一个科幻物件的命题。')],
            [t('Fabricate an experience','制作体验'),t('Combine materials, mechanisms, sensors, sound and moving images in a working prototype.','结合材料、机械、传感、声音与影像，完成能够运行的交互原型。')]
          ]
        },
        {
          id:'mit-mentoring',title:t('Guiding five groups through the work','五个小组的项目推进'),
          paragraphs:[t('My role connected the individual projects with the rhythm of the class: helping students clarify what they wanted to address, translate that question into an installation and work through the decisions needed to complete it. The outcomes brought together spatial construction, sound, moving image and interaction.','我的工作连接着各组项目与全班的推进节奏：帮助同学梳理想要讨论的问题，将问题转译为装置，并在制作过程中逐步落实。最终成果结合了空间搭建、声音、影像与交互。')],
          imageLayout:'compact-pair',
          images:[
            pic('teaching-discussion','Canqi in a project discussion during the summer school.','夏校期间，Canqi 参与项目讨论。'),
            pic('teaching-review','Canqi reviewing project work with a student.','Canqi 与同学共同梳理项目。')
          ]
        },
        {
          id:'mit-rooted',title:t('Rooted Routes','乡音沪糅'),
          authors:t('Students I mentored · Zhang Chenyu & Ji Chenxu','指导学生 · 张晨宇、季辰旭'),
          paragraphs:[t('Starting from dialects and migration in Shanghai, the team collected voices around Qipu Road and explored how language is shaped by economic and spatial divisions. Layered maps, recordings and vibrating plates turn the city’s overlapping voices into a sound installation, making the relationship between language, place and belonging tangible.','作品从上海的方言与迁徙经验出发，通过七浦路的声音采集与访谈，观察语言如何受到经济和空间分层的影响。叠层地图、录音与振动板将交织的城市声音转化为装置，呈现语言、地方与归属之间的关系。')],
          imageLayout:'compact-pair',
          images:[
            pic('rooted-overview','Rooted Routes · Installation overview.','《乡音沪糅》· 装置整体。'),
            pic('rooted-interaction','Rooted Routes · Visitors encountering the vibrating plates.','《乡音沪糅》· 观众体验振动板。')
          ]
        },
        {
          id:'mit-flux',title:t('Externality Flux','热阈衍流'),
          authors:t('Students I mentored · Liang Ruixin & Jian Shiyi','指导学生 · 梁睿鑫、蹇诗怡'),
          paragraphs:[t('The project looks at unequal exposure to urban heat and the external costs of cooling. A role-based game connects everyday decisions with changing lights in a miniature city. Individual comfort becomes part of a shared thermal system, allowing visitors to see how one person’s choices can shift the burden onto others.','作品关注城市热环境中的不平等，以及降温行为转移到他人身上的代价。角色游戏将日常选择与微缩城市中的灯光变化关联起来：个人的舒适被放入共同的热系统，观众得以看见自己的选择如何改变他人的处境。')],
          imageLayout:'compact-pair',
          images:[
            pic('flux-overview','Externality Flux · The contrasting exhibition environments.','《热阈衍流》· 相互对照的展陈空间。'),
            pic('flux-detail','Externality Flux · Illuminated miniature city and interactive display.','《热阈衍流》· 微缩城市与交互展示。')
          ]
        },
        {
          id:'mit-flora',title:t('FLORA·DOMAIN·COMPUTE','FLORA·DOMAIN·COMPUTE'),
          authors:t('Students I mentored · Hua Hanxin & Lou Bingyan','指导学生 · 华韩昕、楼冰彦'),
          paragraphs:[t('This speculative project imagines underwater data centres and an evolved Boston ivy that helps cool and purify their environment. Organic forms, metal structures, plants and projection propose a third ecology between nature and computation, asking how technological infrastructure might reshape the organisms around it.','这是一个围绕水下数据中心展开的未来构想：演化后的爬山虎参与降温、净化水体与调节环境。有机形态、金属结构、植物与投影共同构成自然和计算之间的“第三生态”，讨论技术基础设施如何改变周围的生命系统。')],
          imageLayout:'compact-pair',
          images:[
            pic('flora-overview','FLORA·DOMAIN·COMPUTE · Installation and projection.','FLORA·DOMAIN·COMPUTE · 装置与投影。'),
            pic('flora-detail','FLORA·DOMAIN·COMPUTE · Organic forms within the structure.','FLORA·DOMAIN·COMPUTE · 结构中的有机形态。')
          ]
        },
        {
          id:'mit-cutoff',title:t('Critical Cutoff Grade','Critical Cutoff Grade'),
          authors:t('Students I mentored · Wen Yuchang & Zhao Yanran','指导学生 · 温语畅、赵嫣然'),
          paragraphs:[t('The mining term “cutoff grade” marks the threshold at which extraction is considered worthwhile. The project extends this logic to abandoned mines and industrial heritage: what remains after a place loses its economic value? Rocks, screens and scanning interactions invite visitors to reconsider the memories, materials and possibilities left behind.','“边界品位”是矿业中判断资源是否值得开采的临界值。作品将这一逻辑延伸至废弃矿场与工业遗产：当一处地方失去经济价值，仍有什么值得留下？岩石、屏幕与扫描互动引导观众重新理解被遗留的记忆、材料和可能性。')],
          imageLayout:'compact-pair',
          images:[
            pic('cutoff-overview','Critical Cutoff Grade · Final installation.','Critical Cutoff Grade · 最终装置。'),
            pic('cutoff-interaction','Critical Cutoff Grade · Interaction with the mineral display.','Critical Cutoff Grade · 矿物展示的互动过程。')
          ]
        },
        {
          id:'mit-journey',title:t('Closing the workshop, continuing the record','结营与课程记录'),
          paragraphs:[t('The ten-day workshop concluded with the Human–Machine Co-Creation exhibition and a closing ceremony that I hosted. I also produced SFK’s WeChat article documenting the summer school. Its video includes material from this class; the complete post is available below.','十天的工作坊最终以「人机共塑」展览及结营仪式收束，我主持了此次结营仪式。同时，我制作了 SFK 的夏校公众号推文，其中的视频包含这个班级的部分内容，可通过下方入口查看完整推文。')],
          images:[pic('closing','Canqi hosting the workshop’s closing ceremony.','Canqi 主持工作坊结营仪式。')],
          links:[{url:'https://mp.weixin.qq.com/s/l5Jpld6a7XHorNsQCsS7zg',label:t('Read the summer-school story & watch the video · WeChat','查看夏校推文与视频 · SFK 公众号')}]
        }
      ],
      credits:[
        [t('Programme organisation','课程组织'),t('SFK International Art Education','斯芬克国际艺术教育')],
        [t('Course educators','课程导师'),'Kaiho Yu · Kye'],
        [t('Teaching & curriculum team','教研团队'),t('Li Xin · Canqi Lin','李欣 · 林燦琪 Canqi')],
        [t('Group mentoring & class coordination','小组指导与班级工作梳理'),t('Canqi Lin','林燦琪 Canqi')],
        [t('Student work','学生作品'),t('Created by the respective student teams. Each section names the students I mentored.','作品由各学生团队创作；各节列出我所指导的同学。')],
        [t('WeChat article production','公众号推文制作'),t('Canqi Lin · Published by SFK','Canqi · SFK 公众号发布')]
      ],
      related:['sfk-living-art','sfk-winter-2026']
    }
  });
})();
