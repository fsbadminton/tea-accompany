import { CONTROL_OPTIONS } from "../data/scenes";

export function ControlDock({
  tableStyle,
  audioEnabled,
  activeGesture,
  onTableStyleChange,
  onAudioToggle,
  onGestureChange,
}) {
  return (
    <aside className="control-dock">
      <div className="dock-card">
        <p className="dock-title">茶具摆设</p>
        <div className="chip-row">
          {CONTROL_OPTIONS.tableStyles.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === tableStyle ? "chip is-active" : "chip"}
              onClick={() => onTableStyleChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dock-card">
        <p className="dock-title">环境音</p>
        <button type="button" className="toggle-button" onClick={onAudioToggle}>
          {audioEnabled ? "打开声音" : "关闭声音"}
        </button>
        <p className="dock-hint">雨声、风声和房间底噪会随场景变化。</p>
      </div>

      <div className="dock-card">
        <p className="dock-title">手势</p>
        <div className="chip-row">
          {CONTROL_OPTIONS.gestures.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === activeGesture ? "chip is-active" : "chip"}
              onClick={() => onGestureChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
