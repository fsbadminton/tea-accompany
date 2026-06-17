import { TeaSceneCanvas } from "./stage/TeaSceneCanvas";

const weatherLabels = {
  clear: "晴",
  overcast: "阴",
  rain: "雨",
};

const timeLabels = {
  dawn: "清晨",
  day: "白日",
  dusk: "黄昏",
  night: "夜晚",
};

const perspectiveLabels = {
  firstPerson: "第一人称",
  sideView: "侧坐",
  topView: "俯看茶席",
  orbitView: "环视",
};

export function MainStage({ scene, weather, timeSlot, perspective, mood, audioEnabled }) {
  const viewClass = perspective === "firstPerson" ? "is-first-person" : "is-observing";

  return (
    <main
      className={`main-stage is-${scene.id} is-${weather} view-${perspective} ${viewClass} is-procedural`}
      style={{
        "--sky": mood.sky,
        "--mist": mood.mist,
        "--glow": mood.glow,
        "--accent-a": scene.palette[0],
        "--accent-b": scene.palette[1],
        "--accent-c": scene.palette[2],
      }}
    >
      <div className="scene-backdrop">
        <TeaSceneCanvas scene={scene} weather={weather} timeSlot={timeSlot} perspective={perspective} mood={mood} />
      </div>

      <section className="stage-copy">
        <p className="eyebrow">茶席</p>
        <h1>{scene.name}</h1>
        <p className="scene-description">{scene.description}</p>
        <div className="scene-tags">
          <span>{weatherLabels[weather]}</span>
          <span>{timeLabels[timeSlot]}</span>
          <span>{perspectiveLabels[perspective]}</span>
          <span>{audioEnabled ? "环境音开启" : "静音"}</span>
        </div>
      </section>

      <section className="table-zone" />
    </main>
  );
}
