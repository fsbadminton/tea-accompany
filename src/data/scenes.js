export const LABELS = {
  weather: { clear: "晴", overcast: "阴", rain: "雨" },
  timeSlot: { dawn: "清晨", day: "白日", dusk: "黄昏", night: "夜晚" },
  perspective: { firstPerson: "第一人称", sideView: "侧坐", topView: "俯看茶席", orbitView: "环视" },
  occupancy: { solo: "独坐一席", duo: "二人对饮", group: "三四人围坐" },
};

export const CONTROL_OPTIONS = {
  timeModes: [
    { value: "auto", label: "自动时间" },
    { value: "manual", label: "手动时间" },
  ],
  timeSlots: [
    { value: "dawn", label: "清晨" },
    { value: "day", label: "白日" },
    { value: "dusk", label: "黄昏" },
    { value: "night", label: "夜晚" },
  ],
  weather: [
    { value: "clear", label: "晴" },
    { value: "overcast", label: "阴" },
    { value: "rain", label: "雨" },
  ],
  occupancy: [
    { value: "solo", label: "独坐" },
    { value: "duo", label: "二人" },
    { value: "group", label: "三四人" },
  ],
  perspectives: [
    { value: "firstPerson", label: "第一人称" },
    { value: "sideView", label: "侧坐" },
    { value: "topView", label: "俯看" },
    { value: "orbitView", label: "环视" },
  ],
  tableStyles: [
    { value: "simple", label: "简席" },
    { value: "full", label: "完整茶席" },
  ],
  gestures: [
    { value: "pour", label: "倒茶" },
    { value: "flipCup", label: "翻杯" },
    { value: "distribute", label: "分茶" },
    { value: "serve", label: "盛茶杯" },
    { value: "brew", label: "候汤" },
    { value: "smell", label: "闻香" },
    { value: "serveGuest", label: "奉茶" },
  ],
};

const moodSet = {
  dawn: {
    clear: { sky: "#f8b888", mist: "#f0dcc0", glow: "#f8d090" },
    overcast: { sky: "#b0a098", mist: "#d8d0c8", glow: "#e0d0b0" },
    rain: { sky: "#809098", mist: "#b0b8b0", glow: "#a0a8a0" },
  },
  day: {
    clear: { sky: "#5ac8e8", mist: "#e0f0e8", glow: "#f8f0d8" },
    overcast: { sky: "#8898a8", mist: "#c8d8d0", glow: "#e0d8c0" },
    rain: { sky: "#6a8898", mist: "#a0b8b0", glow: "#90a090" },
  },
  dusk: {
    clear: { sky: "#f09868", mist: "#e0c8a8", glow: "#f8b878" },
    overcast: { sky: "#908078", mist: "#c0b8b0", glow: "#d0b898" },
    rain: { sky: "#707878", mist: "#a0a8a8", glow: "#909088" },
  },
  night: {
    clear: { sky: "#1a2840", mist: "#506078", glow: "#90a0b0" },
    overcast: { sky: "#1a2535", mist: "#586878", glow: "#808888" },
    rain: { sky: "#142030", mist: "#506068", glow: "#707878" },
  },
};

export const WELCOME_QUOTES = {
  dawn: [
    "晨光初照，茶烟袅袅。",
    "露水未干，一盏清茶唤醒山色。",
    "天边微亮，杯中已温。",
  ],
  day: [
    "日光正好，坐下来喝一杯。",
    "半日闲暇，茶香在指间流转。",
    "窗外天高，杯中水暖。",
  ],
  dusk: [
    "暮色四合，茶汤映着最后一缕天光。",
    "黄昏最适合慢下来，等一壶水开。",
    "天边余温，杯中尚暖。",
  ],
  night: [
    "夜深人静，独坐听雨煮茶。",
    "灯火阑珊处，一壶老茶守长夜。",
    "月光落在杯沿，茶已微凉。",
  ],
};

