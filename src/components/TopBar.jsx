import { CONTROL_OPTIONS } from "../data/scenes";

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
        options={[
          { value: "lakeside", label: "湖畔凉亭" },
          { value: "courtyard", label: "山间雨院" },
          { value: "tearoom", label: "窗边茶室" },
        ]}
      />

      <SelectField
        label="时间模式"
        value={props.timeMode}
        onChange={props.onTimeModeChange}
        options={CONTROL_OPTIONS.timeModes}
      />

      <SelectField
        label="时间"
        value={props.manualTime}
        onChange={props.onManualTimeChange}
        options={CONTROL_OPTIONS.timeSlots}
        disabled={props.timeMode === "auto"}
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
        label="看法"
        value={props.perspective}
        onChange={props.onPerspectiveChange}
        options={CONTROL_OPTIONS.perspectives}
      />
    </header>
  );
}
