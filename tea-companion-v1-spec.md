# Tea Companion Web V1

## Product Direction

这是一个陪伴用户喝茶的沉浸式网页，不强调复杂玩法，而强调安静、治愈、可长期停留的氛围。

核心关键词：

- 极简禅意
- 治愈感
- 陪伴感
- 可切换场景
- 轻交互

## Confirmed Decisions

### Visual Style

- 整体风格：极简禅意 + 治愈感
- 配色策略：不同场景使用不同主色
- 人物表现：简化剪影
- 茶席风格：支持简席 / 完整茶席切换

### Scene Library

第一版包含 3 个场景：

- 湖边廊亭
- 雨天山间小院
- 原木茶室窗边

### Time And Weather

- 支持真实时间同步
- 支持手动切换时间
- 支持天气：晴 / 阴 / 雨

### Perspective And Presence

- 第一人称主位
- 侧面观景视角
- 俯视茶席视角
- 环绕观察视角

### Character Logic

- 单人模式：主位第一人称，人物手部只在动作中出现
- 多人模式：2-4 人，其他角色为简剪影，并自动安排到合理席位

### Audio

- 第一版包含可开关环境音

## V1 Experience Goals

用户打开网页后，应能快速进入一个可停留的喝茶氛围中：

- 能自由切换不同风景和天气
- 能选择独处喝茶或多人共饮
- 能从不同视角观察茶席与风景
- 能感受到时间流动、天气变化和轻微动态
- 能在不被复杂 UI 打扰的前提下完成设置

## Page Structure

## 1. Main Immersive Stage

页面主体为全屏沉浸式场景：

- 背景层：天空、山、水、庭院、窗外景色
- 中景层：栏杆、檐角、窗框、竹木、远近景装饰
- 前景层：茶桌、茶盘、茶具、坐席、人物
- 氛围层：雨丝、云影、水波、热气、光影变化

## 2. Minimal Top Navigation

顶部仅保留低干扰入口：

- 场景切换
- 时间模式
- 天气切换
- 人数设置
- 视角切换

## 3. Floating Control Panel

右下角或左下角放轻量控制面板：

- 环境音开关
- 自动时间开关
- 简席 / 完整茶席切换
- 轻交互入口

## 4. Optional Ambient Info

可选的弱提示信息：

- 当前场景名称
- 当前时间段
- 当前天气
- 当前人数模式

默认应弱化，不喧宾夺主。

## V1 Functional Checklist

## A. Scene System

- 场景切换：湖边廊亭 / 雨天山间小院 / 原木茶室窗边
- 每个场景有独立配色和环境细节
- 切换场景时有柔和过渡动画

## B. Time System

- 自动同步用户本地时间
- 手动切换清晨 / 白天 / 黄昏 / 夜晚
- 光线、天空、阴影随时间变化

## C. Weather System

- 支持晴 / 阴 / 雨
- 雨天至少包含可见雨丝、地面湿润感或窗外雨景
- 阴天和晴天需要有明显光感差异

## D. Perspective System

- 第一人称主位
- 侧面观景
- 俯视茶席
- 环绕观察

## E. Character System

- 1 人模式
- 2-4 人模式
- 多人时自动安排座位
- 单人模式中不常驻显示人物，仅在动作时展示手部

## F. Tea Table System

- 简席模式
- 完整茶席模式
- 第一版使用通用占位茶具
- 后续可替换为用户专属茶盘和茶具

## G. Ambient Motion

- 水波
- 云层或光影缓动
- 植物轻微摆动
- 热气
- 雨丝

## H. Audio System

- 环境音开关
- 根据场景加载对应音效
- 根据天气叠加雨声或风声

## I. Light Interaction

第一版只做低门槛轻交互：

- 倒茶动作
- 拿杯动作
- 简单出汤动画

## Scene Art Direction

## 1. 湖边廊亭

气质：

- 通透
- 安静
- 适合清晨与黄昏

视觉元素：

- 湖面微波
- 远山层次
- 木亭栏杆
- 缓慢云层

推荐主色：

- 水青
- 淡灰蓝
- 木色

## 2. 雨天山间小院

气质：

- 潮湿
- 内敛
- 最有陪伴感

视觉元素：

- 檐下雨丝
- 青石地面
- 竹木或山石
- 雾感远景

推荐主色：

- 雨墨灰
- 竹青
- 深木色

## 3. 原木茶室窗边

气质：

- 温暖
- 安稳
- 最适合长时间停留

视觉元素：

- 原木桌面
- 大窗取景
- 柔光
- 窗外四时变化

推荐主色：

- 原木棕
- 米白
- 茶色

## Seat Layout Logic

### Single User

- 默认主位第一人称
- 茶桌位于视野前方
- 手部仅在交互时出现

### Multi User

2-4 人时按茶桌逻辑安排：

- 主位
- 对坐位
- 左陪位
- 右陪位

人物只做剪影，不抢夺场景主导权。

## Component Breakdown

建议前端按以下组件拆分：

- `AppShell`
- `SceneStage`
- `SceneSwitcher`
- `TimeController`
- `WeatherController`
- `PerspectiveController`
- `OccupancyController`
- `TeaTable`
- `TeaSet`
- `SeatLayout`
- `CharacterSilhouettes`
- `HandActionLayer`
- `AmbientAudio`
- `EnvironmentEffects`
- `MinimalHUD`

## Recommended Tech Stack

第一版建议：

- `React`
- `Vite`
- `Three.js`
- `React Three Fiber`
- `drei`
- `zustand`
- `Framer Motion` 或轻量动画方案

原因：

- 适合构建沉浸式 3D 场景
- 后续容易扩展视角、人物、天气和自定义茶具
- 前端状态管理清晰

## Suggested Milestones

## Milestone 1

搭建基础工程和全屏沉浸式容器：

- 初始化项目
- 建立场景框架
- 放入基础 UI

## Milestone 2

完成 3 个基础场景切换：

- 湖边廊亭
- 雨天山间小院
- 原木茶室窗边

## Milestone 3

接入时间、天气、视角切换：

- 自动时间
- 手动时间
- 晴阴雨
- 4 种镜头

## Milestone 4

接入人数和座位系统：

- 单人模式
- 2-4 人模式
- 自动排座

## Milestone 5

补充轻交互和环境音：

- 倒茶
- 拿杯
- 热气
- 雨声和风声

## Milestone 6

替换专属茶具素材：

- 根据用户实拍图抽象茶盘
- 根据用户实拍图抽象茶具

## Open Items For Next Round

后续还需要继续确认的内容：

- 第一版是否优先做 2D 风格化，还是直接做 3D 沉浸版
- 页面字体气质选择
- 茶席比例与桌面构图
- 倒茶动作的节奏和触发方式
- 用户专属茶具的抽象程度

