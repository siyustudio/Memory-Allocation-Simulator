import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Layers,
  Cpu,
  Sliders,
  Play,
  FileText,
  Sparkles,
} from 'lucide-react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TourModal: React.FC<TourModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Selamat Datang di Memory Allocation Simulator',
      subtitle: 'Panduan Singkat Penggunaan Aplikasi',
      icon: <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      content: (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Aplikasi ini dirancang untuk mensimulasikan algoritma alokasi memori komputer (*Contiguous Memory Allocation*) mata kuliah Sistem Operasi: <strong>First Fit</strong>, <strong>Best Fit</strong>, dan <strong>Worst Fit</strong>. Anda dapat melihat bagaimana proses menempati RAM dan menganalisis fragmentasi internal secara interaktif.
        </p>
      ),
    },
    {
      title: '1. Input Blok Memori (Holes) & Proses',
      subtitle: 'Kelola Data pada Sidebar Kiri',
      icon: <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      content: (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Gunakan formulir pada sidebar sebelah kiri untuk menambahkan <strong>Blok Memori Awal (Hole)</strong> dan <strong>Antrean Proses</strong> dengan memasukkan nama dan ukuran dalam satuan KB. Anda juga dapat menggunakan tombol <strong>Preset</strong> untuk memuat contoh soal klasik Silberschatz secara instan.
        </p>
      ),
    },
    {
      title: '2. Pemilihan Algoritma Alokasi',
      subtitle: 'First Fit vs Best Fit vs Worst Fit',
      icon: <Sliders className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
      content: (
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p>• <strong>First Fit:</strong> Mengalokasikan proses ke blok kosong pertama yang muat.</p>
          <p>• <strong>Best Fit:</strong> Mengalokasikan ke blok kosong terkecil yang muat (menekan fragmentasi internal).</p>
          <p>• <strong>Worst Fit:</strong> Mengalokasikan ke blok kosong terbesar yang muat.</p>
        </div>
      ),
    },
    {
      title: '3. Conveyor Belt & Playback Controller',
      subtitle: 'Pantau Antrean Proses & Jalankan Langkah Demi Langkah',
      icon: <Play className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      content: (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Amati <strong>Conveyor Belt Antrean Proses</strong> di atas canvas untuk melihat paket proses yang sedang dievaluasi. Gunakan tombol <strong>Play/Pause</strong>, <strong>Step Forward/Back</strong>, dan slider kecepatan animasi untuk mengamati transisi pengisian memori langkah demi langkah.
        </p>
      ),
    },
    {
      title: '4. Compare View & Ekspor Laporan PDF',
      subtitle: 'Bandingkan Performa & Unduh Hasil Pengujian',
      icon: <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      content: (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Gunakan tombol <strong>Compare View</strong> di header untuk melihat visualisasi perbandingan ketiga algoritma secara berdampingan. Anda dapat mengunduh laporan pengujian resmi dalam format <strong>PDF</strong> yang memuat tabel metrik lengkap dan evaluasi algoritma terbaik!
        </p>
      ),
    },
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Box */}
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-7 relative select-none transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            {step.icon}
          </div>
          <div className="pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Langkah {currentStep + 1} dari {tourSteps.length}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
              {step.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {step.subtitle}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-3 min-h-[100px] border-y border-slate-100 dark:border-slate-800 my-2">
          {step.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 mt-2">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-blue-600 dark:bg-blue-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Langkah ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Selesai' : 'Lanjut'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
