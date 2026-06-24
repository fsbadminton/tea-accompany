import { MOOD_QUOTES, LABELS } from "../data/scenes";

export function AmbientInfo({ scene, timeSlot, weather, occupancy, guestStateLabel }) {
  const moodQuote = MOOD_QUOTES[scene.id]?.[timeSlot] || "";

  return (
    <section className="ambient-info">
      <p className="ambient-label">当前情绪</p>
      <h2>{scene.name}</h2>
      {moodQuote && <p className="ambient-quote">{moodQuote}</p>}
      <p className="ambient-summary">
        {LABELS.timeSlot[timeSlot]} / {LABELS.weather[weather]} / {LABELS.occupancy[occupancy]}
      </p>
      {guestStateLabel && (
        <p className="guest-status">{guestStateLabel}</p>
      )}
    </section>
  );
}
