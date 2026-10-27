import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AlgorithmType,
  AllocationResult,
  ExecutionStep,
  Hole,
  Process,
} from '../types/memory';

const ALGO_NAMES: Record<AlgorithmType, string> = {
  'first-fit': 'First Fit',
  'best-fit': 'Best Fit',
  'worst-fit': 'Worst Fit',
};

const ALGO_DESCRIPTIONS: Record<AlgorithmType, string> = {
  'first-fit': 'Mengalokasikan proses ke blok memori kosong pertama yang muat.',
  'best-fit': 'Mengalokasikan proses ke blok memori kosong terkecil yang muat (meminimalkan fragmentasi internal).',
  'worst-fit': 'Mengalokasikan proses ke blok memori kosong terbesar yang muat (meninggalkan sisa blok terbesar).',
};

/**
 * Format current date in Indonesian format
 */
function getFormattedDateTime(): string {
  const now = new Date();
  return now.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Export Single Algorithm Report (for Tab View)
 */
export function exportSingleAlgorithmPDF(
  algorithm: AlgorithmType,
  currentStep: ExecutionStep,
  holes: Hole[],
  processes: Process[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const metrics = currentStep.metrics;
  const testDate = getFormattedDateTime();

  // Header Background Banner
  doc.setFillColor(13, 14, 18); // #0D0E12
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line (Gemini Blue)
  doc.setFillColor(26, 115, 232); // #1A73E8
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MEMORY ALLOCATION SIMULATOR REPORT', 14, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(196, 198, 208); // #C4C6D0
  doc.text('Laporan Hasil Simulasi Alokasi Memori (Sistem Operasi)', 14, 24);

  // Metadata in Header (Right aligned)
  doc.setFontSize(8);
  doc.setTextColor(227, 226, 230);
  doc.text(`Waktu Pengujian: ${testDate}`, pageWidth - 14, 32, { align: 'right' });

  // Section 1: Algoritma & Konfigurasi
  let currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`1. Konfigurasi Algoritma: ${ALGO_NAMES[algorithm]}`, 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Prinsip Kerja: ${ALGO_DESCRIPTIONS[algorithm]}`, 14, currentY);

  // Summary Metrics Table
  currentY += 6;
  const metricsData = [
    [
      'Total Kapasitas RAM',
      `${metrics.totalCapacity} KB`,
      'Memori Terpakai',
      `${metrics.totalUsed} KB (${metrics.usedPercentage}%)`,
    ],
    [
      'Sisa Memori Kosong',
      `${metrics.totalFree} KB (${metrics.freePercentage}%)`,
      'Fragmentasi Internal',
      `${metrics.internalFragmentation} KB`,
    ],
    [
      'Total Proses Masuk',
      `${metrics.totalProcesses} Proses`,
      'Proses Berhasil',
      `${metrics.allocatedCount} Proses`,
    ],
    [
      'Proses Gagal Dialokasikan',
      `${metrics.failedCount} Proses`,
      'Efisiensi Alokasi',
      `${metrics.efficiencyPercentage}%`,
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Parameter', 'Nilai', 'Parameter', 'Nilai']],
    body: metricsData,
    headStyles: {
      fillColor: [26, 115, 232],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Section 2: Status Blok Memori (Holes)
  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Status Akhir Blok Memori (Holes)', 14, currentY);

  currentY += 4;
  const holesTableData = currentStep.holesState.map((h, idx) => {
    const isOccupied = h.allocatedProcess !== null;
    return [
      `${idx + 1}`,
      h.name,
      `${h.size} KB`,
      isOccupied ? `${h.allocatedProcess?.name}` : '-',
      isOccupied ? `${h.usedSize} KB` : '0 KB',
      isOccupied ? `${h.remainingSize} KB` : `${h.size} KB`,
      isOccupied ? 'Terisi (Occupied)' : 'Kosong (Free)',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [[
      'No',
      'Nama Blok',
      'Kapasitas',
      'Proses',
      'Terpakai',
      'Frag. Internal / Sisa',
      'Status',
    ]],
    body: holesTableData.length > 0 ? holesTableData : [['-', 'Tidak ada blok', '-', '-', '-', '-', '-']],
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      6: { fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 3: Antrean Proses & Hasil Alokasi
  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Rincian Alokasi Antrean Proses', 14, currentY);

  currentY += 4;
  const processesTableData = processes.map((p, idx) => {
    const alloc = currentStep.allocatedProcesses.find((a) => a.process.id === p.id);
    const isFailed = currentStep.failedProcesses.some((f) => f.id === p.id);
    return [
      `${idx + 1}`,
      p.name,
      `${p.size} KB`,
      alloc ? alloc.holeName : '-',
      alloc ? 'BERHASIL' : isFailed ? 'GAGAL (TIDAK MUAT)' : 'PENDING',
      alloc ? 'Dialokasikan ke blok yang sesuai' : 'Tidak ada blok kosong yang cukup',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['No', 'Nama Proses', 'Ukuran', 'Alokasi Blok', 'Status Alokasi', 'Keterangan']],
    body: processesTableData.length > 0 ? processesTableData : [['-', 'Tidak ada proses', '-', '-', '-', '-']],
    headStyles: {
      fillColor: [26, 115, 232],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      4: { fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 4: Catatan Kegagalan (jika ada)
  if (currentStep.failedProcesses.length > 0) {
    currentY = (doc as any).lastAutoTable.finalY + 8;
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.roundedRect(14, currentY, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(220, 38, 38);
    doc.text('Peringatan: Terdapat Proses yang Gagal Dialokasikan (Memory Allocation Failed)', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(153, 27, 27);
    const failedNames = currentStep.failedProcesses.map((p) => `${p.name} (${p.size} KB)`).join(', ');
    doc.text(`Proses berikut tidak mendapatkan partisi memori: ${failedNames}.`, 18, currentY + 12);
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Memory Allocation Simulator • Universitas Siliwangi • Teknik Informatika',
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  // Save the PDF
  doc.save(`Memory_Report_${algorithm.toUpperCase()}_${Date.now()}.pdf`);
}

/**
 * Export 3 Algorithms Comparison Report (for Compare View)
 */
export function exportComparisonReportPDF(
  results: {
    'first-fit': AllocationResult;
    'best-fit': AllocationResult;
    'worst-fit': AllocationResult;
  },
  holes: Hole[],
  processes: Process[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const testDate = getFormattedDateTime();

  // Header Background Banner
  doc.setFillColor(13, 14, 18); // #0D0E12
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Cyan-Blue gradient style)
  doc.setFillColor(56, 189, 248); // #38BDF8
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('MEMORY ALLOCATION COMPARATIVE REPORT', 14, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(196, 198, 208);
  doc.text('Analisis Komparatif Algoritma: First Fit vs Best Fit vs Worst Fit', 14, 24);

  // Metadata
  doc.setFontSize(8);
  doc.setTextColor(227, 226, 230);
  doc.text(`Waktu Pengujian: ${testDate}`, pageWidth - 14, 34, { align: 'right' });

  let currentY = 52;

  // Determine Optimal Winner
  const algos = [
    { id: 'first-fit' as const, name: 'First Fit', result: results['first-fit'] },
    { id: 'best-fit' as const, name: 'Best Fit', result: results['best-fit'] },
    { id: 'worst-fit' as const, name: 'Worst Fit', result: results['worst-fit'] },
  ];

  const minFailed = Math.min(...algos.map((a) => a.result.metrics.failedCount));
  const candidateWinners = algos.filter((a) => a.result.metrics.failedCount === minFailed);
  const minFragmentation = Math.min(
    ...candidateWinners.map((a) => a.result.metrics.internalFragmentation)
  );
  const winner = candidateWinners.find(
    (a) => a.result.metrics.internalFragmentation === minFragmentation
  ) || algos[0];

  // Winner Announcement Banner
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(56, 189, 248);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(3, 105, 161);
  doc.text(`HASIL EVALUASI: Algoritma Paling Optimal adalah ${winner.name}`, 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Algoritma ${winner.name} menghasilkan ${winner.result.metrics.failedCount} proses gagal dan fragmentasi internal terendah sebesar ${winner.result.metrics.internalFragmentation} KB dengan tingkat efisiensi alokasi ${winner.result.metrics.efficiencyPercentage}%.`,
    18,
    currentY + 14,
    { maxWidth: pageWidth - 36 }
  );

  currentY += 28;

  // Table 1: Head-to-Head Metric Comparison
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Tabel Perbandingan Metrik Kinerja (Head-to-Head)', 14, currentY);

  currentY += 4;
  const ffMetrics = results['first-fit'].metrics;
  const bfMetrics = results['best-fit'].metrics;
  const wfMetrics = results['worst-fit'].metrics;

  const comparisonRows = [
    [
      'Total Memori Terpakai',
      `${ffMetrics.totalUsed} KB (${ffMetrics.usedPercentage}%)`,
      `${bfMetrics.totalUsed} KB (${bfMetrics.usedPercentage}%)`,
      `${wfMetrics.totalUsed} KB (${wfMetrics.usedPercentage}%)`,
    ],
    [
      'Sisa Ruang Kosong',
      `${ffMetrics.totalFree} KB (${ffMetrics.freePercentage}%)`,
      `${bfMetrics.totalFree} KB (${bfMetrics.freePercentage}%)`,
      `${wfMetrics.totalFree} KB (${wfMetrics.freePercentage}%)`,
    ],
    [
      'Total Fragmentasi Internal',
      `${ffMetrics.internalFragmentation} KB`,
      `${bfMetrics.internalFragmentation} KB`,
      `${wfMetrics.internalFragmentation} KB`,
    ],
    [
      'Proses Berhasil Masuk',
      `${ffMetrics.allocatedCount} dari ${ffMetrics.totalProcesses}`,
      `${bfMetrics.allocatedCount} dari ${bfMetrics.totalProcesses}`,
      `${wfMetrics.allocatedCount} dari ${wfMetrics.totalProcesses}`,
    ],
    [
      'Proses Gagal Dialokasikan',
      `${ffMetrics.failedCount} Proses`,
      `${bfMetrics.failedCount} Proses`,
      `${wfMetrics.failedCount} Proses`,
    ],
    [
      'Tingkat Efisiensi Alokasi',
      `${ffMetrics.efficiencyPercentage}%`,
      `${bfMetrics.efficiencyPercentage}%`,
      `${wfMetrics.efficiencyPercentage}%`,
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Indikator Kinerja', 'First Fit', 'Best Fit', 'Worst Fit']],
    body: comparisonRows,
    headStyles: {
      fillColor: [26, 115, 232],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Table 2: Alokasi Setiap Blok per Algoritma
  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Pemetaan Penempatan Blok Memori (Holes Allocation)', 14, currentY);

  currentY += 4;
  const blockMappingRows = holes.map((h, idx) => {
    const ffHole = results['first-fit'].finalHoles.find((x) => x.id === h.id);
    const bfHole = results['best-fit'].finalHoles.find((x) => x.id === h.id);
    const wfHole = results['worst-fit'].finalHoles.find((x) => x.id === h.id);

    return [
      `${idx + 1}. ${h.name} (${h.size}K)`,
      ffHole?.allocatedProcess ? `${ffHole.allocatedProcess.name} (${ffHole.usedSize}K)` : 'KOSONG',
      bfHole?.allocatedProcess ? `${bfHole.allocatedProcess.name} (${bfHole.usedSize}K)` : 'KOSONG',
      wfHole?.allocatedProcess ? `${wfHole.allocatedProcess.name} (${wfHole.usedSize}K)` : 'KOSONG',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Blok Memori (Hole)', 'Alokasi First Fit', 'Alokasi Best Fit', 'Alokasi Worst Fit']],
    body: blockMappingRows.length > 0 ? blockMappingRows : [['-', 'Tidak ada blok', '-', '-']],
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Table 3: Ringkasan Proses Gagal
  currentY = (doc as any).lastAutoTable.finalY + 10;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Rincian Proses Gagal (Unallocated Processes)', 14, currentY);

  currentY += 4;
  const failedSummaryRows = [
    [
      'First Fit',
      `${results['first-fit'].failedProcesses.length} Proses`,
      results['first-fit'].failedProcesses.map((p) => `${p.name} (${p.size}K)`).join(', ') || 'Nihil (Semua Masuk)',
    ],
    [
      'Best Fit',
      `${results['best-fit'].failedProcesses.length} Proses`,
      results['best-fit'].failedProcesses.map((p) => `${p.name} (${p.size}K)`).join(', ') || 'Nihil (Semua Masuk)',
    ],
    [
      'Worst Fit',
      `${results['worst-fit'].failedProcesses.length} Proses`,
      results['worst-fit'].failedProcesses.map((p) => `${p.name} (${p.size}K)`).join(', ') || 'Nihil (Semua Masuk)',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Algoritma', 'Jumlah Gagal', 'Daftar Proses Gagal']],
    body: failedSummaryRows,
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [254, 242, 242],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 30, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Memory Allocation Simulator • Universitas Siliwangi • Teknik Informatika',
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  // Save the PDF
  doc.save(`Memory_Comparison_Report_${Date.now()}.pdf`);
}