export const MOOD_QUOTES = {
  lakeside: {
    dawn: "湖面薄雾散去，第一缕光落在茶杯里。",
    day: "远山如黛，湖水如镜，茶在杯中自静。",
    dusk: "夕阳染红了湖面，廊亭下的茶也染上暖意。",
    night: "月色洒满湖面，万籁俱寂，只有壶中水声。",
  },
  courtyard: {
    dawn: "院子里的石板还带着夜露，竹叶在晨风中轻摇。",
    day: "天光从檐角漏下来，落在茶盘上成了碎金。",
    dusk: "雨后的山间小院，空气里都是泥土和竹叶的味道。",
    night: "檐下灯笼微亮，雨滴敲着芭蕉，茶已泡好。",
  },
  tearoom: {
    dawn: "木窗推开一条缝，晨风带着湖面的湿润。",
    day: "阳光透过窗棂，在茶桌上画出安静的格子。",
    dusk: "暮色透过木窗，茶汤映着最后一缕天光。",
    night: "窗外雨声不断，茶室里只有壶嘴的热气和一盏灯。",
  },
};

export const SCENE_CONFIG = [
  {
    id: "lakeside",
    name: "湖畔凉亭",
    palette: ["#8da2a7", "#d8ddd6", "#4f615f"],
    description: "湖边一条安静的走廊，云雾绕过远山。",
    accents: ["流动的水", "远处的山峦", "柔和的天光"],
    moods: moodSet,
  },
  {
    id: "courtyard",
    name: "山间雨院",
    palette: ["#5e6f62", "#b8bba9", "#2e382f"],
    description: "檐下避雨，石板微湿，竹影在雾气里晃动。",
    accents: ["雨丝", "湿石板", "竹影"],
    moods: moodSet,
  },
  {
    id: "tearoom",
    name: "窗边茶室",
    palette: ["#2f2118", "#b08355", "#6c7c75"],
    description: "景在窗中，桌在窗前；雨中湖面被厚木窗框收进室内的安静视野。",
    accents: ["窗中湖景", "窗前长桌", "立体茶具"],
    moods: moodSet,
  },
];

