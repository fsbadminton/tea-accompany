import { useState } from "react";

export function WelcomeOverlay({ quote, onDismiss }) {
  const [fading, setFading] = useState(false);

  const handleClick = () => {
    setFading(true);
    setTimeout(onDismiss, 600);
  };

  return (
    <div className={`welcome-overlay ${fading ? "is-fading" : ""}`}>
      <div className="welcome-content">
        <p className="welcome-eyebrow">茶 陪 伴</p>
        <h1 className="welcome-title">茶陪伴</h1>
        <p className="welcome-quote">{quote}</p>
        <button type="button" className="welcome-enter" onClick={handleClick}>
          进入茶席
        </button>
      </div>
    </div>
  );
}
