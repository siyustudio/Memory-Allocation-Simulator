import {
  AlgorithmType,
  AllocationResult,
  ExecutionStep,
  Hole,
  MemoryMetrics,
  Process,
} from '../types/memory';

/**
 * Deep clone array of holes to preserve immutability in simulation history
 */
export function cloneHoles(holes: Hole[]): Hole[] {
  return holes.map((h) => ({
    ...h,
    allocatedProcess: h.allocatedProcess ? { ...h.allocatedProcess } : null,
  }));
}

/**
 * Calculate system memory metrics given current holes state and failed processes
 */
export function calculateMetrics(
  holes: Hole[],
  failedProcesses: Process[],
  totalProcessesCount: number
): MemoryMetrics {
  const totalCapacity = holes.reduce((acc, h) => acc + h.size, 0);
  const totalUsed = holes.reduce((acc, h) => acc + h.usedSize, 0);
  const totalFree = holes.reduce((acc, h) => acc + h.remainingSize, 0);

  // Internal fragmentation: unused space inside partitions that currently hold a process
  const internalFragmentation = holes.reduce((acc, h) => {
    return h.allocatedProcess ? acc + h.remainingSize : acc;
  }, 0);

  const usedPercentage = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;
  const freePercentage = totalCapacity > 0 ? (totalFree / totalCapacity) * 100 : 0;
  
  // Memory efficiency: ratio of memory used by processes over total memory of occupied partitions
  const occupiedHolesCapacity = holes.reduce(
    (acc, h) => (h.allocatedProcess ? acc + h.size : acc),
    0
  );
  const efficiencyPercentage =
    occupiedHolesCapacity > 0
      ? (totalUsed / occupiedHolesCapacity) * 100
      : totalCapacity > 0 && totalUsed > 0
      ? (totalUsed / totalCapacity) * 100
      : 100;

  const allocatedCount = holes.filter((h) => h.allocatedProcess !== null).length;
  const failedCount = failedProcesses.length;

  return {
    totalCapacity,
    totalUsed,
    totalFree,
    usedPercentage: Number(usedPercentage.toFixed(1)),
    freePercentage: Number(freePercentage.toFixed(1)),
    internalFragmentation,
    efficiencyPercentage: Number(efficiencyPercentage.toFixed(1)),
    allocatedCount,
    failedCount,
    totalProcesses: totalProcessesCount,
  };
}

/**
 * First Fit Algorithm Simulation
 * Allocates process to the FIRST hole that is empty and has size >= process.size
 */
export function runFirstFit(initialHoles: Hole[], processes: Process[]): ExecutionStep[] {
  return generateAlgorithmSteps('first-fit', initialHoles, processes);
}

/**
 * Best Fit Algorithm Simulation
 * Allocates process to the SMALLEST empty hole that fits (minimizing internal fragmentation)
 */
export function runBestFit(initialHoles: Hole[], processes: Process[]): ExecutionStep[] {
  return generateAlgorithmSteps('best-fit', initialHoles, processes);
}

/**
 * Worst Fit Algorithm Simulation
 * Allocates process to the LARGEST empty hole that fits (leaving the biggest remaining fragment)
 */
export function runWorstFit(initialHoles: Hole[], processes: Process[]): ExecutionStep[] {
  return generateAlgorithmSteps('worst-fit', initialHoles, processes);
}

/**
 * Core Step Generator for Any Algorithm
 */
