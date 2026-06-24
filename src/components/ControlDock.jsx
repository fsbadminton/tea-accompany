import { CONTROL_OPTIONS } from "../data/scenes";
import { CeremonyTimeline } from "./CeremonyTimeline";

export function ControlDock({
  tableStyle,
  audioEnabled,
  activeGesture,
  onTableStyleChange,
  onAudioToggle,
  onGestureChange,
  ceremonyMode,
  onCeremonyToggle,
  ceremonyPaused,
  onCeremonyPauseToggle,
  steps,
  currentStepIndex,
  completedSteps,
  onStepClick,
  panelVisible,
}) {
  const dockClass = [
    'control-dock',
    !panelVisible && 'is-autohide',
  ].filter(Boolean).join(' ');

  return (
    <aside className={dockClass}>
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
          {audioEnabled ? "关闭声音" : "打开声音"}
        </button>
      </div>

      <div className="dock-card">
        {ceremonyMode ? (
          <>
            <p className="dock-title">茶席流程</p>
            <CeremonyTimeline
              steps={steps}
              currentStepIndex={currentStepIndex}
              completedSteps={completedSteps}
              onStepClick={onStepClick}
            />
            <div className="ceremony-controls">
              <button
                type="button"
                className="ceremony-btn"
                onClick={onCeremonyPauseToggle}
              >
                {ceremonyPaused ? "继续" : "暂停"}
              </button>
              <button
                type="button"
                className="ceremony-btn"
                onClick={onCeremonyToggle}
              >
                结束茶席
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="chip-grid-2">
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
            <div className="ceremony-controls">
              <button
                type="button"
                className="ceremony-btn"
                onClick={onCeremonyToggle}
              >
                开始茶席
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
