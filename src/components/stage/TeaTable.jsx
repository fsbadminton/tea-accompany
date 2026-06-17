const gestureCopy = {
  pour: "Warm tea settles into the cup.",
  serve: "A cup is gently placed across the tray.",
  brew: "Steam gathers slowly above the lid.",
};

export function TeaTable({ tableStyle, activeGesture }) {
  return (
    <div className={`tea-table ${tableStyle === "full" ? "is-full" : "is-simple"}`}>
      <div className="table-surface" />
      <div className="tea-tray" />
      <div className="tea-set">
        <div className="teapot" />
        <div className="pitcher" />
        <div className="cup cup-a" />
        <div className="cup cup-b" />
        {tableStyle === "full" && (
          <>
            <div className="cup cup-c" />
            <div className="cup cup-d" />
            <div className="tea-jar" />
            <div className="tea-cloth" />
          </>
        )}
      </div>
      <div className="steam steam-a" />
      <div className="steam steam-b" />
      <p className="gesture-caption">{gestureCopy[activeGesture]}</p>
    </div>
  );
}