export function generateAlgorithmSteps(
  algorithm: AlgorithmType,
  initialHoles: Hole[],
  processes: Process[]
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  
  // Clean initial holes: ensure they start empty
  let currentHoles: Hole[] = initialHoles.map((h, index) => ({
    id: h.id || `hole-${index + 1}`,
    name: h.name || `Blok ${index + 1}`,
    size: h.size,
    baseAddress: h.baseAddress,
    allocatedProcess: null,
    usedSize: 0,
    remainingSize: h.size,
  }));

  const allocatedList: { process: Process; holeId: string; holeName: string }[] = [];
  const failedList: Process[] = [];

  // Step 0: Initial State
  const initialMetrics = calculateMetrics(currentHoles, failedList, processes.length);
  steps.push({
    stepNumber: 0,
    process: null,
    action: 'start',
    targetHoleId: null,
    description: `Kondisi Awal: RAM memiliki ${currentHoles.length} blok memori kosong (Total: ${initialMetrics.totalCapacity} KB). Antrean: ${processes.length} proses.`,
    holesState: cloneHoles(currentHoles),
    allocatedProcesses: [...allocatedList],
    failedProcesses: [...failedList],
    metrics: initialMetrics,
  });

  // Iterate processes
  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];
    let selectedHoleIndex = -1;

    if (algorithm === 'first-fit') {
      // First empty hole with size >= process.size
      for (let j = 0; j < currentHoles.length; j++) {
        if (!currentHoles[j].allocatedProcess && currentHoles[j].size >= process.size) {
          selectedHoleIndex = j;
          break;
        }
      }
    } else if (algorithm === 'best-fit') {
      // Empty hole with minimal size that still fits
      let minDifference = Infinity;
      for (let j = 0; j < currentHoles.length; j++) {
        if (!currentHoles[j].allocatedProcess && currentHoles[j].size >= process.size) {
          const diff = currentHoles[j].size - process.size;
          if (diff < minDifference) {
            minDifference = diff;
            selectedHoleIndex = j;
          }
        }
      }
    } else if (algorithm === 'worst-fit') {
      // Empty hole with maximal size that fits
      let maxDifference = -1;
      for (let j = 0; j < currentHoles.length; j++) {
        if (!currentHoles[j].allocatedProcess && currentHoles[j].size >= process.size) {
          const diff = currentHoles[j].size - process.size;
          if (diff > maxDifference) {
            maxDifference = diff;
            selectedHoleIndex = j;
          }
        }
      }
    }

    if (selectedHoleIndex !== -1) {
      // Allocation successful
      const targetHole = currentHoles[selectedHoleIndex];
      const remaining = targetHole.size - process.size;

      currentHoles = currentHoles.map((h, idx) => {
        if (idx === selectedHoleIndex) {
          return {
            ...h,
            allocatedProcess: { ...process },
            usedSize: process.size,
            remainingSize: remaining,
          };
        }
        return h;
      });

      allocatedList.push({
        process: { ...process },
        holeId: targetHole.id,
        holeName: targetHole.name,
      });

      const algoLabel =
        algorithm === 'first-fit'
          ? 'First Fit (blok kosong pertama yang muat)'
          : algorithm === 'best-fit'
          ? 'Best Fit (blok kosong terkecil yang muat)'
          : 'Worst Fit (blok kosong terbesar yang muat)';

      const currentMetrics = calculateMetrics(currentHoles, failedList, processes.length);

      steps.push({
        stepNumber: steps.length,
        process: { ...process },
        action: 'allocated',
        targetHoleId: targetHole.id,
        description: `Proses ${process.name} (${process.size} KB) dialokasikan ke ${targetHole.name} (${targetHole.size} KB) via ${algoLabel}. Sisa fragmentasi internal: ${remaining} KB.`,
        holesState: cloneHoles(currentHoles),
        allocatedProcesses: [...allocatedList],
        failedProcesses: [...failedList],
        metrics: currentMetrics,
      });
    } else {
      // Allocation failed (no fitting empty hole)
      failedList.push({ ...process });
      const currentMetrics = calculateMetrics(currentHoles, failedList, processes.length);

      steps.push({
        stepNumber: steps.length,
        process: { ...process },
        action: 'failed',
        targetHoleId: null,
        description: `Alokasi Gagal: Proses ${process.name} (${process.size} KB) tidak dapat ditempatkan karena tidak ada blok kosong yang mencukupi.`,
        holesState: cloneHoles(currentHoles),
        allocatedProcesses: [...allocatedList],
        failedProcesses: [...failedList],
        metrics: currentMetrics,
      });
    }
  }

  // Final summary step
  const finalMetrics = calculateMetrics(currentHoles, failedList, processes.length);
  steps.push({
    stepNumber: steps.length,
    process: null,
    action: 'completed',
    targetHoleId: null,
    description: `Simulasi Selesai: ${allocatedList.length} dari ${processes.length} proses berhasil dialokasikan (${finalMetrics.usedPercentage}% memori terpakai, ${failedList.length} proses gagal).`,
    holesState: cloneHoles(currentHoles),
    allocatedProcesses: [...allocatedList],
    failedProcesses: [...failedList],
    metrics: finalMetrics,
  });

  return steps;
}

/**
 * Generates full AllocationResult object for an algorithm
 */
export function simulateAllocation(
  algorithm: AlgorithmType,
  holes: Hole[],
  processes: Process[]
): AllocationResult {
  const steps = generateAlgorithmSteps(algorithm, holes, processes);
  const finalStep = steps[steps.length - 1];

  return {
    algorithm,
    steps,
    finalHoles: finalStep.holesState,
    allocatedProcesses: finalStep.allocatedProcesses,
    failedProcesses: finalStep.failedProcesses,
    metrics: finalStep.metrics,
  };
}

