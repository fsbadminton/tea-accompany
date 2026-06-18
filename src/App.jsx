import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { SCENE_CONFIG, WELCOME_QUOTES } from "./data/scenes";
import { MainStage } from "./components/MainStage";
import { TopBar } from "./components/TopBar";
import { ControlDock } from "./components/ControlDock";
import { AmbientInfo } from "./components/AmbientInfo";
import { WelcomeOverlay } from "./components/WelcomeOverlay";

const getTimeSlotFromHour = (hour) => {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
};

function App() {
  const [sceneId, setSceneId] = useState("tearoom");
  const [timeMode, setTimeMode] = useState("auto");
  const [manualTime, setManualTime] = useState("dusk");
  const [weather, setWeather] = useState("rain");
  const [occupancy, setOccupancy] = useState("solo");
  const [perspective, setPerspective] = useState("firstPerson");
  const [tableStyle, setTableStyle] = useState("simple");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [activeGesture, setActiveGesture] = useState("pour");
  const [clockTime, setClockTime] = useState(new Date());
  const [sceneTransition, setSceneTransition] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !sessionStorage.getItem("tea-welcomed"); } catch { return true; }
  });
  const audioRef = useRef(null);

  const handleSceneChange = useCallback((newSceneId) => {
    if (newSceneId === sceneId) return;
    setSceneTransition(true);
    setTimeout(() => {
      setSceneId(newSceneId);
      setTimeout(() => setSceneTransition(false), 250);
    }, 200);
  }, [sceneId]);

  const handleWelcomeDismiss = useCallback(() => {
    setShowWelcome(false);
    try { sessionStorage.setItem("tea-welcomed", "1"); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (timeMode !== "auto") return undefined;

    const updateClock = () => setClockTime(new Date());
    updateClock();

    const timer = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(timer);
  }, [timeMode]);

  const currentTimeSlot = timeMode === "auto"
    ? getTimeSlotFromHour(clockTime.getHours())
    : manualTime;

  const currentScene = useMemo(
    () => SCENE_CONFIG.find((scene) => scene.id === sceneId) ?? SCENE_CONFIG[0],
    [sceneId],
  );

  const derivedMood = useMemo(() => {
    return currentScene.moods[currentTimeSlot]?.[weather] ?? currentScene.moods.day.clear;
  }, [currentScene, currentTimeSlot, weather]);

  useEffect(() => {
    if (!audioEnabled) {
      audioRef.current?.stop?.();
      audioRef.current = null;
      return undefined;
    }

    const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextImpl) return undefined;

    const context = new AudioContextImpl();
    const master = context.createGain();
    master.gain.value = 0.055;
    master.connect(context.destination);

    const lowDrone = context.createOscillator();
    lowDrone.type = "sine";
    lowDrone.frequency.value = sceneId === "tearoom" ? 68 : 52;

    const lowGain = context.createGain();
    lowGain.gain.value = 0.18;
    lowDrone.connect(lowGain);
    lowGain.connect(master);

    const windNoise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * 0.5;
    }
    windNoise.buffer = buffer;
    windNoise.loop = true;

    const windFilter = context.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = weather === "rain" ? 820 : 520;

    const windGain = context.createGain();
    windGain.gain.value = weather === "rain" ? 0.18 : 0.08;
    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);

    const rainNoise = context.createBufferSource();
    rainNoise.buffer = buffer;
    rainNoise.loop = true;

    const rainFilter = context.createBiquadFilter();
    rainFilter.type = "highpass";
    rainFilter.frequency.value = 1700;

    const rainGain = context.createGain();
    rainGain.gain.value = weather === "rain" ? 0.12 : 0.01;
    rainNoise.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(master);

    lowDrone.start();
    windNoise.start();
    rainNoise.start();

    audioRef.current = {
      stop: () => {
        try {
          lowDrone.stop();
          windNoise.stop();
          rainNoise.stop();
        } catch {
          // ignore cleanup races
        }
        context.close();
      },
    };

    return () => {
      audioRef.current?.stop?.();
      audioRef.current = null;
    };
  }, [audioEnabled, sceneId, weather]);

  const welcomeQuote = useMemo(() => {
    const quotes = WELCOME_QUOTES[currentTimeSlot] || WELCOME_QUOTES.day;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [currentTimeSlot]);

  return (
    <div className={`app-shell ${immersiveMode ? "is-immersive" : ""}`}>
      {showWelcome && (
        <WelcomeOverlay quote={welcomeQuote} onDismiss={handleWelcomeDismiss} />
      )}

      <MainStage
        scene={currentScene}
        weather={weather}
        timeSlot={currentTimeSlot}
        occupancy={occupancy}
        perspective={perspective}
        tableStyle={tableStyle}
        activeGesture={activeGesture}
        mood={derivedMood}
        audioEnabled={audioEnabled}
        sceneTransition={sceneTransition}
      />

      <button
        type="button"
        className="immersive-toggle"
        onClick={() => setImmersiveMode((value) => !value)}
      >
        {immersiveMode ? "退出沉浸" : "沉浸观察"}
      </button>

      <div className="app-overlay" aria-hidden={immersiveMode}>
        <TopBar
          sceneId={sceneId}
          timeMode={timeMode}
          manualTime={manualTime}
          weather={weather}
          occupancy={occupancy}
          perspective={perspective}
          onSceneChange={handleSceneChange}
          onTimeModeChange={setTimeMode}
          onManualTimeChange={setManualTime}
          onWeatherChange={setWeather}
          onOccupancyChange={setOccupancy}
          onPerspectiveChange={setPerspective}
        />

        <AmbientInfo
          scene={currentScene}
          timeSlot={currentTimeSlot}
          weather={weather}
          occupancy={occupancy}
        />

        <ControlDock
          tableStyle={tableStyle}
          audioEnabled={audioEnabled}
          activeGesture={activeGesture}
          onTableStyleChange={setTableStyle}
          onAudioToggle={() => setAudioEnabled((value) => !value)}
          onGestureChange={setActiveGesture}
        />
      </div>
    </div>
  );
}

export default App;
