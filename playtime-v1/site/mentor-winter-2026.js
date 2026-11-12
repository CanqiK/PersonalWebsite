/* January 2026: course context and student-authored work from the supplied archive. */
(() => {
  const t=(en,zh)=>({en,zh});
  const pic=(name,en,zh)=>({asset:'winter-'+name,caption:t(en,zh)});
  const portfolio=(key,authorEn,authorZh)=>[
    pic(key+'-outcome',`${authorEn} · Final installation and details.`,`${authorZh} · 最终装置与细节。`),
    pic(key+'-cover',`${authorEn} · Original project opening spread.`,`${authorZh} · 项目原始首页排版。`),
    pic(key+'-process',`${authorEn} · Design development and fabrication.`,`${authorZh} · 设计推演与制作过程。`)
  ];
  window.CANQI_PROJECTS=Object.assign(window.CANQI_PROJECTS||{}, {
    'sfk-winter-2026':{
      branch:'mentor',mentorSection:'mentor-sfk',
      title:t('Human–Machine Co-Creation','人机·共塑'),
      subtitle:t('Interaction & Digital Media · Winter School','交互与数字媒体 · 冬令营'),
      year:'2026',
      medium:t('Project mentoring · Installation · Moving image','项目指导 · 装置 · 影像'),
      hero:'winter-preface',
      heroCaption:t('Human–Machine Co-Creation · Winter School Show, 2026. Exhibition preface and credits from the exhibition materials.','「人机·共塑」· 2026 冬校结营展。展览前言与署名，选自展览物料。'),
      summary:t('Four students, four completed installations, ten days on site. This record follows the group I mentored in the January 2026 SFK winter school, working with Allen Sayegh from Harvard GSD in the Harvard × Tongji interaction and digital media class.','四位学生、四组落地装置、十天在地创作。这里记录了我在 2026 年 1 月 SFK 冬令营中指导的小组项目，课程为哈佛 × 同济交互数媒班，与来自 Harvard GSD 的 Allen Sayegh 合作。'),
      role:t('As the group’s project mentor, I guided four students through the ten-day on-site programme to complete their individual projects. The supplied portfolios also credit me for project-layout mentoring. The works and their concepts presented below belong to the students.','我作为小组项目导师，在十天的在地课程中指导四位学生完成各自项目的落地。项目资料中同时记录了我的授课与排版指导职责。以下作品及其概念均由学生创作。'),
      facts:[
        [t('Programme','课程'),t('SFK · Harvard × Tongji Interaction & Digital Media Winter School','SFK · 哈佛 × 同济交互数媒冬令营')],
        [t('Date & duration','时间与周期'),t('January 2026 · 10 days on site','2026 年 1 月 · 在地 10 天')],
        [t('My group','指导小组'),t('4 students · 4 completed projects','4 位学生 · 4 组落地项目')],
        [t('Invited educator','合作导师'),t('Allen Sayegh · Harvard Graduate School of Design','Allen Sayegh · 哈佛大学设计研究生院')],
        [t('Concluding exhibition','结营展览'),t('Human–Machine Co-Creation','人机·共塑')]
      ],
      sections:[
        {
          id:'winter-context',title:t('Space as a participant','让空间成为参与者'),
          authors:t('Adapted from the exhibition preface.','据展览前言整理。'),
          paragraphs:[
            t('The exhibition approaches space as a responsive environment. Embedded computation, smart materials and sensing allow light, sound and physical form to respond to the visitor. It asks how these exchanges reshape bodily perception, behaviour and the ways people relate to one another.','展览将空间看作能够回应人的环境。嵌入式计算、智能材料与传感网络，让光线、声音和形态随观众的行动发生变化，并追问这种互动如何改变身体感知、行为与人与人之间的关系。'),
            t('Visitors complete the works through their presence and actions. Within this shared direction, my group developed four distinct projects addressing meritocratic pressure, technological intervention in nature, urban alienation, and the power relations around a dining table.','观众的到来与行动，是完成作品的最后一环。在这一共同方向下，我指导的小组分别从优绩主义压力、技术对自然的干预、城市中的疏离，以及餐桌中的权力关系出发，形成四组不同的作品。')
          ]
        },
        {
          id:'winter-mentoring',title:t('From a proposal to a working installation','从提案到装置落地'),
          paragraphs:[t('The portfolios trace the work from research and sketches to material tests, mechanisms, moving images and final documentation. Across ten days, the focus was on turning each student’s subject into a spatial experience that could be built and encountered.','项目档案记录了从研究、草图到材料试验、机械结构、影像与最终成果的推进。十天课程的重点，是把每位学生的议题转化为能够制作、并由观众进入和体验的空间作品。')],
          sequence:[
            [t('Research & proposition','研究与命题'),t('Clarify the subject and develop an installation concept through references, sketches and spatial studies.','通过参考研究、草图与空间推演，明确议题及装置概念。')],
            [t('Build & test','制作与试验'),t('Bring physical structures, materials, mechanisms and moving images together; test how a visitor encounters the work.','将结构、材料、机械与影像组合起来，测试观众如何与作品相遇。')],
            [t('Complete & document','完成与记录'),t('Complete four individual projects and record their outcomes in photographs, films and portfolio layouts.','完成四组独立项目，并通过照片、影片与作品集排版留下成果记录。')]
          ]
        },
        {
          id:'winter-grind',title:t('The Grind','持溃'),authors:t('Student artist · Chunying Xiao / 肖椿颖','学生作者 · 肖椿颖 / Chunying Xiao'),
          paragraphs:[
            t('The Grind examines the belief that effort inevitably leads to success, and the pressure to keep accelerating when that success remains out of reach. A hand-cranked mechanism turns sustained effort into a fragile visual order: apparent stability depends on continuous input, and the promised image breaks down when the movement stops.','《持溃》从“努力即成功”的信念切入，讨论成功不断被延迟时，人为何仍被要求持续加速。手摇机械将持续付出转化为脆弱的视觉秩序：表面的稳定依赖不断输入，一旦停止，承诺的图景便开始瓦解。'),
            t('A miniature office, one-way mirrors, moving images and mechanical components make the pressure tangible. Through the effort of operating the work, the visitor encounters the anxiety of being unable to stop.','微缩办公室、单向镜、影像与机械结构共同将这种压力具象化。观众在操作中感受身体的消耗，以及“不能停”的内在焦虑。')
          ],
          gallery:portfolio('grind','Chunying Xiao · The Grind','肖椿颖 ·《持溃》')
        },
        {
          id:'winter-corrosion',title:t('Internal Corrosion','内蚀'),authors:t('Student artist · Yajin Li / 李亚津','学生作者 · 李亚津 / Yajin Li'),
          paragraphs:[
            t('Internal Corrosion imagines a super-plant developed to capture carbon that escapes control under AI direction and begins to consume human memories. People lose their sense of self, while the forest mutates under the weight of the painful memories it absorbs.','《内蚀》构想了一种为固碳而生的超级植物：它在 AI 驱动下失控，从吸收碳转为掠夺人类记忆。人类逐渐迷失自我，森林也因吞噬过量痛苦记忆而发生畸变。'),
            t('A cold framework of metal shafts and aluminium contains distorted vegetation, screens and electronic components. The work asks what might be lost when technological salvation becomes another form of extraction.','冰冷的光轴与铝材框架禁锢着扭曲的植被，与屏幕、电子元件共同构成装置。作品追问：当技术救赎转为另一种掠夺，我们可能付出怎样的代价？')
          ],
          gallery:portfolio('corrosion','Yajin Li · Internal Corrosion','李亚津 ·《内蚀》')
        },
        {
          id:'winter-anchor',title:t('Breath Anchor','孤岛的呼吸锚点'),authors:t('Student artist · Rhine Yu / 喻姣睿','学生作者 · 喻姣睿 / Rhine Yu'),
          paragraphs:[
            t('Breath Anchor responds to alienation in a city saturated with algorithms and information. A semi-enclosed shell made from wire mesh and expanding foam holds a cluster of screens, creating a small refuge within the surrounding noise.','《孤岛的呼吸锚点》回应算法与高密度信息中的城市疏离。铁丝网与发泡材料构成半封闭外壳，包裹多块屏幕，在环境的喧嚣中留出一个短暂的庇护空间。'),
            t('Physical interaction links the visitor to a transition from anxiety and noise towards breathing, warmth and everyday details. The film and installation explore how a moment of withdrawal might help someone reconnect with their surroundings.','身体互动让观众进入从焦虑与杂声，转向呼吸、温度和日常细节的过程。影像与装置一起探索：短暂地抽离，能否帮助人重新建立与周围世界的联系。')
          ],
          gallery:portfolio('anchor','Rhine Yu · Breath Anchor','喻姣睿 ·《孤岛的呼吸锚点》'),
          links:[{url:'https://www.youtube.com/watch?v=NzxXTCRcjqs',label:t('Watch the experimental screen film · YouTube','观看实验影像 · YouTube')}]
        },
        {
          id:'winter-appetite',title:t('Appetite','食欲'),authors:t('Student artist · Rei Zhou / 周欣妍','学生作者 · 周欣妍 / Rei Zhou'),
          paragraphs:[
            t('Appetite starts from the dining table as a staged social encounter. Beyond satisfying hunger, a meal can become a contest of desire and a redistribution of power. The work takes this gap between the visible ritual and its hidden relations as its subject.','《食欲》把餐桌看作一场被编排的社会交往。吃饭在满足生理需求之外，也可能成为欲望的角逐与权力的再分配，作品由此关注仪式表面与隐蔽关系之间的落差。'),
            t('Visitors bend down to discover three screens beneath a red-draped table. Experimental images and a mechanism of rising metal elements expose another scene below the polished surface, shifting both the viewer’s posture and point of view.','观众需要俯身、弯腰，探视红色桌布下方的三面屏幕。实验影像与升降的金属构件揭示光鲜餐桌之下的另一重场景，同时改变观看的姿态与视角。')
          ],
          gallery:portfolio('appetite','Rei Zhou · Appetite','周欣妍 ·《食欲》')
        }
      ],
      videos:[
        {provider:'youtube',id:'b36D_zH9TVw',section:'winter-grind',poster:'winter-grind-outcome',title:t('The Grind · Project film by Chunying Xiao','《持溃》· 肖椿颖项目影片')},
        {provider:'youtube',id:'f_66aebYai8',section:'winter-anchor',poster:'winter-anchor-outcome',title:t('Breath Anchor · Project film by Rhine Yu','《孤岛的呼吸锚点》· 喻姣睿项目影片')},
        {provider:'youtube',id:'is25K6fCqlA',section:'winter-appetite',poster:'winter-appetite-outcome',title:t('Appetite · Project film by Rei Zhou','《食欲》· 周欣妍项目影片')}
      ],
      credits:[
        [t('Programme','课程组织'),t('SFK International Art Education','斯芬克国际艺术教育')],
        [t('Invited educator','合作导师'),'Allen Sayegh · Harvard GSD'],
        [t('Group project & layout mentoring','小组项目与排版指导'),t('Canqi Lin','林燦琪 Canqi')],
        [t('Student artists','学生作者'),t('Chunying Xiao · Yajin Li · Rhine Yu · Rei Zhou','肖椿颖 · 李亚津 · 喻姣睿 · 周欣妍')],
        [t('Exhibition curator','展览策展人'),t('Prof. Yu Xingze','于幸泽 Prof. Yu')],
        [t('Exhibition coordinator','展览统筹'),t('Cissi Yin','尹思朦 Cissi')]
      ],
      related:['sfk-living-art']
    }
  });
})();
