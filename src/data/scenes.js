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
    { value: "serve", label: "盛茶杯" },
    { value: "brew", label: "候汤" },
  ],
};

const moodSet = {
  dawn: {
    clear: { sky: "#9fb7bd", mist: "#d1d9d4", glow: "#e7c9a7" },
    overcast: { sky: "#879aa0", mist: "#bbc5c2", glow: "#c6c0b5" },
    rain: { sky: "#677b80", mist: "#9eacaa", glow: "#8f9185" },
  },
  day: {
    clear: { sky: "#8eabb3", mist: "#d6dfda", glow: "#efe8d9" },
    overcast: { sky: "#7c8e94", mist: "#bbc6c4", glow: "#c7c3b8" },
    rain: { sky: "#5f7378", mist: "#96a6a6", glow: "#7d8279" },
  },
  dusk: {
    clear: { sky: "#7c8792", mist: "#c8c7b9", glow: "#d8aa82" },
    overcast: { sky: "#69747b", mist: "#aaaea8", glow: "#a99c8d" },
    rain: { sky: "#526064", mist: "#869493", glow: "#706f66" },
  },
  night: {
    clear: { sky: "#2f3b44", mist: "#697678", glow: "#b6a98f" },
    overcast: { sky: "#283137", mist: "#596467", glow: "#8f897c" },
    rain: { sky: "#20282d", mist: "#4f5c60", glow: "#706b63" },
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
