export function CharacterSilhouettes({ occupancy, perspective }) {
  if (occupancy === "solo") {
    return perspective === "firstPerson" ? (
      <div className="hand-layer">
        <div className="hand-shape left-hand" />
        <div className="hand-shape right-hand" />
      </div>
    ) : null;
  }

  const positions = occupancy === "duo"
    ? ["seat-opposite"]
    : ["seat-opposite", "seat-left", "seat-right"];

  return (
    <div className="silhouette-layer">
      {positions.map((position) => (
        <div key={position} className={`silhouette ${position}`}>
          <div className="head" />
          <div className="body" />
        </div>
      ))}
    </div>
  );
}
