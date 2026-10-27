import React, { useState } from 'react';
import {
  AlgorithmType,
  Hole,
  Process,
  ThemeMode,
} from '../types/memory';
import { PRESETS, PROCESS_PALETTES } from '../utils/algorithms';
import {
  Sun,
  Moon,
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Cpu,
  Sliders,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  holes: Hole[];
  onAddHole: (name: string, size: number) => void;
  onDeleteHole: (id: string) => void;
  processes: Process[];
  onAddProcess: (name: string, size: number) => void;
  onDeleteProcess: (id: string) => void;
  algorithm: AlgorithmType;
  onChangeAlgorithm: (algo: AlgorithmType) => void;
  failedCount: number;
  onResetToEmpty: () => void;
  onLoadPreset: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  onToggleTheme,
  holes,
  onAddHole,
  onDeleteHole,
  processes,
  onAddProcess,
  onDeleteProcess,
  algorithm,
  onChangeAlgorithm,
  failedCount,
  onResetToEmpty,
  onLoadPreset,
}) => {
  // Local state for forms
  const [holeName, setHoleName] = useState(`Blok ${holes.length + 1}`);
  const [holeSize, setHoleSize] = useState('');

  const [processName, setProcessName] = useState(`P${processes.length + 1}`);
  const [processSize, setProcessSize] = useState('');

  const totalRamCapacity = holes.reduce((acc, h) => acc + h.size, 0);

  const handleCreateHole = (e: React.FormEvent) => {
    e.preventDefault();
    const sizeNum = parseInt(holeSize, 10);
    if (!sizeNum || sizeNum <= 0) return;

    onAddHole(holeName.trim() || `Blok ${holes.length + 1}`, sizeNum);
    setHoleName(`Blok ${holes.length + 2}`);
    setHoleSize('');
  };

  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const sizeNum = parseInt(processSize, 10);
    if (!sizeNum || sizeNum <= 0) return;

    onAddProcess(processName.trim() || `P${processes.length + 1}`, sizeNum);
    setProcessName(`P${processes.length + 2}`);
    setProcessSize('');
  };

  return (
    <aside className="w-full md:w-[320px] lg:w-[340px] shrink-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors shadow-sm select-none z-20">
      {/* 1. Header with Logo & Theme Toggle */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Memory Allocator
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Kontrol Input & Simulasi
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Scrollable Configuration Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Preset Selector */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Contoh Kasus / Preset
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onLoadPreset(idx)}
                className="px-2 py-1.5 text-[11px] font-bold rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-center truncate shadow-xs"
                title={preset.description}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Total RAM & Reset */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                Total Kapasitas RAM
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {totalRamCapacity > 0 ? totalRamCapacity : '0'}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {totalRamCapacity > 0 ? 'KB' : '(Kosong)'}
                </span>
              </div>
            </div>

            <button
              onClick={onResetToEmpty}
              title="Kosongkan seluruh data memori"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Kosong
            </button>
          </div>
        </div>

        {/* Algorithm Selector */}
        <div>
          <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Algoritma Alokasi
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            {(
              [
                { id: 'first-fit', label: 'First Fit' },
                { id: 'best-fit', label: 'Best Fit' },
                { id: 'worst-fit', label: 'Worst Fit' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeAlgorithm(item.id)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  algorithm === item.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium leading-tight">
            {algorithm === 'first-fit' && '• Menempati blok kosong pertama yang muat.'}
            {algorithm === 'best-fit' && '• Menempati blok terkecil yang muat (minimal sisa).'}
            {algorithm === 'worst-fit' && '• Menempati blok terbesar yang muat (sisa terbesar).'}
          </p>
        </div>

        {/* Section: Blok Memori (Holes) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Blok Memori Awal (Holes)
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                ({holes.length})
              </span>
            </label>
          </div>

          {/* Form Tambah Hole */}
          <form onSubmit={handleCreateHole} className="flex gap-2">
            <input
              type="text"
              placeholder="Nama Blok"
              value={holeName}
              onChange={(e) => setHoleName(e.target.value)}
              className="w-2/5 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
            />
            <input
              type="number"
              placeholder="Ukuran KB"
              min="1"
              value={holeSize}
              onChange={(e) => setHoleSize(e.target.value)}
              className="w-2/5 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-mono placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              title="Tambah Blok Memori"
              className="w-1/5 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List of Holes */}
          {holes.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Belum ada blok memori. Masukkan nama & kapasitas KB di atas.
              </p>
            </div>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {holes.map((hole) => (
                <div
                  key={hole.id}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {hole.name}
                    </span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold text-[11px]">
                      {hole.size} KB
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteHole(hole.id)}
                    title={`Hapus ${hole.name}`}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Antrean Proses (Processes) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Antrean Proses
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                ({processes.length})
              </span>
            </label>
          </div>

          {/* Form Tambah Proses */}
          <form onSubmit={handleCreateProcess} className="flex gap-2">
            <input
              type="text"
              placeholder="Nama Proses"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              className="w-2/5 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
            />
            <input
              type="number"
              placeholder="Ukuran KB"
              min="1"
              value={processSize}
              onChange={(e) => setProcessSize(e.target.value)}
              className="w-2/5 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-mono placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              title="Tambah Proses"
              className="w-1/5 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List of Processes */}
          {processes.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Belum ada proses. Masukkan nama & ukuran KB di atas.
              </p>
            </div>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {processes.map((proc, index) => {
                const palette =
                  proc.color || PROCESS_PALETTES[index % PROCESS_PALETTES.length];
                return (
                  <div
                    key={proc.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${palette} shrink-0`}
                      />
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {proc.name}
                      </span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px]">
                        {proc.size} KB
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteProcess(proc.id)}
                      title={`Hapus ${proc.name}`}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Indicator: Badge Gagal / Sukses */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        {failedCount > 0 ? (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-pulse" />
              <span className="text-xs font-black tracking-tight">
                {failedCount} Process Failed
              </span>
            </div>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200">
              Perlu Cek
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-black tracking-tight">
                {holes.length === 0 ? 'Siap Input' : 'Semua Terisi / Siap'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
              Optimal
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