/**
 * Generates simulation for all 3 algorithms for side-by-side comparison
 */
export function simulateAllAlgorithms(
  holes: Hole[],
  processes: Process[]
): Record<AlgorithmType, AllocationResult> {
  return {
    'first-fit': simulateAllocation('first-fit', holes, processes),
    'best-fit': simulateAllocation('best-fit', holes, processes),
    'worst-fit': simulateAllocation('worst-fit', holes, processes),
  };
}

/**
 * Standard Presets for Educational Demonstrations
 */
export const PRESETS = [
  {
    name: 'Buku Silberschatz (Klasik)',
    description: 'Contoh standar buku Operating System Concepts (Holes: 100, 500, 200, 300, 600 KB; Proses: 212, 417, 112, 426 KB)',
    holes: [
      { id: 'h1', name: 'Blok 1', size: 100, allocatedProcess: null, usedSize: 0, remainingSize: 100 },
      { id: 'h2', name: 'Blok 2', size: 500, allocatedProcess: null, usedSize: 0, remainingSize: 500 },
      { id: 'h3', name: 'Blok 3', size: 200, allocatedProcess: null, usedSize: 0, remainingSize: 200 },
      { id: 'h4', name: 'Blok 4', size: 300, allocatedProcess: null, usedSize: 0, remainingSize: 300 },
      { id: 'h5', name: 'Blok 5', size: 600, allocatedProcess: null, usedSize: 0, remainingSize: 600 },
    ],
    processes: [
      { id: 'p1', name: 'P1', size: 212, color: 'from-emerald-500 to-teal-600' },
      { id: 'p2', name: 'P2', size: 417, color: 'from-blue-500 to-indigo-600' },
      { id: 'p3', name: 'P3', size: 112, color: 'from-purple-500 to-fuchsia-600' },
      { id: 'p4', name: 'P4', size: 426, color: 'from-amber-500 to-orange-600' },
    ],
  },
  {
    name: 'Partisi Merata (Equal Sized)',
    description: 'Blok memori berukuran sama 256 KB dengan variasi ukuran proses',
    holes: [
      { id: 'h1', name: 'Blok 1', size: 256, allocatedProcess: null, usedSize: 0, remainingSize: 256 },
      { id: 'h2', name: 'Blok 2', size: 256, allocatedProcess: null, usedSize: 0, remainingSize: 256 },
      { id: 'h3', name: 'Blok 3', size: 256, allocatedProcess: null, usedSize: 0, remainingSize: 256 },
      { id: 'h4', name: 'Blok 4', size: 256, allocatedProcess: null, usedSize: 0, remainingSize: 256 },
    ],
    processes: [
      { id: 'p1', name: 'P1', size: 80, color: 'from-cyan-500 to-blue-600' },
      { id: 'p2', name: 'P2', size: 220, color: 'from-emerald-500 to-teal-600' },
      { id: 'p3', name: 'P3', size: 130, color: 'from-indigo-500 to-violet-600' },
      { id: 'p4', name: 'P4', size: 270, color: 'from-rose-500 to-pink-600' },
    ],
  },
  {
    name: 'Kasus Beban Tinggi (High Contention)',
    description: 'Banyak proses berebut sedikit blok untuk menguji proses gagal',
    holes: [
      { id: 'h1', name: 'Blok 1', size: 150, allocatedProcess: null, usedSize: 0, remainingSize: 150 },
      { id: 'h2', name: 'Blok 2', size: 350, allocatedProcess: null, usedSize: 0, remainingSize: 350 },
      { id: 'h3', name: 'Blok 3', size: 200, allocatedProcess: null, usedSize: 0, remainingSize: 200 },
    ],
    processes: [
      { id: 'p1', name: 'P1', size: 180, color: 'from-emerald-500 to-teal-600' },
      { id: 'p2', name: 'P2', size: 300, color: 'from-blue-500 to-indigo-600' },
      { id: 'p3', name: 'P3', size: 120, color: 'from-purple-500 to-fuchsia-600' },
      { id: 'p4', name: 'P4', size: 400, color: 'from-rose-500 to-pink-600' },
      { id: 'p5', name: 'P5', size: 90, color: 'from-amber-500 to-orange-600' },
    ],
  },
];

export const PROCESS_PALETTES = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-fuchsia-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-lime-500 to-green-600',
  'from-teal-500 to-cyan-600',
];
