import React from 'react';
import {
  Play,
  ArrowRight,
  Cpu,
  Layers,
  HardDrive,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { ThemeMode } from '../types/memory';

interface LandingPageProps {
  onStart: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none transition-colors duration-200">
      {/* 1. GLOWING AMBIENT GRADIENT WAVE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Orb 1 (Cyan / Gemini Blue) */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-indigo-500/15 blur-[120px] dark:blur-[140px] animate-pulse-slow" />

        {/* Glowing Orb 2 (Deep Violet / Indigo) */}
        <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-400/15 via-purple-500/20 to-blue-400/10 blur-[130px] dark:blur-[150px] animate-float-slow" />

        {/* Glowing Orb 3 (Bottom Center Ambient Wave) */}
        <div
          className="absolute -bottom-36 left-1/4 w-[750px] h-[450px] rounded-full bg-gradient-to-r from-blue-500/15 via-cyan-400/20 to-emerald-400/15 blur-[120px] dark:blur-[140px] animate-pulse-slow"
          style={{ animationDelay: '3s' }}
        />

        {/* Subtle dot matrix pattern */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Gentle flowing gradient wave lines */}
        <svg
          className="absolute bottom-0 left-0 w-full h-80 opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#wave-gradient)"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,117.3C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1A73E8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Bar with Theme Toggle */}
      <div className="relative z-20 flex items-center justify-between">
        {/* Semester & Subject Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">
            Sistem Operasi
          </span>
          <span className="text-slate-400">•</span>
          <span>Semester 3</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400 font-mono">
            Universitas Siliwangi
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>

      {/* 2. TOP-LEFT HEADER (JUDUL UTAMA & DESKRIPSI) */}
      <header className="relative z-10 max-w-3xl mt-4">
        {/* Main Title (Besar, Bold, Sangat Kontras) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] drop-shadow-xs">
          Memory Allocation <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Simulator
          </span>
        </h1>

        {/* Sub-deskripsi Ringkas */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
          Simulasi interaktif grafis untuk mempelajari algoritma alokasi memori dinamis:{' '}
          <strong className="text-slate-900 dark:text-white font-extrabold">
            First Fit
          </strong>
          ,{' '}
          <strong className="text-slate-900 dark:text-white font-extrabold">
            Best Fit
          </strong>
          , dan{' '}
          <strong className="text-slate-900 dark:text-white font-extrabold">
            Worst Fit
          </strong>
          . Analisis fragmentasi internal, efisiensi RAM, dan ekspor laporan PDF komparatif.
        </p>

        {/* Tombol Utama "Mulai" */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-blue-400/30"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span>Mulai Simulasi</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            *Memulai simulator dalam kondisi data bersih (Clean Initial State)
          </span>
        </div>
      </header>

      {/* 3. ALGORITHM PREVIEW CARDS (CENTER/BOTTOM) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 my-6 max-w-5xl">
        {/* Card 1: First Fit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-slate-700 transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-extrabold text-xs">
              01
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              First Fit
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Mengalokasikan proses ke blok kosong pertama yang muat. Cepat dan efisien dalam pencarian waktu, namun berpotensi meninggalkan fragmentasi di awal memori.
          </p>
        </div>

        {/* Card 2: Best Fit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-slate-700 transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 flex items-center justify-center font-extrabold text-xs">
              02
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Best Fit
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Mengalokasikan proses ke blok kosong dengan ukuran terkecil yang cukup. Menekan sisa ruang pada blok terpilih untuk meminimalkan fragmentasi internal.
          </p>
        </div>

        {/* Card 3: Worst Fit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-slate-700 transition-all duration-300 group">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-extrabold text-xs">
              03
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Worst Fit
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Mengalokasikan proses ke blok kosong terbesar yang muat. Bertujuan meninggalkan sisa ruang yang cukup besar agar kelak dapat digunakan oleh proses lain.
          </p>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Universitas Siliwangi • Program Studi Teknik Informatika</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clean State Memory
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            PDF Export Ready
          </span>
        </div>
      </footer>
    </div>
  );
};