export const CEREMONY_STEPS = [
  {
    id: 'warmCup',
    label: '温杯',
    gesture: null, // no 3D gesture yet, just a step marker
    description: '以热水温润茶器，唤醒瓷器的温度',
    poeticHint: '壶中热水轻旋，瓷器渐暖如玉',
    dependencies: [],
    duration: 4000,
    sceneAdapt: {
      lakeside: '湖风微凉，温杯更需耐心',
      courtyard: '雨后石凉，先暖茶器',
      tearoom: '窗边微寒，先以热水暖器',
    },
    weatherAdapt: { clear: 3500, overcast: 4000, rain: 4500 },
    occupancyAdapt: { solo: '温一只杯即可', duo: '温两只杯', group: '依次温杯，不急不躁' },
  },
  {
    id: 'appreciateTea',
    label: '赏茶',
    gesture: null,
    description: '观茶叶形色，闻干茶香气',
    poeticHint: '茶叶舒展于掌心，山野气息扑面而来',
    dependencies: ['warmCup'],
    duration: 3000,
    sceneAdapt: {
      lakeside: '湖光映照下，茶叶色泽更显清透',
      courtyard: '竹影斑驳间，细赏茶形',
      tearoom: '窗光正好，看清每一片叶子的纹理',
    },
    weatherAdapt: { clear: 2500, overcast: 3000, rain: 3500 },
    occupancyAdapt: { solo: '独自细赏', duo: '与对坐者共赏', group: '传递茶罐，逐一赏茶' },
  },
  {
    id: 'rinseTea',
    label: '洗茶',
    gesture: 'pour',
    description: '快冲快出，唤醒沉睡的茶叶',
    poeticHint: '水入壶中，茶叶初醒，第一道水不饮',
    dependencies: ['appreciateTea'],
    duration: 3000,
    sceneAdapt: {
      lakeside: '取湖边活水，洗茶更添野趣',
      courtyard: '檐下雨声伴着洗茶声',
      tearoom: '静室之中，水声格外清脆',
    },
    weatherAdapt: { clear: 2500, overcast: 3000, rain: 3500 },
    occupancyAdapt: { solo: '简洗即可', duo: '轻洗一遍', group: '认真洗茶，以示敬意' },
  },
  {
    id: 'brew',
    label: '泡茶',
    gesture: 'brew',
    description: '悬壶高冲，让热水与茶叶充分交融',
    poeticHint: '水柱如丝，茶叶在壶中翻腾起舞',
    dependencies: ['rinseTea'],
    duration: 5000,
    sceneAdapt: {
      lakeside: '山泉水温度正好，泡出茶的真味',
      courtyard: '雨声如鼓，泡茶如吟',
      tearoom: '窗边静泡，时光慢了下来',
    },
    weatherAdapt: { clear: 4000, overcast: 5000, rain: 6000 },
    occupancyAdapt: { solo: '慢泡细品', duo: '泡一壶好茶', group: '好茶需耐心等待' },
  },
  {
    id: 'pourOut',
    label: '出汤',
    gesture: 'pour',
    description: '将茶汤从壶中倾入公道杯，均匀茶汤浓度',
    poeticHint: '金黄茶汤如绸缎般流入公道杯',
    dependencies: ['brew'],
    duration: 3500,
    sceneAdapt: {
      lakeside: '对湖出汤，茶香随风散去',
      courtyard: '雨雾中出汤，汤色更显金亮',
      tearoom: '窗前出汤，光线穿透茶汤',
    },
    weatherAdapt: { clear: 3000, overcast: 3500, rain: 4000 },
    occupancyAdapt: { solo: '出汤即饮', duo: '出汤待分', group: '出汤要快，以免过浓' },
  },
  {
    id: 'distribute',
    label: '分茶',
    gesture: 'distribute',
    description: '关公巡城，均匀分入每只杯中',
    poeticHint: '茶汤在杯间游走，如关公巡城般公正',
    dependencies: ['pourOut'],
    duration: 4000,
    sceneAdapt: {
      lakeside: '凉亭之下，分茶待风来',
      courtyard: '石桌上分茶，竹影为伴',
      tearoom: '案前分茶，窗外风景如画',
    },
    weatherAdapt: { clear: 3500, overcast: 4000, rain: 4500 },
    occupancyAdapt: { solo: '分两杯，一杯稍满', duo: '均分两杯', group: '每杯七分满，留三分人情' },
  },
  {
    id: 'smell',
    label: '闻香',
    gesture: 'smell',
    description: '端杯近鼻，感受茶香的层次变化',
    poeticHint: '杯中热气升腾，花香、果香、蜜香层层递进',
    dependencies: ['distribute'],
    duration: 4000,
    sceneAdapt: {
      lakeside: '湖风送来远处花香，与茶香交织',
      courtyard: '雨后泥土芬芳混着茶香',
      tearoom: '静室聚香，茶香更显浓郁',
    },
    weatherAdapt: { clear: 3500, overcast: 4000, rain: 4500 },
    occupancyAdapt: { solo: '闭目闻香', duo: '相视而笑，各自闻香', group: '传递闻香，共享茶韵' },
  },
  {
    id: 'taste',
    label: '品茗',
    gesture: 'serve',
    description: '小口啜饮，让茶汤在口中回旋',
    poeticHint: '茶汤入喉，回甘生津，唇齿留香',
    dependencies: ['smell'],
    duration: 5000,
    sceneAdapt: {
      lakeside: '面湖品茗，心旷神怡',
      courtyard: '听雨品茶，禅意自生',
      tearoom: '窗前独品，一盏茶一段时光',
    },
    weatherAdapt: { clear: 4000, overcast: 5000, rain: 6000 },
    occupancyAdapt: { solo: '慢品三口', duo: '举杯示意，各自品味', group: '品后交流感受' },
  },
  {
    id: 'serveGuest',
    label: '奉茶',
    gesture: 'serveGuest',
    description: '双手奉茶，以礼待客',
    poeticHint: '双手捧杯，恭敬奉上，一盏茶承载一份心意',
    dependencies: ['taste'],
    duration: 3500,
    sceneAdapt: {
      lakeside: '凉亭奉茶，清风为礼',
      courtyard: '雨中奉茶，温情更暖',
      tearoom: '敬奉窗前，茶与景共赠',
    },
    weatherAdapt: { clear: 3000, overcast: 3500, rain: 4000 },
    occupancyAdapt: { solo: null, duo: '双手奉茶', group: '依次奉茶，每杯七分满' },
  },
  {
    id: 'appreciateAfter',
    label: '回味',
    gesture: null,
    description: '静坐回味，感受茶韵余香',
    poeticHint: '茶已尽，韵犹存，山高水长',
    dependencies: ['serveGuest'],
    duration: 4000,
    sceneAdapt: {
      lakeside: '望湖回味，山水入心',
      courtyard: '听雨回味，禅茶一味',
      tearoom: '窗前回味，一壶茶一段故事',
    },
    weatherAdapt: { clear: 3500, overcast: 4000, rain: 4500 },
    occupancyAdapt: { solo: '独坐回味', duo: '相视微笑', group: '各自回味，不需多言' },
  },
];

