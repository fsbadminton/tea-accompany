import { CONTROL_OPTIONS, SCENE_CONFIG } from "../data/scenes";

function SelectField({ label, value, onChange, options, disabled = false }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TopBar(props) {
  return (
    <header className="top-bar">
      <SelectField
        label="场景"
        value={props.sceneId}
        onChange={props.onSceneChange}
        options={SCENE_CONFIG.map((s) => ({ value: s.id, label: s.name }))}
      />

      <SelectField
        label="时间"
        value={props.manualTime}
        onChange={props.onManualTimeChange}
        options={CONTROL_OPTIONS.timeSlots}
      />

      <SelectField
        label="天气"
        value={props.weather}
        onChange={props.onWeatherChange}
        options={CONTROL_OPTIONS.weather}
      />

      <SelectField
        label="宾客"
        value={props.occupancy}
        onChange={props.onOccupancyChange}
        options={CONTROL_OPTIONS.occupancy}
      />

      <SelectField
        label="视角"
        value={props.perspective}
        onChange={props.onPerspectiveChange}
        options={CONTROL_OPTIONS.perspectives}
      />
    </header>
  );
}
