import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { SCENE_CONFIG, WELCOME_QUOTES, CEREMONY_STEPS, GESTURE_DESCRIPTIONS, CEREMONY_CONFIG } from "./data/scenes";
import { MainStage } from "./components/MainStage";
import { TopBar } from "./components/TopBar";
import { ControlDock } from "./components/ControlDock";
import { AmbientInfo } from "./components/AmbientInfo";
import { WelcomeOverlay } from "./components/WelcomeOverlay";
import { GestureHint } from "./components/GestureHint";

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
  const [showImmersiveHint, setShowImmersiveHint] = useState(false);
  const [activeGesture, setActiveGesture] = useState("pour");
  const [clockTime, setClockTime] = useState(new Date());
  const [sceneTransition, setSceneTransition] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !sessionStorage.getItem("tea-welcomed"); } catch { return true; }
  });
  const [ceremonyMode, setCeremonyMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [ceremonyPaused, setCeremonyPaused] = useState(false);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef(null);

  const handleSceneChange = useCallback((newSceneId) => {
    if (newSceneId === sceneId) return;
    setSceneTransition(true);
    setTimeout(() => {
      setSceneId(newSceneId);
      setTimeout(() => setSceneTransition(false), 300);
    }, 200);
  }, [sceneId]);

  const handleWelcomeDismiss = useCallback(() => {
    setShowWelcome(false);
    try { sessionStorage.setItem("tea-welcomed", "1"); } catch { /* ignore */ }
  }, []);

  // --- Ceremony mode handlers ---

  const handleCeremonyStart = useCallback(() => {
    setCeremonyMode(true);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setCeremonyPaused(false);
    // Set table style to full for ceremony
    setTableStyle('full');
  }, []);

  const handleCeremonyStop = useCallback(() => {
    setCeremonyMode(false);
    setCurrentStepIndex(-1);
    setCompletedSteps(new Set());
    setCeremonyPaused(false);
    setActiveGesture('pour');
  }, []);

  const handleCeremonyPauseToggle = useCallback(() => {
    setCeremonyPaused((p) => !p);
  }, []);

  const handleStepClick = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < CEREMONY_STEPS.length) {
      setCurrentStepIndex(stepIndex);
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        // Mark all steps before as completed
        for (let i = 0; i < stepIndex; i++) {
          next.add(CEREMONY_STEPS[i].id);
        }
        return next;
      });
    }
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= CEREMONY_STEPS.length) {
        // Ceremony complete
        setTimeout(() => {
          setCeremonyMode(false);
          setCurrentStepIndex(-1);
          setCompletedSteps(new Set());
        }, 2000);
        return prev; // stay on last step briefly
      }
      // Mark previous step as completed
      setCompletedSteps((p) => {
        const n = new Set(p);
        n.add(CEREMONY_STEPS[prev].id);
        return n;
      });
      return next;
    });
  }, []);

  const handleGestureChange = useCallback((gesture) => {
    if (ceremonyMode) {
      // Manual gesture click exits ceremony mode
      setCeremonyMode(false);
      setCurrentStepIndex(-1);
      setCompletedSteps(new Set());
      setCeremonyPaused(false);
    }
    setActiveGesture(gesture);
  }, [ceremonyMode]);

  useEffect(() => {
    if (timeMode !== "auto") return undefined;

    const updateClock = () => setClockTime(new Date());
    updateClock();

    const timer = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(timer);
  }, [timeMode]);

  useEffect(() => {
    if (!immersiveMode) {
      setShowImmersiveHint(false);
      return undefined;
    }
    setShowImmersiveHint(true);
    const timer = window.setTimeout(() => setShowImmersiveHint(false), 2200);
    return () => window.clearTimeout(timer);
  }, [immersiveMode]);

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

  const currentStep = ceremonyMode && currentStepIndex >= 0 ? CEREMONY_STEPS[currentStepIndex] : null;
  const currentGestureFromStep = currentStep?.gesture ?? null;
  // In ceremony mode, use the gesture from the current step; in manual mode, use activeGesture
  const effectiveGesture = ceremonyMode ? currentGestureFromStep : activeGesture;

  // Create AudioContext once; only update parameters on scene/weather changes
  useEffect(() => {
    const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextImpl) return undefined;

    // Create context only once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextImpl();
    }
    const context = audioCtxRef.current;

    // Create nodes only once
    if (!audioNodesRef.current) {
      const master = context.createGain();
      master.gain.value = 0.055;
      master.connect(context.destination);

      const lowDrone = context.createOscillator();
      lowDrone.type = "sine";
      lowDrone.frequency.value = 68;
      const lowGain = context.createGain();
      lowGain.gain.value = 0.18;
      lowDrone.connect(lowGain);
      lowGain.connect(master);
      lowDrone.start();

      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const windNoise = context.createBufferSource();
      windNoise.buffer = buffer;
      windNoise.loop = true;
      const windFilter = context.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.value = 520;
      const windGain = context.createGain();
      windGain.gain.value = 0.08;
      windNoise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(master);
      windNoise.start();

      const rainNoise = context.createBufferSource();
      rainNoise.buffer = buffer;
      rainNoise.loop = true;
      const rainFilter = context.createBiquadFilter();
      rainFilter.type = "highpass";
      rainFilter.frequency.value = 1700;
      const rainGain = context.createGain();
      rainGain.gain.value = 0.01;
      rainNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      rainNoise.start();

      audioNodesRef.current = {
        master, lowDrone, lowGain,
        windFilter, windGain,
        rainFilter, rainGain,
      };
    }

    // Update parameters (no node recreation)
    const nodes = audioNodesRef.current;
    nodes.lowDrone.frequency.setTargetAtTime(
      sceneId === "tearoom" ? 68 : 52, context.currentTime, 0.1
    );
    nodes.windFilter.frequency.setTargetAtTime(
      weather === "rain" ? 820 : 520, context.currentTime, 0.1
    );
    nodes.windGain.gain.setTargetAtTime(
      weather === "rain" ? 0.18 : 0.08, context.currentTime, 0.1
    );
    nodes.rainGain.gain.setTargetAtTime(
      weather === "rain" ? 0.12 : 0.01, context.currentTime, 0.1
    );

    // Suspend/resume based on audioEnabled
    if (audioEnabled && context.state === "suspended") {
      context.resume();
    } else if (!audioEnabled && context.state === "running") {
      context.suspend();
    }

    // Cleanup on unmount only
    return () => {
      if (audioNodesRef.current) {
        try {
          audioNodesRef.current.lowDrone.stop();
          audioNodesRef.current.windGain.disconnect();
          audioNodesRef.current.rainGain.disconnect();
        } catch { /* ignore */ }
        audioNodesRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to audioEnabled toggle separately
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (audioEnabled && ctx.state === "suspended") {
      ctx.resume();
    } else if (!audioEnabled && ctx.state === "running") {
      ctx.suspend();
    }
  }, [audioEnabled]);

  // React to sceneId / weather parameter changes
  useEffect(() => {
    const nodes = audioNodesRef.current;
    const ctx = audioCtxRef.current;
    if (!nodes || !ctx) return;
    nodes.lowDrone.frequency.setTargetAtTime(
      sceneId === "tearoom" ? 68 : 52, ctx.currentTime, 0.1
    );
    nodes.windFilter.frequency.setTargetAtTime(
      weather === "rain" ? 820 : 520, ctx.currentTime, 0.1
    );
    nodes.windGain.gain.setTargetAtTime(
      weather === "rain" ? 0.18 : 0.08, ctx.currentTime, 0.1
    );
    nodes.rainGain.gain.setTargetAtTime(
      weather === "rain" ? 0.12 : 0.01, ctx.currentTime, 0.1
    );
  }, [sceneId, weather]);

  // Ceremony auto-play interval
  useEffect(() => {
    if (!ceremonyMode || ceremonyPaused || currentStepIndex < 0) return;

    const step = CEREMONY_STEPS[currentStepIndex];
    if (!step) return;

    // Get duration adapted for current weather
    const baseDuration = step.duration || CEREMONY_CONFIG.autoPlayInterval;
    const weatherDuration = step.weatherAdapt?.[weather] ?? baseDuration;
    const duration = Math.max(weatherDuration, 1500); // minimum 1.5s per step

    const timer = setTimeout(() => {
      advanceStep();
    }, duration);

    return () => clearTimeout(timer);
  }, [ceremonyMode, ceremonyPaused, currentStepIndex, weather, advanceStep]);

  const welcomeQuote = useMemo(() => {
    const initialSlot = getTimeSlotFromHour(new Date().getHours());
    const quotes = WELCOME_QUOTES[initialSlot] || WELCOME_QUOTES.day;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  return (
    <div className={`app-shell ${immersiveMode ? "is-immersive" : ""}`}>
      <div className={`loading-overlay${sceneLoaded ? " is-fading" : ""}`}>
        <div className="loading-cup">
          <div className="loading-steam">
            <span /><span /><span />
          </div>
          <div className="loading-cup-body" />
          <div className="loading-cup-handle" />
        </div>
        <p className="loading-text">加载中...</p>
      </div>

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
        activeGesture={effectiveGesture}
        mood={derivedMood}
        audioEnabled={audioEnabled}
        sceneTransition={sceneTransition}
        onSceneLoaded={() => setSceneLoaded(true)}
      />

      <button
        type="button"
        className="immersive-toggle"
        onClick={() => setImmersiveMode((value) => !value)}
      >
        {immersiveMode ? "退出沉浸" : "沉浸观察"}
      </button>

      {showImmersiveHint && (
        <div className="immersive-hint" onClick={() => setImmersiveMode(false)}>
          点击任意位置退出沉浸
        </div>
      )}

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
          onGestureChange={handleGestureChange}
          ceremonyMode={ceremonyMode}
          onCeremonyToggle={ceremonyMode ? handleCeremonyStop : handleCeremonyStart}
          ceremonyPaused={ceremonyPaused}
          onCeremonyPauseToggle={handleCeremonyPauseToggle}
          steps={CEREMONY_STEPS}
          currentStepIndex={currentStepIndex}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {currentStep && (
          <GestureHint
            step={currentStep}
            sceneId={sceneId}
            weather={weather}
            timeSlot={currentTimeSlot}
            occupancy={occupancy}
            isVisible={ceremonyMode && !ceremonyPaused}
          />
        )}
      </div>
    </div>
  );
}

export default App;