export const GESTURE_DESCRIPTIONS = {
  pour: {
    title: '倒茶',
    description: '将壶中茶汤缓缓倒入公道杯，手腕轻转，水柱如丝',
    duration: '约 3 秒',
  },
  flipCup: {
    title: '翻杯',
    description: '将倒扣的品茗杯轻轻翻正，准备迎接茶汤',
    duration: '约 2 秒',
  },
  distribute: {
    title: '分茶',
    description: '关公巡城——茶汤在杯间均匀流转，每杯七分满',
    duration: '约 4 秒',
  },
  serve: {
    title: '盛茶杯',
    description: '端起品茗杯，感受杯壁的温度',
    duration: '约 2 秒',
  },
  brew: {
    title: '候汤',
    description: '悬壶高冲，等待茶叶在热水中舒展、沉浮',
    duration: '约 5 秒',
  },
  smell: {
    title: '闻香',
    description: '端杯近鼻，花香、果香、蜜香层层递进',
    duration: '约 3 秒',
  },
  serveGuest: {
    title: '奉茶',
    description: '双手捧杯，恭敬奉上，一盏茶承载一份心意',
    duration: '约 3 秒',
  },
};

export const CEREMONY_CONFIG = {
  autoPlayInterval: 1500, // ms between steps in auto mode
  transitionDuration: 800, // ms for step transition animation
  skipDependencies: false, // whether to enforce step order
};

export const GESTURE_UI_CONFIG = {
  pour: {
    guestStateLabel: { solo: '', duo: '宾客：正饮', group: '众人品饮' },
    hidePanelInFirstPerson: true,
    description: '右手握壶把，食指轻按壶盖，提壶倾倒',
  },
  flipCup: {
    guestStateLabel: { solo: '', duo: '宾客：静候', group: '众人静候' },
    hidePanelInFirstPerson: true,
    description: '三指托杯，轻柔翻转',
  },
  distribute: {
    guestStateLabel: { solo: '', duo: '宾客：正饮', group: '众人品饮' },
    hidePanelInFirstPerson: true,
    description: '关公巡城，均匀分茶',
  },
  serve: {
    guestStateLabel: { solo: '', duo: '宾客：正饮', group: '众人品饮' },
    hidePanelInFirstPerson: true,
    description: '端起品茗杯，感受温度',
  },
  brew: {
    guestStateLabel: { solo: '', duo: '宾客：静候', group: '众人静候' },
    hidePanelInFirstPerson: false,
    description: '悬壶高冲，静候茶香',
  },
  smell: {
    guestStateLabel: { solo: '', duo: '宾客：闻香', group: '众人闻香' },
    hidePanelInFirstPerson: true,
    description: '端杯近鼻，感受香气层次',
  },
  serveGuest: {
    guestStateLabel: { solo: '', duo: '宾客：承接', group: '众人承接' },
    hidePanelInFirstPerson: true,
    description: '双手奉茶，以礼待客',
  },
};

export const PERSPECTIVE_UI_MODE = {
  firstPerson: { topBarCompact: false, dockAutoHide: true, ambientFull: true },
  sideView: { topBarCompact: true, dockAutoHide: false, ambientFull: true },
  orbitView: { topBarCompact: true, dockAutoHide: false, ambientFull: true },
  topView: { topBarCompact: true, dockAutoHide: false, ambientFull: false },
};
