import React, { useState } from 'react';
import {
  AlgorithmType,
  AllocationResult,
  ExecutionStep,
  Hole,
  Process,
  ThemeMode,
  ViewMode,
} from '../types/memory';
import { VerticalProgressBar } from './VerticalProgressBar';
import { CompareView } from './CompareView';
import { ConveyorBelt } from './ConveyorBelt';
import { TourModal } from './TourModal';
import {
  exportSingleAlgorithmPDF,
  exportComparisonReportPDF,
} from '../utils/pdfExport';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  PieChart,
  HardDrive,
  Activity,
  AlertTriangle,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Download,
} from 'lucide-react';

interface MainCanvasProps {
  theme: ThemeMode;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  algorithm: AlgorithmType;
  currentStep: ExecutionStep;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (index: number) => void;
  playbackSpeed: number; // in ms
  onChangeSpeed: (speed: number) => void;
  compareResults: {
    'first-fit': AllocationResult;
    'best-fit': AllocationResult;
    'worst-fit': AllocationResult;
  };
  holes: Hole[];
  processes: Process[];
  onBackToHome: () => void;
}

export const MainCanvas: React.FC<MainCanvasProps> = ({
  viewMode,
  onChangeViewMode,
  algorithm,
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  playbackSpeed,
  onChangeSpeed,
  compareResults,
  holes,
  processes,
  onBackToHome,
}) => {
  const [isFailedPanelMinimized, setIsFailedPanelMinimized] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const metrics = currentStep.metrics;
  const failedProcesses = currentStep.failedProcesses;

  const algoLabels: Record<AlgorithmType, string> = {
    'first-fit': 'First Fit',
    'best-fit': 'Best Fit',
    'worst-fit': 'Worst Fit',
  };

  const handleDownloadPDF = () => {
    if (viewMode === 'compare') {
      exportComparisonReportPDF(compareResults, holes, processes);
    } else {
      exportSingleAlgorithmPDF(algorithm, currentStep, holes, processes);
    }
  };

  return (
    <main className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors">
      {/* Interactive Tour Guide Modal */}
      <TourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* 1. TOP BAR CONTROLS */}
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-20 shadow-xs">
        {/* Left Side: Back to Home Button & Main Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            title="Kembali ke Beranda"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div>
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Memory Allocation Simulator
            </h2>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden md:block">
              Visualisasi Alokasi Memori Dinamis • Sistem Operasi
            </p>
          </div>
        </div>

        {/* Center / Right: Tour, View Mode, PDF Download & Playback Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Help / Tour Guide Button */}
          <button
            onClick={() => setIsTourOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-xs"
            title="Buka Panduan Aplikasi"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Panduan</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onChangeViewMode('tab')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'tab'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tab View ({algoLabels[algorithm]})
            </button>
            <button
              onClick={() => onChangeViewMode('compare')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'compare'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Compare View
            </button>
          </div>

          {/* Download Report (PDF) Button */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-95 shadow-xs"
            title={
              viewMode === 'compare'
                ? 'Download Laporan PDF Perbandingan 3 Algoritma'
                : `Download Laporan PDF untuk ${algoLabels[algorithm]}`
            }
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">
              {viewMode === 'compare'
                ? 'Ekspor PDF (Komparasi)'
                : 'Download Report (PDF)'}
            </span>
          </button>

          {/* Playback Controls (Active in Tab View) */}
          {viewMode === 'tab' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => onJumpToStep(0)}
                disabled={currentStepIndex === 0}
                title="Lompat ke awal"
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-800 dark:text-slate-200 transition"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onStepBackward}
                disabled={currentStepIndex === 0}
                title="Langkah sebelumnya"
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-800 dark:text-slate-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                disabled={holes.length === 0}
                title={isPlaying ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={onStepForward}
                disabled={currentStepIndex >= totalSteps - 1 || holes.length === 0}
                title="Langkah berikutnya"
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-800 dark:text-slate-200 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onJumpToStep(totalSteps - 1)}
                disabled={currentStepIndex >= totalSteps - 1 || holes.length === 0}
                title="Lompat ke akhir"
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-800 dark:text-slate-200 transition"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {viewMode === 'compare' ? (
          /* Compare View (3 Algorithms Side-by-Side) */
          <CompareView
            results={compareResults}
            totalRamCapacity={metrics.totalCapacity}
            onExportPDF={handleDownloadPDF}
          />
        ) : (
          /* Tab View (Focused Single Algorithm) */
          <>
            {/* Stats Dashboard: Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Metric 1: Total Memori Terpakai */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Memori Terpakai
                  </span>
                  <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {metrics.usedPercentage}%
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    {metrics.totalUsed} / {metrics.totalCapacity} KB
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div
                    style={{ width: `${metrics.usedPercentage}%` }}
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 rounded-full"
                  />
                </div>
              </div>

              {/* Metric 2: Total Sisa Memori & Fragmentasi */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Sisa Memori / Frag.
                  </span>
                  <HardDrive className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    {metrics.totalFree}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    KB Free
                  </span>
                </div>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mt-2">
                  Fragmentasi Internal:{' '}
                  <span className="font-mono font-black">
                    {metrics.internalFragmentation} KB
                  </span>
                </div>
              </div>

              {/* Metric 3: Efisiensi Alokasi */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Efisiensi Alokasi
                  </span>
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {metrics.efficiencyPercentage}%
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Ratio
                  </span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                  {metrics.allocatedCount} dari {metrics.totalProcesses} proses aktif
                </div>
              </div>

              {/* Metric 4: Status Alokasi */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    Proses Gagal
                  </span>
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      metrics.failedCount > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-black font-mono ${
                      metrics.failedCount > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {metrics.failedCount}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Gagal
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-2">
                  {metrics.failedCount === 0
                    ? holes.length === 0
                      ? 'Menunggu input data'
                      : '✓ Semua berhasil masuk'
                    : `⚠️ ${metrics.failedCount} proses kekurangan ruang`}
                </div>
              </div>
            </div>

            {/* Conveyor Belt Antrean Proses */}
            <ConveyorBelt processes={processes} currentStep={currentStep} />

            {/* Step Explanation Banner */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    currentStep.action === 'allocated'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : currentStep.action === 'failed'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : currentStep.action === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {currentStep.action === 'allocated' ? (
                    <Layers className="w-5 h-5" />
                  ) : currentStep.action === 'failed' ? (
                    <XCircle className="w-5 h-5" />
                  ) : currentStep.action === 'completed' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <HelpCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {holes.length === 0
                      ? 'Status Sistem'
                      : `Langkah ${currentStep.stepNumber} (${algoLabels[algorithm]})`}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {holes.length === 0
                      ? 'Kapasitas RAM = 0 KB (Clean Initial State). Tambahkan Blok Memori (Hole) di Sidebar Kiri.'
                      : currentStep.description}
                  </p>
                </div>
              </div>

              {/* Step counter slider if holes exist */}
              {holes.length > 0 && totalSteps > 1 && (
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {currentStepIndex}/{totalSteps - 1}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, totalSteps - 1)}
                    value={currentStepIndex}
                    onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
                    className="w-20 sm:w-28 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Visual RAM Columns Area */}
            <div className="rounded-3xl p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm relative min-h-[440px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                    Visualisasi Blok Memori RAM
                  </h2>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold border border-slate-200 dark:border-slate-600">
                    {currentStep.holesState.length} Holes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-emerald-500" />
                    <span>Terisi (Proses)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-amber-400" />
                    <span>Fragmentasi Internal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-slate-300 dark:bg-slate-600" />
                    <span>Kosong</span>
                  </div>
                </div>
              </div>

              {/* Vertical Bars Container */}
              <div className="flex-1 flex items-end justify-center sm:justify-start gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-2">
                {currentStep.holesState.length === 0 ? (
                  /* Clean Initial State Notice */
                  <div className="w-full h-64 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <Layers className="w-7 h-7 opacity-75" />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      Memori RAM Belum Diatur (Kondisi Awal Kosong)
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-md mt-1.5 leading-relaxed">
                      Kapasitas RAM saat ini{' '}
                      <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        0 KB
                      </span>
                      . Silakan gunakan formulir pada{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        Sidebar Kiri
                      </span>{' '}
                      untuk menambahkan Blok Memori Awal (Hole) dan Antrean Proses.
                    </p>
                  </div>
                ) : (
                  currentStep.holesState.map((hole) => (
                    <VerticalProgressBar
                      key={hole.id}
                      hole={hole}
                      isHighlighted={currentStep.targetHoleId === hole.id}
                      totalRamCapacity={metrics.totalCapacity}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. FLOATING FAILED PROCESSES PANEL (Pojok Kanan Bawah Canvas) */}
      {failedProcesses.length > 0 && (
        <div
          className={`absolute bottom-6 right-6 z-30 transition-all duration-300 ${
            isFailedPanelMinimized ? 'w-auto' : 'w-80 sm:w-96'
          }`}
        >
          <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-rose-300 dark:border-rose-800 rounded-3xl p-4 shadow-2xl text-slate-900 dark:text-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-black leading-tight flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    Proses Gagal Dialokasikan
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-[10px] font-black">
                      {failedProcesses.length}
                    </span>
                  </h4>
                  {!isFailedPanelMinimized && (
                    <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      Memory Allocation Failed (Tidak ada blok yang muat)
                    </p>
                  )}
                </div>
              </div>

              {/* Minimize / Maximize button */}
              <button
                onClick={() =>
                  setIsFailedPanelMinimized(!isFailedPanelMinimized)
                }
                title={isFailedPanelMinimized ? 'Buka detail' : 'Kecilkan'}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition"
              >
                {isFailedPanelMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* List of failed processes (expanded view) */}
            {!isFailedPanelMinimized && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                {failedProcesses.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        Proses {p.name}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                        Ukuran yang dibutuhkan:{' '}
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {p.size} KB
                        </span>
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-xl bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200">
                      Tidak Muat
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
