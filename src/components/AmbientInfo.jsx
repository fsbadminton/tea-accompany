const occupancyLabel = {
  solo: "独坐一席",
  duo: "二人对饮",
  group: "三四人围坐",
};

const timeLabel = {
  dawn: "清晨",
  day: "白日",
  dusk: "黄昏",
  night: "夜晚",
};

const weatherLabel = {
  clear: "晴",
  overcast: "阴",
  rain: "雨",
};

export function AmbientInfo({ scene, timeSlot, weather, occupancy }) {
  return (
    <section className="ambient-info">
      <p className="ambient-label">当前情绪</p>
      <h2>{scene.name}</h2>
      <p className="ambient-summary">
        {timeLabel[timeSlot]} / {weatherLabel[weather]} / {occupancyLabel[occupancy]}
      </p>
      <div className="accent-list">
        {scene.accents.map((accent) => (
          <span key={accent}>{accent}</span>
        ))}
      </div>
    </section>
  );
}
