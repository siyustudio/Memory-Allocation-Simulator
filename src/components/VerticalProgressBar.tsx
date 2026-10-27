import React from 'react';
import { Hole } from '../types/memory';
import { Cpu, CheckCircle2, Layers } from 'lucide-react';

interface VerticalProgressBarProps {
  hole: Hole;
  isHighlighted?: boolean;
  compact?: boolean;
  totalRamCapacity?: number;
}

export const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  hole,
  isHighlighted = false,
  compact = false,
}) => {
  const isOccupied = hole.allocatedProcess !== null;
  const usedPercent = Math.min(100, Math.max(0, (hole.usedSize / hole.size) * 100));
  const remainingPercent = Math.max(0, 100 - usedPercent);

  // Gradient selection for the process
  const processGradient =
    hole.allocatedProcess?.color || 'from-emerald-500 to-teal-600';

  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${
        compact ? 'w-24 sm:w-28' : 'w-36 sm:w-44'
      }`}
    >
      {/* Hole Header Badge */}
      <div className="w-full mb-2 text-center">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <span
            className="font-bold text-slate-900 dark:text-slate-100 truncate"
            title={hole.name}
          >
            {hole.name}
          </span>
          <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-[11px]">
            {hole.size} KB
          </span>
        </div>
      </div>

      {/* Main Vertical Bar Container */}
      <div
        className={`w-full relative flex flex-col justify-end p-1.5 rounded-2xl transition-all duration-500 border-2 ${
          isHighlighted
            ? 'border-blue-600 dark:border-blue-400 ring-4 ring-blue-500/20 shadow-xl shadow-blue-500/15 scale-[1.02]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-inner'
        } ${compact ? 'h-64' : 'h-80 sm:h-96'}`}
      >
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Free Space / Internal Fragmentation (Top Portion) */}
        {remainingPercent > 0 && (
          <div
            style={{ height: `${remainingPercent}%` }}
            className={`w-full transition-all duration-500 rounded-xl flex flex-col items-center justify-center p-1.5 text-center relative overflow-hidden ${
              isOccupied
                ? 'bg-amber-100 dark:bg-amber-950/40 border border-dashed border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200'
                : 'bg-slate-200/70 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            {isOccupied ? (
              // Internal Fragmentation
              <div className="flex flex-col items-center justify-center space-y-0.5 animate-fadeIn">
                <span className="text-[10px] font-extrabold uppercase tracking-tight opacity-90 text-amber-900 dark:text-amber-300">
                  {compact ? 'Sisa' : 'Fragmentasi'}
                </span>
                <span className="font-mono font-black text-xs text-amber-950 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                  {hole.remainingSize} KB
                </span>
                {!compact && remainingPercent > 18 && (
                  <span className="text-[9px] font-bold text-amber-800 dark:text-amber-400">
                    ({remainingPercent.toFixed(0)}%)
                  </span>
                )}
              </div>
            ) : (
              // Completely Free Hole
              <div className="flex flex-col items-center justify-center space-y-1 text-slate-700 dark:text-slate-300">
                <Layers
                  className={`opacity-60 text-slate-700 dark:text-slate-300 ${
                    compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Kosong
                </span>
                <span className="font-mono text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-300/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                  {hole.size} KB
                </span>
              </div>
            )}
          </div>
        )}

        {/* Gap spacer if both portions exist */}
        {isOccupied && remainingPercent > 0 && (
          <div className="h-1.5 shrink-0" />
        )}

        {/* Occupied Process (Bottom Portion) */}
        {isOccupied && hole.allocatedProcess && (
          <div
            style={{ height: `${usedPercent}%` }}
            className={`w-full transition-all duration-700 ease-out rounded-xl bg-gradient-to-t ${processGradient} text-white shadow-md p-2 flex flex-col justify-between relative overflow-hidden group`}
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between w-full">
              <span className="font-black text-xs sm:text-sm tracking-wide flex items-center gap-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <Cpu className="w-3.5 h-3.5 opacity-90 shrink-0" />
                {hole.allocatedProcess.name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shrink-0" />
            </div>

            <div className="flex flex-col items-start mt-auto pt-1">
              <span className="font-mono font-black text-xs sm:text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] bg-black/25 px-1.5 py-0.5 rounded">
                {hole.usedSize} KB
              </span>
              {!compact && (
                <span className="text-[10px] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-0.5">
                  Terpakai {usedPercent.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Address Indicator / Status */}
      <div className="mt-2 text-center">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
            isOccupied
              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
          }`}
        >
          {isOccupied ? `Terisi: ${hole.allocatedProcess?.name}` : 'Tersedia'}
        </span>
      </div>
    </div>
  );
};
