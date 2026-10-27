import React from 'react';
import { AllocationResult, Hole } from '../types/memory';
import { VerticalProgressBar } from './VerticalProgressBar';
import {
  Trophy,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  HardDrive,
  Sparkles,
  Download,
  Layers,
} from 'lucide-react';

interface CompareViewProps {
  results: {
    'first-fit': AllocationResult;
    'best-fit': AllocationResult;
    'worst-fit': AllocationResult;
  };
  totalRamCapacity: number;
  onExportPDF: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  results,
  onExportPDF,
}) => {
  const algos = [
    {
      id: 'first-fit' as const,
      name: 'First Fit',
      subtitle: 'Alokasi ke blok pertama yang muat',
      result: results['first-fit'],
    },
    {
      id: 'best-fit' as const,
      name: 'Best Fit',
      subtitle: 'Alokasi ke blok terkecil yang muat',
      result: results['best-fit'],
    },
    {
      id: 'worst-fit' as const,
      name: 'Worst Fit',
      subtitle: 'Alokasi ke blok terbesar yang muat',
      result: results['worst-fit'],
    },
  ];

  const hasHoles = results['first-fit'].finalHoles.length > 0;

  // Find winner metrics (Lowest failed count, then lowest internal fragmentation)
  const minFailed = Math.min(...algos.map((a) => a.result.metrics.failedCount));
  const candidateWinners = algos.filter(
    (a) => a.result.metrics.failedCount === minFailed
  );
  const minFragmentation = Math.min(
    ...candidateWinners.map((a) => a.result.metrics.internalFragmentation)
  );
  const winner =
    candidateWinners.find(
      (a) => a.result.metrics.internalFragmentation === minFragmentation
    ) || algos[0];

  if (!hasHoles) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm select-none">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 opacity-75" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Data Memori Masih Kosong
        </h3>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-md mt-1.5 leading-relaxed">
          Tambahkan Blok Memori (Hole) dan Antrean Proses di Sidebar Kiri untuk melihat visualisasi dan perbandingan komparatif ketiga algoritma.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-auto pr-1 select-none">
      {/* Top Banner Notice with Download PDF Button */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-extrabold text-slate-900 dark:text-white">
            Perbandingan Head-to-Head 3 Algoritma
          </span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            • Hasil akhir alokasi komparatif setelah seluruh proses diproses.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-amber-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-slate-700">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Optimal:</span>
            <span className="font-extrabold text-amber-700 dark:text-amber-400">
              {winner.name}
            </span>
          </div>

          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
            title="Download Report PDF Komparasi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor PDF Komparasi</span>
          </button>
        </div>
      </div>

      {/* 3 Columns Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-12">
        {algos.map(({ id, name, subtitle, result }) => {
          const isWinner =
            result.metrics.failedCount === minFailed &&
            result.metrics.internalFragmentation === minFragmentation;

          return (
            <div
              key={id}
              className={`flex flex-col rounded-3xl p-4 transition-all border ${
                isWinner
                  ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {name}
                    </h3>
                    {isWinner && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300 dark:border-amber-700">
                        <Trophy className="w-3 h-3" />
                        Terbaik
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* Metrics mini grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {/* Metric: Used Memory */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <PieChart className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    Memori Terpakai
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                      {result.metrics.usedPercentage}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                      ({result.metrics.totalUsed} KB)
                    </span>
                  </div>
                </div>

                {/* Metric: Internal Fragmentation */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-amber-500" />
                    Frag. Internal
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                      {result.metrics.internalFragmentation}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      KB
                    </span>
                  </div>
                </div>

                {/* Metric: Success Count */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Teralokasi
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {result.allocatedProcesses.length}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      / {result.metrics.totalProcesses}
                    </span>
                  </div>
                </div>

                {/* Metric: Failed Count */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    Proses Gagal
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span
                      className={`text-base font-black font-mono ${
                        result.failedProcesses.length > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {result.failedProcesses.length}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      proses
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual RAM Columns for this Algorithm */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex items-end justify-center gap-2 overflow-x-auto min-h-[300px]">
                {result.finalHoles.map((hole: Hole) => (
                  <VerticalProgressBar
                    key={hole.id}
                    hole={hole}
                    compact={true}
                    totalRamCapacity={result.metrics.totalCapacity}
                  />
                ))}
              </div>

              {/* Failed processes list footer for this algorithm if any */}
              {result.failedProcesses.length > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-[11px] flex items-center justify-between">
                  <span className="font-bold">Gagal dialokasikan:</span>
                  <div className="flex gap-1 flex-wrap">
                    {result.failedProcesses.map((p) => (
                      <span
                        key={p.id}
                        className="px-1.5 py-0.5 rounded bg-rose-200/80 dark:bg-rose-900/60 font-mono text-[10px] font-black text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700"
                      >
                        {p.name} ({p.size}K)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
