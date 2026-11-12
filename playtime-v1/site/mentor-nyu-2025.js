/* August 2025 NYU class: student-authored portfolios and exhibition records. */
(() => {
  const t=(en,zh)=>({en,zh});
  const pic=(name,en,zh)=>({asset:'nyu-'+name,caption:t(en,zh)});
  window.CANQI_PROJECTS=Object.assign(window.CANQI_PROJECTS||{}, {
    'sfk-nyu-2025':{
      branch:'mentor',mentorSection:'mentor-sfk',
      title:t('Multimodal Experiments','多模态实验'),
      subtitle:t('The Dissolution and Reconstruction of Perceptual Boundaries','感知边界的消解与重构'),
      year:'2025',medium:t('Digital media · Installation · Project mentoring','数字媒体 · 装置 · 项目指导'),
      hero:'nyu-cover',
      heroCaption:t('Jiayu Wang · Fishy Table. Installation and moving image at the summer-school exhibition.','王佳裕 ·《鱼席高桌》。夏校展览现场的装置与影像。'),
      summary:t('Six students, six individual projects. In August 2025, I worked with Kevin Cunningham from NYU ITP and artist Cao Yuxi (James) in SFK’s NYU digital media and interaction summer-school class. I mentored a group of six students as they developed their projects for the concluding exhibition, Unbounded.','六位学生，六个独立项目。2025 年 8 月，我在 SFK 的 NYU 数媒交互夏校中，与来自 NYU ITP 的 Kevin Cunningham 及艺术家曹雨西（James）合作，指导六位学生推进各自的创作，并在结营展「无界」中呈现成果。'),
      role:t('My role was group project mentoring: helping students develop their subjects into moving images, installations and spatial experiences. The portfolios record research, narrative development, material and construction experiments, and the completed works. The concepts and works below are credited to their student authors.','我在其中担任小组项目导师，辅导学生将各自的议题转化为影像、装置与空间体验。作品集记录了研究、叙事推演、材料与制作试验，以及最终成果。以下概念与作品均保留学生作者署名。'),
      facts:[
        [t('Programme','课程'),t('SFK · NYU Digital Media & Interaction Summer School','SFK · NYU 数媒交互研究生夏校')],
        [t('Dates','时间'),t('10–19 August 2025','2025 年 8 月 10—19 日')],
        [t('Location','地点'),t('SFK training base, Beijing','北京斯芬克实训基地')],
        [t('Collaborating educators','合作导师'),'Kevin Cunningham · NYU ITP / James Cao Yuxi · 曹雨西'],
        [t('My group','指导小组'),t('6 students · 6 projects','6 位学生 · 6 个项目')],
        [t('Concluding exhibition','结营展览'),t('Unbounded · Lixian Hall','无界：形塑未来的艺术回响 · 礼贤厅')]
      ],
      sections:[
        {
          id:'nyu-course',title:t('Perception, media and participation','感知、媒介与参与'),
          paragraphs:[
            t('The course explored perceptual boundaries through multiple media. Its concluding exhibition, Unbounded, asked how screens might carry emotion and how data might convey warmth. Moving images, sound, objects and spatial interaction invited the audience to participate in the works.','课程围绕多种媒介中的感知边界展开。结营展「无界」追问屏幕如何承载情感、数据能否传递温度，并通过影像、声音、物件与空间互动，让观众参与作品的生成。'),
            t('In their exhibition messages, Cao Yuxi encouraged students to sustain their curiosity about digital media and face technical difficulties without fear. Kevin Cunningham emphasised collaboration, play and experimentation: allowing a work to develop in unexpected directions, while taking time to explore its questions.','在展览寄语中，曹雨西鼓励学生保持对数字媒体的持续热情，以及面对技术困难的勇气。Kevin Cunningham 则强调协作、玩心与实验，让作品向意料之外的方向发展，并为问题的探索留出时间。')
          ],
          authors:t('Course information from the programme poster; exhibition direction and educators’ messages adapted from the exhibition preface.','课程信息据课程海报；展览方向与导师寄语据展览前言整理。'),
          images:[pic('poster','Original SFK course poster · 10–19 August 2025.','SFK 课程原始海报 · 2025 年 8 月 10—19 日。')]
        },
        {
          id:'nyu-mentoring',title:t('Six subjects, six ways of making','六个议题，六种创作路径'),
          paragraphs:[t('Within the group, consumer culture, inner dialogue, family power, memory, social labels and cultural displacement became starting points for six different works. The following records bring their opening spreads, development and outcomes together with the films linked in the students’ portfolios.','小组从消费文化、内在对话、家庭权力、记忆、社交标签与文化异化等不同议题出发，形成六个项目。以下将作品首页、推演过程与成果整理在一起，并接入学生作品集中的影片链接。')],
          sequence:[
            [t('Define a question','明确问题'),t('Connect an individual concern to research, references and a project proposition.','将个人关注与研究、参考材料相连接，形成项目命题。')],
            [t('Translate it into an experience','转化为体验'),t('Develop a relationship between the image, physical materials and the viewer’s position.','推演影像、实体材料与观众位置之间的关系。')],
            [t('Make, test and present','制作、测试与呈现'),t('Bring the work into an exhibition setting, then document its outcomes and further development.','将作品带入展览现场，并记录成果及后续发展。')]
          ]
        },
        {
          id:'nyu-peptide',title:t('Peptide Entrapment','肽阱'),authors:t('Student artist · Xinyi Ling / 凌欣怡','学生作者 · 凌欣怡 / Xinyi Ling'),
          paragraphs:[t('Peptide Entrapment uses the confined life of an ornamental goldfish as a metaphor for consumers caught in marketing narratives. A staged “goldfish thawing experiment” critiques pseudoscientific promotion. Specimens, raw ingredients, screens and packaging turn the installation into a space for questioning how a product acquires authority and value.','《肽阱》以观赏金鱼受限的生存空间，隐喻消费者被营销叙事围困的处境。作品借“金鱼解冻实验”的影像批判伪科学宣传，将标本、原料、屏幕与包装并置，追问商品的权威与价值如何被建构。')],
          gallery:[
            pic('peptide-7','Xinyi Ling · Peptide Entrapment: installation outcomes.','凌欣怡 ·《肽阱》：装置成果。'),
            pic('peptide-1','Xinyi Ling · Original opening spread. Portfolio layout credited to Zeng Lingzhi.','凌欣怡 · 项目原始首页，作品集排版署名：曾令栀。'),
            pic('peptide-5','Xinyi Ling · Fabrication, components and installation development.','凌欣怡 · 制作、构件与装置推演。')
          ]
        },
        {
          id:'nyu-inhabitant',title:t('Co-Inhabitant','共栖者'),authors:t('Student artist · Yulu Song / 宋宇璐','学生作者 · 宋宇璐 / Yulu Song'),
          paragraphs:[t('Co-Inhabitant draws on the artist’s experience of an inner companion, Tulpa. Mirrored moving images and two-channel sound construct a space of dialogue between “me” and “another me”. The work explores distance, coexistence and the shifting boundaries of the self through an intimate encounter with image and voice.','《共栖者》从作者与内在伙伴 Tulpa 共处的体验出发，以镜像影像与双声道声音，构成“我”与“另一个我”对话的空间。观众通过影像与声音的近距离交织，感受距离、共存以及不断变化的自我边界。')],
          gallery:[
            pic('inhabitant-5','Yulu Song · Co-Inhabitant: completed installation.','宋宇璐 ·《共栖者》：最终装置。'),
            pic('inhabitant-1','Yulu Song · Original project opening spread.','宋宇璐 · 项目原始首页。'),
            pic('inhabitant-4','Yulu Song · Spatial design and construction process.','宋宇璐 · 空间设计与搭建过程。')
          ]
        },
        {
          id:'nyu-fish',title:t('Fishy Table','鱼席高桌'),authors:t('Student artist · Jiayu Wang / 王佳裕','学生作者 · 王佳裕 / Jiayu Wang'),
          paragraphs:[t('Fishy Table translates the structure and division of a fish into symbols of power around a family dining table. As the fish turns, struggles and breaks apart in the moving image, the familiar meal reveals unspoken grievances and unequal relationships beneath its appearance of harmony. Table settings, objects and surrounding projection make that tension spatial.','《鱼席高桌》将鱼的身体结构及其分配方式转化为家庭餐桌上的权力符号。影像中的鱼翻转、挣扎并逐渐分解，揭开和睦表象下未被言说的委屈与不对等关系。餐具、物件及环绕的投影，将这种张力转化为具体的空间体验。')],
          gallery:[
            pic('fish-6','Jiayu Wang · Fishy Table: final exhibition views and details.','王佳裕 ·《鱼席高桌》：最终展场与细节。'),
            pic('fish-1','Jiayu Wang · Original project opening spread.','王佳裕 · 项目原始首页。'),
            pic('fish-4','Jiayu Wang · Moving-image storyboard and narrative development.','王佳裕 · 影像分镜与叙事推演。')
          ]
        },
        {
          id:'nyu-memory',title:t('Flash Back','闪回'),authors:t('Student artist · Tianlan Bai / 白添蓝','学生作者 · 白添蓝 / Tianlan Bai'),
          paragraphs:[
            t('Beginning with ruptures in family memory, Flash Back combines point-cloud scans, models of objects and old photographs into changing digital landscapes. Drawing on Pierre Nora’s idea of sites of memory, the work asks how personal experience and collective narratives renegotiate the authenticity of a memory once its material traces become data.','《闪回》从家族记忆的断裂出发，将点云扫描、器物模型与旧照片转化为不断变化的数字景观。作品借鉴皮埃尔·诺拉的“记忆场域”，追问物质痕迹转为数据之后，个人体验与集体叙事如何重新协商记忆的真实性。'),
            t('The summer-school exhibition presented the work on a curved screen. The supplied portfolio also follows its later development under the title Discipline of Memory; the outdoor installation shown here belongs to that subsequent phase.','夏校展览以环形屏呈现该作品。所提供的作品集还以 Discipline of Memory 记录了它的后续发展；这里的户外装置图属于之后的延展阶段。')
          ],
          gallery:[
            pic('memory-4','Tianlan Bai · Digital memory landscapes and the curved-screen exhibition presentation.','白添蓝 · 数字记忆景观与环形屏展览呈现。'),
            pic('memory-2','Tianlan Bai · Research into memory, technology and its reconstruction.','白添蓝 · 关于记忆、技术与重构的研究。'),
            pic('memory-6','Tianlan Bai · Discipline of Memory: subsequent outdoor installation, following the summer school.','白添蓝 · Discipline of Memory：夏校之后延展的户外装置。')
          ],
          links:[{url:'https://www.youtube.com/watch?v=T2wZk6qSwRM',label:t('Additional portfolio video · YouTube','作品集补充影像 · YouTube')}]
        },
        {
          id:'nyu-threads',title:t('Thin Threads','社交压缩'),authors:t('Student artist · Miao Qi / 祁妙','学生作者 · 祁妙 / Miao Qi'),
          paragraphs:[t('Thin Threads considers what disappears when social labels stand in for getting to know a person. MBTI, zodiac signs and other ready-made categories promise immediate understanding, while bypassing the gradual accumulation of experiences and shared memories. Suspended figures, wires and projected images give physical form to these compressed relationships.','《社交压缩》关注以标签代替了解一个人时，我们失去了什么。MBTI、星座等现成分类提供即时判断，却可能省略相处中逐步积累的经历与共同记忆。悬挂的人形、线材与投影，将这些被压缩的关系具象化。')],
          gallery:[
            pic('threads-5','Miao Qi · Thin Threads: final installation and projected images.','祁妙 ·《社交压缩》：最终装置与投影。'),
            pic('threads-1','Miao Qi · Original project opening spread.','祁妙 · 项目原始首页。'),
            pic('threads-4','Miao Qi · Installation structure and production process.','祁妙 · 装置结构与制作过程。')
          ]
        },
        {
          id:'nyu-kluge',title:t('Kluge: Pulsing Echos','克鲁机：跳动遗响'),authors:t('Student artist · Wenjing Fan / 范文婧','学生作者 · 范文婧 / Wenjing Fan'),
          paragraphs:[
            t('A “kluge” is a makeshift structure assembled from disparate parts. Here it becomes a metaphor for cultural practices detached from their original contexts. Taking the Maasai jumping dance as its narrative thread, the film juxtaposes landscape, ritual and tourism. A heartbeat moves from steadiness to disorder, asking what is preserved when a ritual becomes a spectacle.','“Kluge”指由零散元素拼装而成、仍能运作的结构。作品以此隐喻文化实践被剥离原有语境的过程，以马赛跳高舞为叙事线索，将自然、仪式与旅游消费并置，让心跳从稳定转为紊乱，追问仪式成为景观之后，究竟留下了什么。'),
            t('The exhibition record specifies a curved-screen film. The portfolio later develops the subject into a physical installation; its studio documentation is included as a subsequent development, distinct from the summer-school presentation.','展签记录的是环形屏影像。作品集之后将这一议题发展为实体装置，这里保留其棚拍成果作为后续延展，与夏校现场的影像呈现区分。')
          ],
          gallery:[
            pic('kluge-4','Wenjing Fan · Kluge: the experimental film and curved-screen presentation.','范文婧 ·《克鲁机》：实验影像与环形屏呈现。'),
            pic('kluge-3','Wenjing Fan · Film narrative and image development.','范文婧 · 影片叙事与影像推演。'),
            pic('kluge-7','Wenjing Fan · Subsequent physical installation: studio documentation after the summer school.','范文婧 · 夏校之后延展的实体装置：棚拍成果。')
          ],
          links:[{url:'https://www.youtube.com/watch?v=RJ7vIcDZSyY',label:t('Watch the subsequent installation film · YouTube','观看后续实体装置影片 · YouTube')}]
        },
        {
          id:'nyu-exhibition',title:t('Unbounded','无界：形塑未来的艺术回响'),
          paragraphs:[t('The NYU class presented its work in the Media Art area of Lixian Hall. Individual installations and the shared curved screen brought distinct subjects into one exhibition. The preface and plan below record its direction, participants and the relationship between the works in the space.','NYU 班的成果在礼贤厅 Media Art 展区呈现。独立装置与共同使用的环形屏，将不同议题带入同一个展览。以下前言与规划图记录了展览方向、参与者，以及作品在空间中的关系。')],
          images:[
            pic('preface','Unbounded · Exhibition preface, invited artists and participant credits. Curator: Cissi Yin.','「无界」展览前言、特邀艺术家与参与者署名。策展人：尹思朦 Cissi。'),
            pic('plan','Lixian Hall · NYU Media Art exhibition plan, from the shared exhibition planning document.','礼贤厅 · NYU Media Art 展览规划图，选自展览规划文件。')
          ]
        },
        {
          id:'nyu-together',title:t('Learning and making together','一起学习与创作'),paragraphs:[],imageLayout:'compact-pair',
          images:[
            pic('group','Canqi with the group’s students, Kevin Cunningham and Cao Yuxi · Summer school, August 2025.','Canqi 与小组学生、Kevin Cunningham 及曹雨西合照 · 2025 年 8 月夏校。'),
            pic('kevin','Canqi and Kevin Cunningham beside the Unbounded exhibition wall.','Canqi 与 Kevin Cunningham 在「无界」展览前言墙前合照。')
          ]
        }
      ],
      videos:[
        {provider:'youtube',id:'0Rm4PJ9vcaw',section:'nyu-peptide',poster:'nyu-peptide-7',title:t('Peptide Entrapment · Xinyi Ling','《肽阱》· 凌欣怡')},
        {provider:'youtube',id:'intZpdtaVIQ',section:'nyu-inhabitant',poster:'nyu-inhabitant-5',title:t('Co-Inhabitant · Yulu Song','《共栖者》· 宋宇璐')},
        {provider:'youtube',id:'UaRb0FJwKlI',section:'nyu-fish',poster:'nyu-fish-6',title:t('Fishy Table · Jiayu Wang','《鱼席高桌》· 王佳裕')},
        {provider:'youtube',id:'uvkXq3xkfsM',section:'nyu-memory',poster:'nyu-memory-4',title:t('Flash Back · Memory landscape film by Tianlan Bai','《闪回》· 白添蓝记忆景观影像')},
        {provider:'youtube',id:'IfvgAf19yuQ',section:'nyu-threads',poster:'nyu-threads-5',title:t('Thin Threads · Miao Qi','《社交压缩》· 祁妙')},
        {provider:'youtube',id:'o8yF2P-iwG4',section:'nyu-kluge',poster:'nyu-kluge-4',title:t('Kluge · Experimental film by Wenjing Fan','《克鲁机》· 范文婧实验影像')}
      ],
      credits:[
        [t('Programme organiser','课程组织'),t('SFK International Art Education','斯芬克国际艺术教育')],
        [t('Collaborating educators','合作导师'),'Kevin Cunningham · NYU ITP / James Cao Yuxi · 曹雨西'],
        [t('Group project mentor','小组项目导师'),'Canqi Lin / 林燦琪'],
        [t('Student artists','学生作者'),t('Xinyi Ling · Yulu Song · Jiayu Wang · Tianlan Bai · Miao Qi · Wenjing Fan','凌欣怡 · 宋宇璐 · 王佳裕 · 白添蓝 · 祁妙 · 范文婧')],
        [t('Exhibition curator','展览策展人'),t('Cissi Yin','尹思朦 Cissi')],
        [t('Portfolio layouts','作品集排版'),t('Peptide Entrapment: Zeng Lingzhi. The other five supplied portfolios credit Canqi Lin.','《肽阱》：曾令栀；其余五份所提供作品集的排版署名：林燦琪。')]
      ],
      related:['sfk-winter-2026','sfk-living-art']
    }
  });
})();
