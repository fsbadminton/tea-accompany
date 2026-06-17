# Tea Company

一个安静陪伴喝茶的 Web 场景应用。当前重点是窗边茶室：真实 3D 窗框、茶桌、茶盘、茶具，以及可切换时间、天气、视角和沉浸观察模式。

## 功能概览

- 窗边茶室、湖畔凉亭、山间雨院三种场景入口
- 支持晴、阴、雨天气切换
- 支持自动时间和手动时间
- 支持第一人称、侧坐、俯看、环视视角
- 支持沉浸观察模式，隐藏多余 UI
- 使用 React、Vite、Three.js、React Three Fiber 构建

## macOS 本地运行

```bash
git clone https://github.com/fsbadminton/tea-company.git
cd tea-company
npm install
npm run dev
```

启动后按终端提示打开本地地址，通常是：

```bash
http://localhost:5173
```

## 常用命令

```bash
npm run dev
```

启动开发服务器。

```bash
npm run build
```

生成生产构建。

```bash
npm run preview
```

本地预览生产构建。

## 项目结构

```text
src/
  App.jsx
  components/
    MainStage.jsx
    TopBar.jsx
    ControlDock.jsx
    AmbientInfo.jsx
    stage/
      TeaSceneCanvas.jsx
  data/
    scenes.js
```

## 说明

`node_modules/` 和 `dist/` 不会提交到仓库。首次 clone 后请运行 `npm install` 安装依赖。
