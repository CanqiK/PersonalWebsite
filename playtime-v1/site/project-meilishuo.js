/* Existing project: meilishuo. Copy condensed from Canqi's supplied statement,
   concept documents and brand materials; English translates the same account.
   The reported traffic figure describes the fair as a whole, not booth visitors. */
(() => {
  const b = (en, zh) => ({en, zh});
  const photo = (name, en, zh) => ({asset: `meilishuo-${name}`, caption: b(en, zh)});
  window.CANQI_PROJECTS = Object.assign(window.CANQI_PROJECTS || {}, {
    meilishuo: {
      title: b('Floral Leather World', '群花'),
      subtitle: b('MEILISHUO · Canton Fair', 'MEILISHUO 美丽说 · 广交会'),
      year: '2026',
      hero: 'meilishuo-hero',
      heroCaption: b('Leather flowers and product displays at the MEILISHUO booth, 140th Canton Fair.', '第 140 届广交会，MEILISHUO「群花」展厅中的皮革装置与产品陈列。'),
      medium: b('Installation · spatial storytelling · brand design', '装置艺术 · 空间叙事 · 品牌设计'),
      summary: b('From artistic installation to brand storytelling: exploring how art can shape a commercial space.', '从装置艺术到品牌叙事：艺术如何赋能商业空间。'),
      role: b('Installation and spatial design, with brand design, visual communication and marketing planning.', '装置与空间设计，并参与品牌设计、视觉传播与营销策划。'),
      sources: ['Canqi: project statement and clarifications, November 2026', '群花 美丽说广交会展厅意向概念.pdf', '美丽说群花展厅设计说明.pdf', 'MEILISHUO_品牌手册2026.pdf', '邀请函.png'],
      facts: [
        [b('Client', '合作品牌'), 'MEILISHUO / 美丽说'],
        [b('Event', '展会'), b('140th Canton Fair · Phase 3', '第 140 届广交会 · 第三期')],
        [b('Exhibition dates', '展期'), '2026.10.31 — 11.04'],
        [b('Location', '地点'), b('China Import and Export Fair Complex, Guangzhou · Area A · 3AP14–3AP15', '广州 · 中国进出口商品交易会展馆 · A 区 · 3AP14–3AP15')]
      ],
      sections: [
        {
          id: 'meilishuo-concept', title: b('From material to brand experience', '从材料到品牌空间'),
          paragraphs: [
            b('I created the Canton Fair booth for leather brand MEILISHUO, bringing installation art, spatial storytelling and brand strategy into one project. Working from a business rooted in leather supply, I wanted to make the material itself a medium for space, culture and narrative, extending the display of products into a complete brand experience.', '我为皮革品牌 MEILISHUO（美丽说）打造广交会展厅，将装置艺术、空间叙事与品牌策略结合。从以皮革供应为核心的业务出发，我希望让材料本身成为构成空间、承载文化与生成叙事的媒介，将产品陈列延展为完整的品牌体验。'),
            b('The concept of “Floral Leather World” is an ecosystem made of leather: an ecology of life and of products. Flowers give form to the material’s capacity for change, while the idea of fallen petals becoming new soil carries the possibility of renewal. “Understanding through materials”, “flowers that continue”, “born beautiful” and “beauty in coexistence” connect the installation to the brand’s language.', '「群花」是一个由皮革组成的生态系统，既是生命生态，也是产品生态。花的形态呈现材料的变化与生命力，落红成为新生土壤的意象，则延续了循环与再创造的构想。“革物致知、群花可续、生而美丽、美美与共”，共同连接装置的表达与品牌的语言。')
          ],
          images: [photo('booth', 'The completed booth within the Canton Fair exhibition environment.', '「群花」展厅全景及其所在的广交会展馆环境。')]
        },
        {
          id: 'meilishuo-process', title: b('From sketch to floral world', '从手绘到花境'),
          paragraphs: [
            b('Hand sketches established the heights of the flowers, the wall openings and the relationship between objects and visitors. Spatial models, AIGC visual studies and artisan craft developed the proposal towards its built form. The “Dunhuang · Cinnabar Flower Garden” palette brings terracotta, mineral blue-green and earthy yellow into a contemporary material setting, translating traditional Chinese imagery into a brand environment.', '手绘先确定花群的高低、墙面开口，以及展品与人的观看关系，再通过空间模型、AIGC 视觉实验与匠人工艺逐步落地。“敦煌·丹砂花境”的配色研究，将赭红、矿青与土黄带入当代材料与空间，把中国传统文化的美学意象转译为品牌语言。')
          ],
          images: [
            photo('installation-sketch', 'Canqi’s sketch of the flower installations and their surroundings.', '花装置及环境手绘：花群高度与展品关系。')
          ],
          gallery: [
            photo('render', 'Design visualisation of the proposed booth.', '展厅方案效果图。'),
            photo('plan-sketch', 'Plan and hand-drawn composition studies, extracted from the original design sheet.', '平面与手绘构图推敲，节选自原始设计稿。'),
            photo('elevation-sketch', 'Elevation studies of the installation and its scale in relation to visitors.', '装置立面与人体尺度推敲，节选自原始设计稿。')
          ]
        },
        {
          id: 'meilishuo-colour', title: b('Dunhuang · Cinnabar Flower Garden', '敦煌 · 丹砂花境'),
          paragraphs: [
            b('The palette draws on the Nine-Coloured Deer mural in Mogao Cave 257. Terracotta anchors the main flowers, mineral blue-green creates a contrast, and earthy yellow supplies scattered accents; pale ivory is used sparingly. Muted green and sand-brown foliage support the flowers. Matte, finely textured leaves sit against the soft sheen of leather petals.', '配色参考莫高窟第 257 窟《九色鹿王本生》壁画。赭红统一主花色相，矿青建立对比，土黄分散点亮，粉壁白只保留少量亮点。灰石绿与沙棕衬托花群；草叶细纹哑光，花瓣保留柔和的皮革光泽。')
          ],
          images: [{...photo('mural', 'Detail of the Nine-Coloured Deer mural, Mogao Cave 257, Northern Wei. Image: Dunhuang Academy; reference from the original colour study.', '北魏 · 莫高窟第 257 窟《九色鹿王本生》壁画局部。图源：敦煌研究院，沿用原配色研究中的参考图。'), zoom:false}],
          palette: {
            groups: [
              {title:b('Foliage · supporting colours','草叶 · 衬托色'), share:b('About 40% of the composition','约占整体植物色块 40%'), colours:[
                {name:b('Muted green','灰石绿'),hex:'#718B78',ratio:'70%',pantone:'16-5807'},
                {name:b('Sand brown','沙棕'),hex:'#9C866B',ratio:'30%',pantone:'17-1316'}
              ]},
              {title:b('Flowers · focal colours','花朵 · 主体色'), share:b('About 60% of the composition','约占整体植物色块 60%'), colours:[
                {name:b('Terracotta','赭红'),hex:'#A6533F',ratio:'45%',pantone:'18-1441'},
                {name:b('Mineral teal','矿青'),hex:'#568F8B',ratio:'25%',pantone:'17-4919'},
                {name:b('Earth yellow','土黄'),hex:'#C99E57',ratio:'20%',pantone:'15-1142'},
                {name:b('Pale ivory','粉壁白'),hex:'#E4D5C2',ratio:'10%',pantone:'12-0703'}
              ]}
            ],
            note:b('Percentages describe the distribution within each group, estimated from visible plant surfaces. HEX values are design targets; Pantone TPG references are approximate suggestions, not verified matches. Final samples are checked against physical colour cards, leather texture and warm exhibition lighting.', '色块下方比例为各组内部配比，按正面可见植物色块面积估算。HEX 为设计目标色；Pantone TPG 为近似选色建议，并非已校准色值。打样结合实体色卡、皮革纹理与现场暖光复核。')
          },
          gallery: [photo('colour-render', 'AIGC-assisted colour visualisation: the proposed relationship between terracotta flowers, mineral teal and supporting foliage.', 'AIGC 配色效果示意：赭红、矿青花群与草叶衬托色的整体关系。')]
        },
        {
          id: 'meilishuo-canton-fair', title: b('The Canton Fair', '关于广交会'),
          paragraphs: [
            b('Established in 1957, the China Import and Export Fair—known as the Canton Fair—is held in Guangzhou every spring and autumn. Co-hosted by China’s Ministry of Commerce and the People’s Government of Guangdong Province and organised by the China Foreign Trade Centre, it is China’s longest-running comprehensive international trade fair and a major meeting place for manufacturers and buyers from around the world.', '中国进出口商品交易会，简称广交会，创办于 1957 年，每年春秋两季在广州举办，由商务部和广东省人民政府共同主办、中国对外贸易中心承办。它是中国历史最悠久的综合性国际贸易展会，也是中国制造与全球采购商直接交流的重要平台。'),
            b('For this project, that setting matters: installation art and spatial storytelling meet people who make, source and build brands. The booth brings an artistic approach to leather into the everyday conversations of international trade.', '对这个项目而言，广交会的重要性在于：装置艺术与空间叙事直接面对制造商、采购商和品牌主理人，让皮革的艺术表达进入国际贸易现场的真实交流。')
          ],
          links:[{url:'https://www.cantonfair.org.cn/about?pageCode=6beadc88321446bab2e463f551adbbf4',label:b('About the Canton Fair · official website','广交会简介 · 官方网站')}]
        },
        {
          id: 'meilishuo-installed', title: b('At the Canton Fair', '广交会现场'),
          paragraphs: [
            b('The installation was realised at the Canton Fair, where manufacturers, brands and international buyers meet. Leather flowers, display structures and products share one setting: material, craft and use can be read together, beyond the sample alone.', '项目最终落地于广交会，进入制造商、品牌与国际采购商交流的现场。皮革花群、陈列结构与展品共同构成空间，让材料的触感、工艺和应用被一起看见，将展示从样品本身延展到品牌体验。')
          ],
          images: [photo('flowers', 'The central flower installation with integrated product displays.', '中央花群与融入装置的产品展示。')],
          gallery: [
            photo('side', 'Side view of the flowers and the wall opening.', '侧向观看花群与墙面开口。'),
            photo('terracotta', 'Terracotta leather petals and stamens.', '赭红皮革花瓣与花蕊细节。'),
            photo('teal', 'Folded layers of a blue-green leather flower.', '青色皮革花朵的折叠与层次。'),
            photo('yellow', 'Curled yellow leather at the centre of a flower.', '黄色皮革花蕊的卷曲形态。'),
            photo('bags', 'Brand products displayed alongside leather petals.', '品牌展品与皮革花瓣共同构成陈列。'),
            photo('woven-display', 'A bag supported by a woven display structure.', '包袋与编织展示结构的组合。'),
            photo('shoe', 'A product displayed within the floral installation.', '融入花形装置的产品展示。'),
            photo('object', 'A leather object on an individual display platform.', '独立展台上的皮革创意物件。')
          ]
        },
        {
          id: 'meilishuo-communication', title: b('Visual communication & encounters', '视觉传播与现场交流'),
          paragraphs: [
            b('The spatial concept extended into the invitation poster, visual communication and on-site marketing. According to project feedback, the booth received a positive response and opened new commercial connections, bringing the conversation about materials into one about design, culture and brand identity.', '空间概念也延展到邀请海报、视觉传播与现场营销。据项目反馈，展厅获得了积极回应，并带来新的商业连接，让关于材料的交流进一步进入设计、文化与品牌身份的讨论。'),
            b('The project team reports approximately 200,000 daily visits across the fair as a whole, providing a context for potential exposure; this is not a measured audience figure for this booth.', '据项目方提供的口径，展会整体日人流约 20 万人次，为现场展示提供潜在触达机会；这一数字并非本展厅的实测到访或曝光人数。')
          ],
          imageLayout: 'compact-pair',
          images: [
            photo('invitation', 'MEILISHUO invitation poster for the 140th Canton Fair.', 'MEILISHUO「群花」第 140 届广交会邀请海报。'),
            photo('touch', 'A visitor feels the leather surface of a flower.', '观众近距离触摸皮革花瓣。')
          ],
          columnSections: [
            {
              id: 'meilishuo-visitors', title: b('Visitors & encounters', '现场来访'),
              paragraphs: [b('Visitors encounter the leather flowers through photographs, touch and conversation.', '来访者在花群中留影、触摸材料、展开交流。')],
              gallery: [
                photo('visitors-08', 'An adult and child pose together among the leather flowers.', '来访者与小朋友在皮革花群中合影。'),
                photo('visitors-01', 'The MEILISHUO owner with a visitor among the leather flowers.', '美丽说老板与来访者在皮革花群中合影。'),
                photo('visitors-05', 'A group photograph beside the floral display.', '来访者在花群与产品陈列前合照。'),
                photo('visitors-02', 'The MEILISHUO owner and a visitor at the booth.', '美丽说老板与来访者于展厅留影。'),
                photo('visitors-03', 'Visitors photographed beside the floral display.', '来访者与花群陈列留影。'),
                photo('visitors-04', 'A visitor beside the central leather installation.', '来访者在中央皮革装置旁留影。'),
                photo('visitors-06', 'A visitor with a displayed leather object.', '来访者拿取皮革展品留影。'),
                photo('visitors-07', 'A young visitor beneath the oversized leather flowers.', '小朋友站在大尺度皮革花朵之间。'),
                photo('encounter', 'A close encounter with the material and the displayed object.', '近距离拿取与观看展陈物件。')
              ]
            },
            {
              id: 'meilishuo-collaborators', title: b('Canqi & collaborators', '我与合作方'),
              paragraphs: [b('Canqi with the brand owner and guests at the completed booth.', '展厅落地后，我与品牌老板及现场嘉宾的合照。')],
              gallery: [
                photo('canqi-owner', 'Canqi with the MEILISHUO owner and a guest at the booth.', 'Canqi 与美丽说老板及嘉宾于「群花」展厅合照。'),
                photo('canqi', 'Canqi with a Canton Fair senior representative and a buyer at the booth.', 'Canqi 与广交会高层及采购商于「群花」展厅。')
              ]
            }
          ]
        },
        {
          id: 'meilishuo-thoughts', title: b('My thoughts', '我的思考'),
          quoteSource: b('Canqi · on Floral Leather World', 'Canqi · 关于「群花」'),
          paragraphs: [
            b('I wanted to explore how art can help a brand establish an identity, communicate its values and create commercial connections. For me, this project brought installation art and spatial storytelling into the real setting of manufacturing and international trade.', '我希望探索的不仅是如何设计一个展厅，而是如何让艺术成为品牌建立身份、传递价值与创造商业连接的媒介。「群花」让装置艺术与空间叙事真正进入了制造业和国际贸易的现场。'),
            b('What matters to me goes beyond traffic and new contacts. It is that brand founders, manufacturers and commercial decision-makers can begin to see what artistic design contributes to a brand’s development. Art can take part in shaping identity and changing how a product is understood, connecting cultural expression with commercial value.', '对我而言，更重要的成果不只是流量与商业连接，而是让品牌主理人、制造商与商业决策者开始看见艺术设计在品牌升级中的价值。艺术能够参与品牌身份的建构，改变产品被理解的方式，并在文化表达与商业价值之间建立联系。'),
            b('Three days for the proposal, three weeks to bring it to life. Installation design → spatial storytelling; AIGC × artisan craft. This is a space made of leather, and a real exploration of how an artistic idea can grow into brand influence and commercial value.', '3 天方案，3 周落地。装置设计 → 空间叙事，AIGC × 匠人工艺。这是一个由皮革打造的空间，也是一次关于艺术理念如何转化为品牌影响力与商业价值的真实探索。')
          ]
        }
      ],
      related: ['fishbird', 'chang']
    }
  });
})();
