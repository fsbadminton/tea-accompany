import { TeaSceneCanvas } from "./stage/TeaSceneCanvas";
import { LABELS } from "../data/scenes";

export function MainStage({ scene, weather, timeSlot, perspective, mood, audioEnabled, activeGesture, tableStyle, sceneTransition, occupancy }) {
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
      {sceneTransition && <div className="scene-transition-overlay" />}
      <div className="scene-backdrop">
        <TeaSceneCanvas scene={scene} weather={weather} timeSlot={timeSlot} perspective={perspective} mood={mood} activeGesture={activeGesture} tableStyle={tableStyle} occupancy={occupancy} />
      </div>

      <section className="stage-copy">
        <p className="eyebrow">茶席</p>
        <h1>{scene.name}</h1>
        <p className="scene-description">{scene.description}</p>
        <div className="scene-tags">
          <span>{LABELS.weather[weather]}</span>
          <span>{LABELS.timeSlot[timeSlot]}</span>
          <span>{LABELS.perspective[perspective]}</span>
          <span>{audioEnabled ? "环境音开启" : "静音"}</span>
        </div>
      </section>
    </main>
  );
}
