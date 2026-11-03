/* Existing fishbird record. Chinese follows the supplied proposal and artist label;
   English artist statement is reproduced from the label, proposal text is translated.
   Brand quotations remain explicitly attributed to BUZHI TANSUO. */
(()=>{
  const b=(en,zh)=>({en,zh});
  const photo=(asset,en,zh)=>({asset,caption:b(en,zh)});
  window.CANQI_PROJECTS=Object.assign(window.CANQI_PROJECTS||{},{
    fishbird:{
      title:b('Fishbird [Sumeru]','鱼鸟「须弥」'),
      subtitle:b('Sumeru · BUZHI TANSUO','须弥 · 不止探索'),
      year:'2025',hero:'fishbird-hero',
      heroCaption:b('Sumeru at BUZHI TANSUO, 2025. Installation view.','《须弥》在 BUZHI TANSUO 不止探索的现场，2025。'),
      medium:b('Mixed-media installation · exhibition design','混合材料装置 · 展陈设计'),
      summary:b('Sumeru drifts between the cosmos and its quadrants, a living law unto itself.','须弥，是浮游于宇宙与象限之间的法则。'),
      role:b('Installation creation and exhibition design.','装置创作与展陈设计。'),
      sources:['艺术家卡.jpg','探索.pdf:1–6','Done:5 installation photographs','BUZHI TANSUO 26SS.pdf:3–4,111','U:KNFUGDRzB3U'],
      facts:[
        [b('Artist','艺术家'),b('Canqi 燦琪','Canqi 燦琪')],
        [b('Materials','材料'),b('Mixed materials','混合材料')],
        [b('Dimensions','尺寸'),'2 × 1.5 × 2 m'],
        [b('Year','年份'),'2025'],
        [b('Exhibited at','展出空间'),b('BUZHI TANSUO · Xifang Courtyard, Panyu / Dongshankou, Guangzhou','BUZHI TANSUO 不止探索 · 广州番禺西坊大院／东山口')]
      ],
      sections:[
        {
          id:'fishbird-statement',title:b('Sumeru','须弥'),sources:['艺术家卡.jpg'],
          paragraphs:[
            b('Its body is woven from the dreams and shadows of countless beings: sometimes fish, sometimes bird, its bones shifting between deer and ram. It follows only its own rhythm: gathering stardust and dead branches, twisting them into long, searching tentacles that reach across worlds; drawing in the faint grains of the void to shape its ever-changing flesh; carving stray light and wandering air into iridescent scales and translucent wings that let it glide through the abyss.','其形貌交织众生的幻影，身形似鱼似鸟，脉骨似鹿似羊。它遵循自我的法则运行：将途中的星尘枯木席卷，凝结为探知万界的触须；将虚空的微粒物质吸纳，铸就成游离深渊的形体；将流散的光与大气雕琢，化为写意万象的鳞甲与巡弋凌空的蝉翼，伴身随行。'),
            b('Where it passes, sandstorms rise and grass is whipped into the air, leaving the scent of wild earth behind. It swallows the chaos of sky and land ahead, stroking the unknown with its feelers. Then, in the quiet that follows, everything it has taken in is reborn—flowers, grasses, whole galaxies blooming softly across the empty wilderness of space.','它所经之地，萌生风沙卷草，弥散着荒野与沙土气息。它将路前的天地纷繁吸入囊中，用触须摩挲未知的途径。于是，在寂静之后，被包容与重塑的万物，便悄然绽放出了宇宙中的绮丽——化作花草繁星，静静地点缀那辽辽荒川。')
          ]
        },
        {
          id:'fishbird-origin',title:b('Early concept: nomads, textiles and ceramics','前期概念：时代游牧者、织物与陶'),sources:['探索.pdf:1–2'],
          paragraphs:[
            b('When the ancient nomadic spirit enters a contemporary context, ceramics become “fixed coordinates” holding the texture of time. The warmth of glaze and the weight of clay anchor existence, retaining a constant material quality as digital waves change.','当古老的游牧精神坠入当代语境，陶瓷便成了凝着时光肌理的“凝固坐标”——它以釉面的温润、胎土的厚重锚定存在的根基，任数字浪潮更迭仍守着恒定的质感。'),
            b('Textiles and clothing become an “identity skin” that moves with our footsteps across this digital wilderness. The softness of fibres accompanies each change of identity, while changing patterns reflect each passage through information. The movement of textiles and the stillness of ceramics together trace the contemporary nomad’s existence between the virtual and the real.','而织物与服装，则是我们驰骋这片数字原野时，随迁徙步履流转的“身份皮肤”：纤维的柔软贴合着每一次身份切换，纹样的变化映照着每一段信息漫游，织物的动态与陶瓷的静态相生，共同勾勒出当代游牧者在虚拟与现实间的生存轮廓。')
          ],
          gallery:[
            photo('fishbird-concept','Early proposal: “Nomads of the era · textiles and ceramics”. Mood references, not completed project photographs.','前期方案：“时代游牧者／织物与陶”。意象参考，非本项目实拍。'),
            photo('fishbird-objects','Objects considered for the display: ceramics, textiles and plants. Proposal board.','方案中的展陈展品：陶瓷、织物与植物。前期展品资料。')
          ]
        },
        {
          id:'fishbird-space',title:b('A creature moving through the space','游荡于场域的生物'),sources:['探索.pdf:3–4'],
          paragraphs:[
            b('A wandering environmental creature—the main installation—roams within BUZHI TANSUO. Wherever it passes, it leaves elements in plain linen and other materials, carrying qualities of the desert, wasteland and the posthuman. These respond to the exhibition’s themes of “nomadism”, “digital wilderness” and “coordinates”.','一个游荡的环境生物（主体装置），巡游在 BUZHI TANSUO 的场域内。生物走过的环境，都会留下由素亚麻等带着沙漠、废土、后人类特征的元素。回应展览主题的“游牧”“数字原野”“坐标”。'),
            b('Its path becomes a parallel environment: post-digital, where the traces of human modernity disappear and new life emerges.','生物行经之处会变成一个后数字的、人的现代足迹消亡后又诞生新生机的平行环境。')
          ],
          gallery:[
            photo('fishbird-plan','Annotated floor plan: the main installation, surrounding display areas and visitor route.','平面推敲：主体装置、周围环境与展品区、观展动线。'),
            photo('fishbird-sketch','Early spatial sketch: the main creature, suspended objects and ground environment.','前期空间草图：主体生物、悬吊展品与地面环境。')
          ]
        },
        {
          id:'fishbird-materials',title:b('Material and structural studies','材料与结构设想'),sources:['探索.pdf:5–6'],
          paragraphs:[
            b('The proposal uses ground materials to define the overall zones, with small installation structures within them serving as display surfaces.','地面环境材料塑造整体区块。区块内搭建小型装置架构作为展陈台面。')
          ],
          sequence:[
            [b('Ground environment','地面环境'),b('Proposed materials: wool filling, wood-fibre insulation felt, hemp-fibre insulation boards, metal supports and existing display platforms.','方案材料：羊绒内胆、木纤维保温毡、麻纤维保温板、光轴支架／细金属支架／展台（场地物料）。')],
            [b('Suspended display','吊装'),b('Metal cables, acrylic and small exhibits.','金属索、亚克力、小件展品。')],
            [b('Main framework','主体骨架'),b('Metal framework, dry branches (lychee wood) and wire mesh.','金属架构、枯枝树枝（荔枝木）、铁丝网。')],
            [b('Surface','主体表皮'),b('Expanding foam, fibres, cotton and linen, dry branches, and woven or wrapped structures around metal supports.','起泡胶、纤维、棉麻、枯枝、金属支架缠绕编织架构。')]
          ],
          gallery:[
            photo('fishbird-atmosphere','Ground materials and display structures: references collected in the early proposal.','地面材料与小型展陈结构：前期方案收集的参考图。'),
            photo('fishbird-materials','Framework, surface and form studies. Reference works and a concept collage, not installation documentation.','骨架、表皮与形态推敲。参考作品与概念拼贴，非完成装置实拍。')
          ]
        },
        {
          id:'fishbird-installed',title:b('The installed work','现场呈现'),sources:['Done'],paragraphs:[],
          gallery:[
            photo('fishbird-side','Sumeru: full installation and the surrounding display.','《须弥》全貌与周围展陈。'),
            photo('fishbird-hero','Oblique view of the installation in the space.','装置在空间中的斜侧视角。'),
            photo('fishbird-profile','View from the front: the creature and the ground environment.','正向视角：生物形态与地面环境。'),
            photo('fishbird-structure','Branches, framework and the layered surface.','枯枝、骨架与层叠表皮的局部。'),
            photo('fishbird-detail','Close view of the head and mixed materials.','头部与混合材料细节。')
          ]
        },
        {
          id:'fishbird-film',title:b('Project film','项目视频'),sources:['U:KNFUGDRzB3U'],paragraphs:[]
        },
        {
          id:'fishbird-exhibitions',title:b('Exhibition history','展出记录'),sources:['U:2026-10-24 screenshot clarification'],
          paragraphs:[],
          sequence:[
            [b('November 2025 – August 2026','2025.11 — 2026.08'),b('BUZHI TANSUO, Xifang Courtyard, Panyu District, Guangzhou.','广州番禺区西坊大院 · BUZHI TANSUO 不止探索空间。')],
            [b('Subsequent presentation','后续展出'),b('BUZHI TANSUO, Dongshankou, Guangzhou.','广州东山口 · BUZHI TANSUO 不止探索门店空间。')]
          ]
        },
        {
          id:'fishbird-partner',title:b('BUZHI TANSUO / 不止探索','BUZHI TANSUO / 不止探索'),sources:['BUZHI TANSUO 26SS.pdf:3–4,111'],
          paragraphs:[
            b('From the collaborating brand’s statement: “We are an Eastern humanist clothing brand rooted in the fluidity of contemporary life.” The brand describes “contemporary Eastern humanist style” as its foundation and “humanistic minimalism” as its language.','合作品牌自述：“我们是一个根植于当代生活流动性的东方人文服饰品牌。”以“当代东方人文风格”为底色，以“人文极简”为语言。'),
            b('“The present is our starting point. Perception is our measure. Mobile Living State is our philosophy.” — BUZHI TANSUO','“当下”是我们的起点，“感知”是我们的尺度，“可移动的生活状态”是我们的理念。—— BUZHI TANSUO')
          ],
          images:[photo('fishbird-brand-space','BUZHI TANSUO’s Xifang Courtyard space. Brand photograph from the 26SS publication.','BUZHI TANSUO 西坊大院空间店。图源：品牌 26SS 资料。')]
        },
        {
          id:'fishbird-label',title:b('Artist label','艺术家卡'),sources:['艺术家卡.jpg'],paragraphs:[],
          images:[photo('fishbird-label','Original bilingual artist label for Sumeru, 2025.','《须弥》中英文艺术家卡，2025。')]
        }
      ],
      videos:[{provider:'youtube',id:'KNFUGDRzB3U',portrait:true,title:b('Sumeru · project film','须弥 · 项目视频'),poster:'fishbird-profile',section:'fishbird-film'}],
      credits:[
        [b('Artist','艺术家'),b('Canqi 燦琪','Canqi 燦琪')],
        [b('Collaborating brand / exhibition space','合作品牌／展出空间'),'BUZHI TANSUO / 不止探索'],
        [b('Installation build acknowledgements','展陈装置创意搭建鸣谢'),'Lucy · 文婧 · 祁狗']
      ],
      related:['gavel-room','chang']
    }
  });
})();
