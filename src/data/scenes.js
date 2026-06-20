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
