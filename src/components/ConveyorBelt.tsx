import React from 'react';
import { ExecutionStep, Process } from '../types/memory';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Boxes,
} from 'lucide-react';

interface ConveyorBeltProps {
  processes: Process[];
  currentStep: ExecutionStep;
}

// High contrast pastel palettes: pastel background with text-slate-900 in light mode and vibrant tones in dark mode
const PASTEL_PACKAGES = [
  {
    bg: 'bg-emerald-100 dark:bg-emerald-950/80',
    border: 'border-emerald-300 dark:border-emerald-700/80',
    text: 'text-emerald-950 dark:text-emerald-100',
    badge: 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200',
  },
  {
    bg: 'bg-blue-100 dark:bg-blue-950/80',
    border: 'border-blue-300 dark:border-blue-700/80',
    text: 'text-blue-950 dark:text-blue-100',
    badge: 'bg-blue-200 dark:bg-blue-900/80 text-blue-900 dark:text-blue-200',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-950/80',
    border: 'border-purple-300 dark:border-purple-700/80',
    text: 'text-purple-950 dark:text-purple-100',
    badge: 'bg-purple-200 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200',
  },
  {
    bg: 'bg-amber-100 dark:bg-amber-950/80',
    border: 'border-amber-300 dark:border-amber-700/80',
    text: 'text-amber-950 dark:text-amber-100',
    badge: 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200',
  },
  {
    bg: 'bg-cyan-100 dark:bg-cyan-950/80',
    border: 'border-cyan-300 dark:border-cyan-700/80',
    text: 'text-cyan-950 dark:text-cyan-100',
    badge: 'bg-cyan-200 dark:bg-cyan-900/80 text-cyan-900 dark:text-cyan-200',
  },
  {
    bg: 'bg-rose-100 dark:bg-rose-950/80',
    border: 'border-rose-300 dark:border-rose-700/80',
    text: 'text-rose-950 dark:text-rose-100',
    badge: 'bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200',
  },
];

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  processes,
  currentStep,
}) => {
  if (processes.length === 0) {
    return null;
  }

  const activeProcessId = currentStep.process?.id;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 shadow-sm transition-colors select-none">
      {/* Top Header of Conveyor Belt */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Paket Proses Conveyor Belt
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Antrean paket proses yang dievaluasi ke dalam blok RAM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <span>Total: {processes.length} Paket</span>
        </div>
      </div>

      {/* Conveyor Belt Track Container */}
      <div className="relative w-full overflow-x-auto pb-1 pt-1 scrollbar-thin">
        <div className="flex items-center gap-3 min-w-max">
          {processes.map((proc, index) => {
            const pastel = PASTEL_PACKAGES[index % PASTEL_PACKAGES.length];
            const isCurrentActive = activeProcessId === proc.id;
            const allocatedInfo = currentStep.allocatedProcesses.find(
              (a) => a.process.id === proc.id
            );
            const isFailed = currentStep.failedProcesses.some(
              (f) => f.id === proc.id
            );

            // Determine status
            let statusText = 'Menunggu';
            let statusClass =
              'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
            let StatusIcon = Clock;

            if (allocatedInfo) {
              statusText = `Dialokasikan ke ${allocatedInfo.holeName}`;
              statusClass =
                'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40';
              StatusIcon = CheckCircle2;
            } else if (isFailed) {
              statusText = 'Alokasi Gagal';
              statusClass =
                'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-400/40';
              StatusIcon = AlertTriangle;
            } else if (isCurrentActive) {
              statusText = 'Sedang Dievaluasi';
              statusClass =
                'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-400/40 animate-pulse';
              StatusIcon = ArrowRight;
            }

            return (
              <div
                key={proc.id}
                className={`relative flex flex-col justify-between p-2.5 rounded-2xl border-2 transition-all duration-300 w-44 shrink-0 shadow-sm ${
                  isCurrentActive
                    ? 'ring-4 ring-blue-500/30 border-blue-500 scale-105 shadow-md shadow-blue-500/10'
                    : pastel.border
                } ${pastel.bg}`}
              >
                {/* Process Package Header */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-white/70 dark:bg-black/30 shadow-xs">
                      <Cpu className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                    </span>
                    {/* Process Name: High Contrast text-slate-900 in light, white in dark */}
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                      {proc.name}
                    </span>
                  </div>

                  {/* Size Badge: High Contrast */}
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-white/90 dark:bg-black/40 text-slate-900 dark:text-white shadow-xs border border-black/10 dark:border-white/10">
                    {proc.size} KB
                  </span>
                </div>

                {/* Status Indicator */}
                <div
                  className={`mt-1.5 flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold ${statusClass}`}
                >
                  <StatusIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{statusText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
