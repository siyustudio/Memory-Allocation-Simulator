import { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlgorithmType,
  Hole,
  Process,
  ScreenMode,
  ThemeMode,
  ViewMode,
} from './types/memory';
import {
  generateAlgorithmSteps,
  simulateAllAlgorithms,
  PRESETS,
  PROCESS_PALETTES,
} from './utils/algorithms';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { MainCanvas } from './components/MainCanvas';

export function App() {
  // 1. Screen Mode (Starts on Landing Page)
  const [screen, setScreen] = useState<ScreenMode>('landing');

  // 2. Theme State (default dark mode ala Google Gemini Web #09090B / #18181C)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('memory_simulator_theme');
    return (saved as ThemeMode) || 'dark';
  });

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('memory_simulator_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 3. CLEAN INITIAL DATA STATE (Empty by default as required)
  // Kapasitas RAM = 0, Holes = [], Processes = []
  const [holes, setHoles] = useState<Hole[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);

  // 4. Simulation & View States
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('first-fit');
  const [viewMode, setViewMode] = useState<ViewMode>('tab');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200);

  // 5. Memoized Simulation Steps for Active Algorithm
  const simulationSteps = useMemo(() => {
    return generateAlgorithmSteps(algorithm, holes, processes);
  }, [algorithm, holes, processes]);

  // Keep currentStepIndex in bounds
  useEffect(() => {
    if (currentStepIndex >= simulationSteps.length) {
      setCurrentStepIndex(Math.max(0, simulationSteps.length - 1));
    }
  }, [simulationSteps.length, currentStepIndex]);

  // Current active step
  const currentStep = useMemo(() => {
    const safeIndex = Math.min(
      Math.max(0, currentStepIndex),
      simulationSteps.length - 1
    );
    return simulationSteps[safeIndex] || simulationSteps[0];
  }, [simulationSteps, currentStepIndex]);

  // 6. Memoized Compare View Results for all 3 Algorithms
  const compareResults = useMemo(() => {
    return simulateAllAlgorithms(holes, processes);
  }, [holes, processes]);

  // 7. Playback Timer Effect
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < simulationSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationSteps.length]);

  // 8. Event Handlers
  const handleStartSimulation = () => {
    // Ensure clean state when user clicks "Mulai"
    setHoles([]);
    setProcesses([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setScreen('simulator');
  };

  const handleBackToHome = () => {
    setIsPlaying(false);
    setScreen('landing');
  };

  const handleTogglePlay = () => {
    if (holes.length === 0) return;
    if (!isPlaying && currentStepIndex >= simulationSteps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStepForward = () => {
    if (holes.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(simulationSteps.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    if (holes.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleJumpToStep = (index: number) => {
    if (holes.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIndex(Math.min(Math.max(0, index), simulationSteps.length - 1));
  };

  const handleAddHole = (name: string, size: number) => {
    setIsPlaying(false);
    const newHole: Hole = {
      id: `h-${Date.now()}`,
      name,
      size,
      allocatedProcess: null,
      usedSize: 0,
      remainingSize: size,
    };
    setHoles((prev) => [...prev, newHole]);
  };

  const handleDeleteHole = (id: string) => {
    setIsPlaying(false);
    setHoles((prev) => prev.filter((h) => h.id !== id));
  };

  const handleAddProcess = (name: string, size: number) => {
    setIsPlaying(false);
    const color = PROCESS_PALETTES[processes.length % PROCESS_PALETTES.length];
    const newProcess: Process = {
      id: `p-${Date.now()}`,
      name,
      size,
      color,
    };
    setProcesses((prev) => [...prev, newProcess]);
  };

  const handleDeleteProcess = (id: string) => {
    setIsPlaying(false);
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetToEmpty = () => {
    setIsPlaying(false);
    setHoles([]);
    setProcesses([]);
    setCurrentStepIndex(0);
  };

  const handleLoadPreset = (index: number) => {
    setIsPlaying(false);
    if (PRESETS[index]) {
      setHoles(PRESETS[index].holes);
      setProcesses(PRESETS[index].processes);
      setCurrentStepIndex(0);
    }
  };

  const handleChangeAlgorithm = (algo: AlgorithmType) => {
    setIsPlaying(false);
    setAlgorithm(algo);
    setCurrentStepIndex(0);
  };

  // 9. Conditional Render: Landing Page vs Simulator
  if (screen === 'landing') {
    return (
      <LandingPage
        onStart={handleStartSimulation}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar Kiri: Input, Konfigurasi, Tema & Indikator */}
      <Sidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        holes={holes}
        onAddHole={handleAddHole}
        onDeleteHole={handleDeleteHole}
        processes={processes}
        onAddProcess={handleAddProcess}
        onDeleteProcess={handleDeleteProcess}
        algorithm={algorithm}
        onChangeAlgorithm={handleChangeAlgorithm}
        failedCount={currentStep.failedProcesses.length}
        onResetToEmpty={handleResetToEmpty}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main Canvas: Visualisasi RAM, Playback Controls, Summary Metrics, PDF Export & Floating Failed Card */}
      <MainCanvas
        theme={theme}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        algorithm={algorithm}
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={simulationSteps.length}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onJumpToStep={handleJumpToStep}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
        compareResults={compareResults}
        holes={holes}
        processes={processes}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}

export default App;
