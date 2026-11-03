/* Living Art: source-led teaching and exhibition record, July–August 2026. */
(() => {
  const t=(en,zh)=>({en,zh});
  const pic=(name,en,zh,zoom=true)=>({asset:'la-'+name,caption:t(en,zh),zoom});
  const selected=[
    ['Qing Xiao — Between Us','肖晴 —《我们之间》'],
    ['Yuqiao Zhang — X-PLANTS','张聿乔 —《X 光–植物》'],
    ['Zoe — Second Nature','Zoe —《第二自然》'],
    ['Hongyu Meng — Suspension Lives','孟洪羽 —《悬置生命》'],
    ['Haonan Qian — AEP: Aesthetic Evolution Program','钱昊男 —《AEP：审美演化计划》'],
    ['Hannah — Rivers Beneath the Soil','禹知含 —《河流在土壤之下》'],
    ['Yinuo Wang — The Gardener','王一诺 —《修剪》'],
    ['Zhitian Chen — Covered Memories','陈芷湉 —《被覆盖的记忆》'],
    ['Yueyuan Shen — Living Language of the Land','Yueyuan Shen —《大地的活语言》'],
    ['Can Zhang — Through the Cracks','张粲 —《穿越缝隙》'],
    ['Songruiyang Deng — Beyond the Line','邓宋瑞阳 — Beyond the Line'],
    ['Yufei Shao — Life Once Happened Here','邵语飞 — Life Once Happened Here'],
    ['Zhixuan Li — Hidden Rhythms','李芷萱 — Hidden Rhythms'],
    ['Yitong Zeng — The Wind’s Signature','曾一桐 — The Wind’s Signature'],
    ['Manting Lin — Tunnel No. 16','林曼婷 — Tunnel No. 16']
  ].map(([en,zh],i)=>pic(`selected-${String(i+1).padStart(2,'0')}`,`SELECTED ${String(i+1).padStart(2,'0')} / ${en} · ${i<10?'Exhibition documentation':'Project portfolio'}`,`SELECTED ${String(i+1).padStart(2,'0')} / ${zh} · ${i<10?'展览现场记录':'项目排版'}`));
  window.CANQI_PROJECTS=Object.assign(window.CANQI_PROJECTS||{}, {
    'sfk-living-art':{
      branch:'mentor',mentorSection:'mentor-sfk',
      title:t('Living Art','生命艺术'),
      subtitle:t('Art & Technology Summer School','艺术科技夏令营'),
      year:'2026',
      medium:t('Teaching · Exhibition coordination · Spatial & graphic design','教学 · 展览统筹 · 场地与平面设计'),
      hero:'la-key-visual',
      heroCaption:t('Living Art · Exhibition visual · 1 August 2026.','「生命艺术」· 展览主视觉 · 2026 年 8 月 1 日。'),
      summary:t('Three studios came together at Today Art Museum for Living Art, an SFK summer school and concluding exhibition. From proposals and shared critiques to installation and exhibition, the programme approached life as an unfinished process shaped through relationships, technology and the environment.','三个班级汇聚于北京今日美术馆，完成 SFK「生命艺术」夏令营与结营展。从前期提案、共同讨论到作品制作与布展，课程围绕生命如何在关系、技术和环境中持续生成而展开。'),
      role:t('I coordinated teaching and exhibition planning across the three classes, with my main teaching responsibility in Fei Jun’s Art & Technology class. I worked with the overseas professors, taught alongside them, and undertook the spatial planning and graphic design. Together with Krzysztof Wodiczko, Kristina Cranfeld and Fei Jun, I supported students in developing their projects and bringing them into the exhibition.','我负责三个班级的课程与展览统筹，主要负责费俊教授的艺术与科技班级，与海外教授对接并共同授课，同时承担场地规划与平面设计。我与 Krzysztof Wodiczko、Kristina Cranfeld 和费俊教授一起，带领同学们推进项目并完成展览。'),
      facts:[
        [t('On-site programme','线下课程'),t('23 July — 1 August 2026','2026 年 7 月 23 日 — 8 月 1 日')],
        [t('Exhibition opening','展览开幕'),t('1 August 2026','2026 年 8 月 1 日')],
        [t('Venue','场地'),t('Today Art Museum, Hall 3 · Beijing','北京今日美术馆 · 3 号馆')],
        [t('Programme & collaboration','课程与合作'),t('SFK International Art Education · MOUJITI ART+TECH','斯芬克国际艺术教育 · 某集体 ART+TECH')],
        [t('Curator','策展人'),t('Prof. Fei Jun','费俊教授')]
      ],
      sections:[
        {
          id:'living-concept',title:t('An open condition for life','让生命持续发生的开放条件'),
          authors:t('From the exhibition statement, Living Art.','摘自「生命艺术」展览前言。'),
          paragraphs:[
            t('“Living” is not a simple designation of being alive, but a state of continuous becoming—unfinished, opened, and unfolding through relations. It is not a fixed object, but a mode of existence that must be experienced through time and transformation.','“Living”并非对“活着”的简单指认，而是一种持续生成的状态——未完成、未封闭、在关系中不断展开的过程。它不是被固定的对象，而是一种需要在时间与变化中被经历的存在方式。'),
            t('It is precisely here that the singularity of life emerges—in what cannot be fully integrated into systems: hesitation, misunderstanding, deviation, and responses to others that resist computation. These “non-optimal” dimensions preserve life’s unrealized potential and reassert the necessity of art. By introducing uncertainty, art activates processes of becoming and loosens closed structures.','生命的独特性显现于无法被系统整合的部分——迟疑、误解、偏差，以及对他者不可计算的回应。这些“非最优”维度，使生命保留未被实现的潜能，也使艺术获得新的必要性：它通过引入不确定性，激活生成，使封闭结构出现松动。'),
            t('This exhibition does not seek to define, but to construct an open condition. It invites creators to enter a state of life itself—to perceive, translate, and generate experience—so that art moves beyond expressing life to becoming a mode through which life continues to unfold.','本次展览不提供定义，而是去构建一种开放条件：邀请创作者进入生命的状态，去感知、转译并生成经验——使艺术不再只是关于生命的表达，而成为生命持续发生的一种方式。')
          ],
          sequence:[
            [t('Mechanics as Living Object','机械生体'),t('Machines are no longer static, passive tools. Through movement, wear, sensing, and feedback, objects acquire life-like rhythms. Within their relations to humans, technology, and the environment, they continuously transform and regenerate between operation and instability.','机械不再是静止、被动的工具。运动、磨损、感知与反馈赋予物体近似生命的节律，使其在人、技术与环境的关系中持续变化。机械由此成为一种未完成的存在，在运转与失控之间不断生成自身。')],
            [t('Data as Living Simulation','数据拟生'),t('Data does not merely record life; it participates in simulating and shaping it. Emotions, identities, and behaviors become computable patterns that generate new realities through circulation and recombination, while gaps and errors reveal what remains beyond measurement.','数据不只是生命留下的记录，也参与生命的模拟与塑造。情感、身份和行为被转化为可计算的模式，并在流动、复制与重组中生成新的现实；而数据的缺失、误差与偏差，也显露出生命不可被量化的部分。')],
            [t('Algorithm as a Living System','算法生态'),t('An algorithm is not a closed set of fixed instructions, but a dynamic system formed through inputs, rules, feedback, and environments. As it learns and adapts, it reshapes participants’ choices and actions, redistributing and contesting the possibilities of life.','算法并非封闭、固定的指令，而是由输入、规则、反馈与环境共同构成的动态系统。它在学习与适应中持续演化，同时影响参与者的选择与行动，使生命的可能性被重新触发、分配与争夺。')]
          ]
        },
        {
          id:'living-studios',title:t('Three studios, one exhibition','三个班级，共同完成一场展览'),
          paragraphs:[t('The three studios worked across art and technology, digital media, and interaction design. Fei Jun curated the concluding exhibition. My main class was Art & Technology; my exhibition coordination extended across the three classes and the shared venue.','三个班级分别从艺术与科技、数字媒体和交互设计展开，由费俊教授担任结营展策展人。我主要负责艺术与科技班级，同时统筹三个班级在同一展馆中的课程与策展事务。')],
          sequence:[
            [t('Art & Tech Design Studio','艺术与科技研究生班'),t('Krzysztof Wodiczko · Kristina Cranfeld · Fei Jun. The class I mainly supported, from research and project discussions to installation and exhibition.','Krzysztof Wodiczko · Kristina Cranfeld · 费俊。这是我主要负责的班级，参与研究、项目讨论以及作品制作与展出。')],
            [t('Digital Media Studio','数字媒体研究生班'),t('Kevin Cunningham · James Cao Yuxi. Digital-media projects formed part of the shared Living Art exhibition.','Kevin Cunningham · 曹雨西 James。数字媒体方向的学生作品共同纳入「生命艺术」展览。')],
            [t('Interactive Design Studio','交互设计研究生班'),t('Ruairi Glynn. Interaction-design projects were developed within the summer school and presented in the concluding exhibition.','Ruairi Glynn。交互设计方向的学生在夏令营中推进项目，并参与最终展览。')]
          ],
          images:[pic('journey-00','Faculty gathering in front of the Living Art exhibition identity.','教授团队与「生命艺术」展览视觉。')]
        },
        {
          id:'living-teaching',title:t('From the nearby to an intervention','从「附近」出发，形成一次介入'),
          authors:t('Teaching directions drawn from the pre-course briefs by Krzysztof Wodiczko and Kristina Cranfeld, and the joint reviews with Fei Jun.','根据 Krzysztof Wodiczko、Kristina Cranfeld 的课前文件，以及与费俊教授的共同评议整理。'),
          paragraphs:[
            t('Krzysztof Wodiczko’s brief, Art as Design Intervention, asked students to identify overlooked needs in everyday life and develop responses that were both practical and symbolic. The proposal was not simply an object: it could introduce another way of sensing, thinking or acting within a social, cultural or environmental situation.','Krzysztof Wodiczko 的课题 Art as Design Intervention，要求学生从日常生活中被忽视的需求出发，提出兼具实际与象征意义的介入。提案不只是一件物品，也可以是在具体社会、文化或环境情境中，打开另一种感知、思考和行动的方式。'),
            t('Kristina Cranfeld began with a real place: observe its inhabitants, movements and conditions, then imagine it from an unfamiliar perspective. A stone, a snail or a chair could become the starting point for a short fiction, and that fiction could develop into a film, installation, object, sound work or performance.','Kristina Cranfeld 从一个真实地点切入：记录它的使用者、流动与环境，再以不熟悉的视角重新看待它。一块石头、一只蜗牛或一张椅子，都可以成为短篇虚构的起点，并进一步转化为影像、装置、物件、声音或表演。')
          ],
          sequence:[
            [t('Observe & question','观察与提问'),t('Select a place or an overlooked need. Build the proposal through observation, contextual research and dialogue rather than starting with a finished form.','选择地点或被忽视的需求，通过观察、背景研究与对话形成提案，而不是先确定一个完成的造型。')],
            [t('Translate & test','转译与试验'),t('Clarify the intention, materials, scale, technical requirements and the audience’s relationship to the work. Develop a proposal that can be discussed and tested.','明确创作意图、材料、尺度、技术需求以及观众与作品的关系，将想法转成能够讨论和测试的方案。')],
            [t('Review & exhibit','评议与展出'),t('Joint review with Krzysztof Wodiczko, Kristina Cranfeld and Fei Jun on 30 July; exhibition preparation on 31 July; opening on 1 August.','7 月 30 日与 Krzysztof Wodiczko、Kristina Cranfeld、费俊教授共同评议；7 月 31 日进行展览准备；8 月 1 日开幕。')]
          ],
          gallery:[
            pic('journey-04','CANQI with Krzysztof Wodiczko during a project discussion.','CANQI 与 Krzysztof Wodiczko 教授进行项目讨论。'),
            pic('journey-02','Krzysztof Wodiczko reviewing a student’s work.','Krzysztof Wodiczko 教授查看学生作品。'),
            pic('journey-15','CANQI and students working through a project at the screen.','CANQI 与学生围绕电脑中的项目进行讨论。'),
            pic('journey-06','CANQI and Krzysztof Wodiczko during the programme.','夏令营中的 CANQI 与 Krzysztof Wodiczko 教授。')
          ]
        },
        {
          id:'living-planning',title:t('Planning the exhibition together','场地规划与展览统筹'),
          paragraphs:[
            t('My spatial plan brought the projects into the museum’s first- and second-floor exhibition spaces. I worked with the professors and students to move from individual proposals to a shared exhibition, coordinating the venue, display planning and graphic material alongside the course.','我根据美术馆一、二层的场地条件进行展示规划，和教授、同学们一起，把各自的提案组织为一场共同的展览。在课程推进的同时，协调场地、展示安排与平面物料。'),
            t('The three exhibition zones—Mechanics as Living Object, Data as Living Simulation, and Algorithm as a Living System—provided the curatorial structure. Spatial planning, the visitor guide and the zone texts translated that structure into the experience of moving through the exhibition.','「机械生体」「数据拟生」「算法生态」构成展览的三个主题展区。场地规划、导览地图与展区文字，将这一策展结构转化为观众能够进入和阅读的空间。')
          ],
          images:[pic('spatial-plan','Venue and display planning · Spatial plan by CANQI.','场地及展示规划 · CANQI 场地规划设计。')],
          subsections:[{
            id:'living-planning-process',title:t('Making the plan workable','让规划进入制作与布展'),paragraphs:[],imageLayout:'compact-pair',
            images:[pic('journey-12','Working notes for project coordination and exhibition preparation.','项目统筹与布展准备中的工作记录。',false),pic('journey-16','Discussing the display plan with the class.','与同学们讨论场地与展示安排。',false)]
          }]
        },
        {
          id:'living-graphics',title:t('Graphic design & visitor guides','平面设计与展览导览'),
          paragraphs:[t('I designed the exhibition’s graphic material alongside the spatial planning: the folding guide, catalogue and lettering for the three zones. These materials connect the exhibition concept, project information and the visitor’s route.','我在场地规划的同时完成展览平面物料，包括导览折页、导览册与三个展区的刻字。它们将展览概念、作品信息和参观路径连接起来。')],
          imageLayout:'compact-pair',
          images:[pic('leaflet-01','Visitor guide · Final folding leaflet, 30 July.','7 月 30 日导览折页最终版 · 正面。'),pic('leaflet-02','Visitor guide · Exhibition map and project locations.','导览折页 · 展区地图与作品位置。')],
          subsections:[
            {id:'living-catalogue-cover',title:t('Catalogue cover','导览册封面'),paragraphs:[],images:[pic('cover-01','Living Art · Catalogue cover artwork.','「生命艺术」· 导览册封面。')]},
            {id:'living-catalogue',title:t('Inside the catalogue','翻阅导览册'),paragraphs:[t('A compact view of the exhibition catalogue. Browse horizontally using the arrows or swipe.','导览册的小幅浏览版本，可通过左右按钮或横向滑动翻阅。')],gallery:Array.from({length:46},(_,i)=>pic(`booklet-${String(i+1).padStart(2,'0')}`,`Exhibition catalogue · ${String(i+1).padStart(2,'0')} / 46`,`展览导览册 · ${String(i+1).padStart(2,'0')} / 46`,false))},
            {id:'living-lettering',title:t('Three zones in lettering','三个展区的刻字'),paragraphs:[],imageLayout:'triptych',images:[
              pic('lettering-01','Mechanics as Living Object · Zone lettering.','机械生体 · 展区刻字。',false),
              pic('lettering-02','Data as Living Simulation · Zone lettering.','数据拟生 · 展区刻字。',false),
              pic('lettering-03','Algorithm as a Living System · Zone lettering.','算法生态 · 展区刻字。',false)
            ]}
          ]
        },
        {
          id:'living-selected',title:t('Selected / Student projects','Selected / 学生作品精选'),
          paragraphs:[t('Fifteen selected student projects, bringing together exhibition views and project presentations from Living Art. Each work is credited to its student author.','「生命艺术」的 15 个学生项目精选，呈现展览现场与项目设计。每件作品均标注学生作者。')],
          gallery:selected
        },
        {
          id:'living-journey',title:t('A shared journey','共同经历的过程'),
          paragraphs:[t('Alongside the finished works: discussions, making, planning and the people who brought the exhibition together.','在最终作品之外，也留下讨论、制作、规划，以及一起完成展览的人。')],
          gallery:[
            pic('journey-03','CANQI with Krzysztof Wodiczko.','CANQI 与 Krzysztof Wodiczko 教授合影。'),
            pic('journey-08','Working in the museum as the exhibition takes shape.','展览逐步成形中的美术馆工作现场。'),
            pic('journey-09','Students making and testing their projects.','学生制作与测试作品。'),
            pic('journey-11','Fabrication in progress · Building the physical structures.','制作过程 · 搭建作品的实体结构。'),
            pic('journey-07','A class discussion around spatial and exhibition planning.','围绕空间与展陈规划的课堂讨论。'),
            pic('journey-13','A working board connecting themes and project ideas.','连接主题与项目想法的工作板。'),
            pic('journey-05','The teaching team gathered at Living Art.','「生命艺术」教学团队合影。')
          ]
        },
        {
          id:'living-thoughts',title:t('My thoughts','我的感受'),
          quoteSource:t('CANQI · Personal reflection after the summer school. English translation from the original Chinese.','CANQI · 夏校后的个人总结，保留原文。'),
          paragraphs:[
            t('Living Art is a journey.','生命艺术是一段旅程。'),
            t('In this journey, identities shift, ideas revel, complex systems are intervened in, and vitality emerges. Professor Krzysztof spoke about art and life: how they move through real spaces and emotions, allowing us to glimpse those invisible, fleeting bonds and relationships. This is consistent with the process of continuous generation and unfolding that Professor Fei Jun described. It searches, while continually receiving and renewing its form, becoming a new, living basis for an algorithm.','这段旅程里是身份的跃动，是见解的狂欢，是向复杂系统的介入和干预，是活力的涌现。Krzysztof教授说到艺术关于生命，如何在真实的空间和情感中流动，从而能使人洞见那些看不见的、转瞬即逝的绑定和关系。这和费俊教授说的不断生成和展开的过程是一致的，其求索，同时也不断地在接受、更新形态，成为新的、有生命的算法依据。'),
            t('People have habitual ways of thinking, and human-made structures also have inertia as they operate. Within the familiar “nearby,” life flows against entropy. Increasing entropy means eventual decline and dispersal, until all things become still; decay-like decline also occurs within this resistance to entropy.','人有固定的思维惯性，人为的结构在运行的过程同样有惯性。在司空见惯的“附近”中，生命的流向是逆熵的。熵增意味着终有衰亡和消散，最终万物趋于平静；在逆熵中腐朽般的衰亡一样发生。'),
            t('This exhibition touched on many things: large language models, artificial intelligence, cultural history, materials and philosophy, relationships and aesthetics. All pointed towards something; all asked something. I think those subtle changes in feeling, the surprise after the darkest moment, and the gesture that is just right were also speaking to me about these things.','这次展览中提到了种种，无论是谈及大语言模型、人工智能、文化历史、材料和哲学、关系与美学，都皆有所指，皆有所问。我想那些微妙的感受变化、至暗时刻后的惊喜、恰如其分的动作，也无不在向我提及这些。'),
            t('I am often astonished by the overlapping of time and space. Everything old and new gathers in one moment. Feelings that cannot be conveyed through language can always reach me through the process of art.','我时常惊叹时空的交叠，所有的新旧汇集在一刻，不能被语言传达的感受总能在艺术的过程中触及到我。'),
            t('“Quite a journey.”','“Quite a journey.”'),
            t('I hope I can keep witnessing it all, with those new friends and old friends.','希望之后也能一直见证\n那些新朋友、老朋友')
          ]
        }
      ],
      credits:[
        [t('Curator','策展人'),t('Prof. Fei Jun','费俊教授')],
        [t('Exhibition coordination · Spatial & graphic design','展览统筹 · 场地与平面设计'),'CANQI / 燦琪'],
        [t('Invited experts','特邀专家'),'Krzysztof Wodiczko · Kristina Cranfeld · Ruairi Glynn · Kevin Cunningham · James Cao Yuxi'],
        [t('Programme','课程'),'SFK International Art Education / 斯芬克国际艺术教育'],
        [t('Collaborating group','合作团体'),'MOUJITI ART+TECH / 某集体 ART+TECH'],
        [t('Venue','场地'),t('Today Art Museum · Beijing','北京今日美术馆')],
        [t('Student works','学生作品'),t('Credited individually in the selected gallery and exhibition catalogue.','学生作品逐项署名，完整信息见展览导览册。')]
      ],related:[]
    }
  });
})();
