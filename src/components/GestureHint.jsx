const SCENE_ADAPT_TEXT = {
  lakeside: "湖畔微风拂过，茶香随水汽飘散。",
  courtyard: "檐下滴答声中，茶汤映着竹影。",
  tearoom: "窗棂光影交错，一室茶香。",
};

const WEATHER_TEXT = {
  clear: "天朗气清",
  overcast: "云色沉静",
  rain: "细雨如丝",
};

const TIME_TEXT = {
  dawn: "晨光熹微",
  day: "日光正暖",
  dusk: "暮色将至",
  night: "夜色深沉",
};

export function GestureHint({ step, sceneId, weather, timeSlot, occupancy, isVisible }) {
  if (!step) return null;

  const sceneHint = step.sceneAdapt?.[sceneId] || SCENE_ADAPT_TEXT[sceneId] || "";
  const weatherLabel = WEATHER_TEXT[weather] || "";
  const timeLabel = TIME_TEXT[timeSlot] || "";
  const contextParts = [weatherLabel, timeLabel].filter(Boolean).join(" · ");

  const className = [
    "gesture-hint",
    isVisible && "is-visible",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <p className="gesture-hint-title">{step.label}</p>
      <p className="gesture-hint-desc">{step.description}</p>
      <p className="gesture-hint-scene">{sceneHint}</p>
      {contextParts && (
        <p className="gesture-hint-scene" style={{ marginTop: "0.3rem", opacity: 0.6 }}>
          {contextParts}
        </p>
      )}
    </div>
  );
}
