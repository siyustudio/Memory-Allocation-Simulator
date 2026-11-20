import type {
  Algorithm,
  ComparisonResult,
  Difficulty,
  MemoryBlock,
  MemoryProcess,
  ProcessAllocationResult,
  QuizItem,
  SimulationMetrics,
  SimulationRunResult,
  SimulationStep,
} from "./types";

export const defaultBlocks: MemoryBlock[] = [
  { id: "A", name: "Block A", capacity: null },
  { id: "B", name: "Block B", capacity: null },
  { id: "C", name: "Block C", capacity: null },
  { id: "D", name: "Block D", capacity: null },
];

export const defaultProcesses: MemoryProcess[] = [
  { id: "P1", name: "P1", size: null, colorIndex: 0 },
  { id: "P2", name: "P2", size: null, colorIndex: 1 },
  { id: "P3", name: "P3", size: null, colorIndex: 2 },
  { id: "P4", name: "P4", size: null, colorIndex: 3 },
];

export const exampleBlocks: MemoryBlock[] = [
  { id: "A", name: "Block A", capacity: 100 },
  { id: "B", name: "Block B", capacity: 200 },
  { id: "C", name: "Block C", capacity: 300 },
  { id: "D", name: "Block D", capacity: 400 },
];

export const exampleProcesses: MemoryProcess[] = [
  { id: "P1", name: "P1", size: 90, colorIndex: 0 },
  { id: "P2", name: "P2", size: 150, colorIndex: 1 },
  { id: "P3", name: "P3", size: 250, colorIndex: 2 },
  { id: "P4", name: "P4", size: 350, colorIndex: 3 },
];

export const algorithmLabels: Record<Algorithm, string> = {
  first: "First Fit",
  best: "Best Fit",
  worst: "Worst Fit",
};

export function isConfigurationValid(blocks: MemoryBlock[], processes: MemoryProcess[]) {
  return (
    blocks.length > 0 &&
    processes.length > 0 &&
    blocks.every(
      (block) =>
        typeof block.capacity === "number" && Number.isFinite(block.capacity) && block.capacity > 0,
    ) &&
    processes.every(
      (process) =>
        typeof process.size === "number" && Number.isFinite(process.size) && process.size > 0,
    )
  );
}

export function simulateFixedPartition(
  blocks: MemoryBlock[],
  processes: MemoryProcess[],
  algorithm: Algorithm,
): SimulationRunResult {
  if (!isConfigurationValid(blocks, processes)) {
    return {
      algorithm,
      allocations: [],
      metrics: {
        successCount: 0,
        failCount: 0,
        totalAllocatedMem: 0,
        totalInternalFrag: 0,
        blocksUsed: 0,
        totalBlocks: blocks.length,
        efficiency: 0,
        successRate: 0,
      },
    };
  }

  const occupiedBlockIds = new Set<string>();
  const allocations: ProcessAllocationResult[] = [];

  for (const process of processes) {
    const available = blocks.filter(
      (b) => !occupiedBlockIds.has(b.id) && b.capacity! >= process.size!,
    );

    if (!available.length) {
      allocations.push({
        process,
        block: null,
        remainder: null,
        status: "failed",
        explanation: `Tidak ada blok memori kosong yang memiliki kapasitas cukup untuk menampung ${process.name} (${process.size} KB).`,
      });
      continue;
    }

    let chosen: MemoryBlock;
    if (algorithm === "first") {
      chosen = available[0];
    } else if (algorithm === "best") {
      chosen = available.reduce((min, b) => (b.capacity! < min.capacity! ? b : min));
    } else {
      chosen = available.reduce((max, b) => (b.capacity! > max.capacity! ? b : max));
    }

    occupiedBlockIds.add(chosen.id);
    const remainder = chosen.capacity! - process.size!;
    const algoName = algorithmLabels[algorithm];

    allocations.push({
      process,
      block: chosen,
      remainder,
      status: "allocated",
      explanation: `${algoName} memilih ${chosen.name} (${chosen.capacity} KB) untuk ${process.name} (${process.size} KB). Sisa internal fragmentation: ${remainder} KB.`,
    });
  }

  const allocated = allocations.filter((a) => a.status === "allocated");
  const failed = allocations.filter((a) => a.status === "failed");
  const totalAllocatedMem = allocated.reduce((sum, a) => sum + a.process.size!, 0);
  const totalInternalFrag = allocated.reduce((sum, a) => sum + (a.remainder ?? 0), 0);
  const totalBlockCapUsed = allocated.reduce((sum, a) => sum + (a.block?.capacity ?? 0), 0);
  const efficiency =
    totalBlockCapUsed > 0 ? Math.round((totalAllocatedMem / totalBlockCapUsed) * 1000) / 10 : 0;
  const successRate =
    processes.length > 0 ? Math.round((allocated.length / processes.length) * 1000) / 10 : 0;

  const metrics: SimulationMetrics = {
    successCount: allocated.length,
    failCount: failed.length,
    totalAllocatedMem,
    totalInternalFrag,
    blocksUsed: allocated.length,
    totalBlocks: blocks.length,
    efficiency,
    successRate,
  };

  return {
    algorithm,
    allocations,
    metrics,
  };
}

export function generateSimulationSteps(
  blocks: MemoryBlock[],
  processes: MemoryProcess[],
  algorithm: Algorithm,
): SimulationStep[] {
  if (!isConfigurationValid(blocks, processes)) {
    return [
      {
        stepIndex: 0,
        totalSteps: processes.length,
        activeProcessIndex: null,
        checkingBlockId: null,
        allocatedBlockId: null,
        failedProcessId: null,
        allocationsSoFar: [],
        failedSoFar: [],
        logMessage:
          "Lengkapi seluruh kapasitas blok dan kebutuhan memori proses dengan angka lebih dari 0 KB sebelum menjalankan simulasi.",
        isFinished: false,
      },
    ];
  }
  const steps: SimulationStep[] = [];
  const run = simulateFixedPartition(blocks, processes, algorithm);
  const algoName = algorithmLabels[algorithm];

  // Step 0: Ready state
  steps.push({
    stepIndex: 0,
    totalSteps: processes.length,
    activeProcessIndex: null,
    checkingBlockId: null,
    allocatedBlockId: null,
    failedProcessId: null,
    allocationsSoFar: [],
    failedSoFar: [],
    logMessage: `Simulasi ${algoName} siap. Semua ${blocks.length} blok memori masih kosong. Klik 'Langkah Berikutnya' atau 'Jalankan Otomatis'.`,
    isFinished: false,
  });

  for (let i = 0; i < processes.length; i++) {
    const result = run.allocations[i];
    const allocationsSoFar = run.allocations
      .slice(0, i + 1)
      .filter((a) => a.status === "allocated")
      .map((a) => ({
        process: a.process,
        block: a.block!,
        remainder: a.remainder!,
      }));
    const failedSoFar = run.allocations
      .slice(0, i + 1)
      .filter((a) => a.status === "failed")
      .map((a) => a.process);

    let logMessage = "";
    if (result.status === "allocated") {
      logMessage = `${algoName} memeriksa blok memori yang tersedia. Kapasitas ${result.block!.name} (${result.block!.capacity} KB) mencukupi untuk ${result.process.name} (${result.process.size} KB). ${result.process.name} berhasil dialokasikan ke ${result.block!.name} (sisa: ${result.remainder} KB).`;
    } else {
      logMessage = `${algoName} memeriksa blok memori kosong. Tidak ditemukan blok kosong yang kapasitasnya cukup untuk ${result.process.name} (${result.process.size} KB). ${result.process.name} gagal dialokasikan.`;
    }

    steps.push({
      stepIndex: i + 1,
      totalSteps: processes.length,
      activeProcessIndex: i,
      checkingBlockId: result.block ? result.block.id : null,
      allocatedBlockId: result.block ? result.block.id : null,
      failedProcessId: result.status === "failed" ? result.process.id : null,
      allocationsSoFar,
      failedSoFar,
      logMessage,
      isFinished: i + 1 === processes.length,
    });
  }

  return steps;
}

export function compareAlgorithms(
  blocks: MemoryBlock[],
  processes: MemoryProcess[],
): ComparisonResult {
  return {
    blocks,
    processes,
    first: simulateFixedPartition(blocks, processes, "first"),
    best: simulateFixedPartition(blocks, processes, "best"),
    worst: simulateFixedPartition(blocks, processes, "worst"),
  };
}

/* Quiz helper functions preserved from the previous implementation */
export function calculateExpected(blocks: number[], size: number, algorithm: Algorithm): number {
  const candidates = blocks
    .map((capacity, index) => ({ capacity, index }))
    .filter(({ capacity }) => capacity >= size);

  if (!candidates.length) return 0;
  if (algorithm === "first") return candidates[0].index;
  if (algorithm === "best") {
    return candidates.reduce((best, curr) => (curr.capacity < best.capacity ? curr : best)).index;
  }
  return candidates.reduce((worst, curr) => (curr.capacity > worst.capacity ? curr : worst)).index;
}

export function generateQuizQuestions(difficulty: Difficulty, algorithm: Algorithm): QuizItem[] {
  const configs = {
    easy: { processMin: 120, processMax: 300, step: 20 },
    medium: { processMin: 100, processMax: 450, step: 10 },
    hard: { processMin: 80, processMax: 600, step: 5 },
  }[difficulty];

  const questions: QuizItem[] = [];

  for (let q = 0; q < 5; q++) {
    const pSize =
      Math.floor(Math.random() * ((configs.processMax - configs.processMin) / configs.step)) *
        configs.step +
      configs.processMin;

    const used = new Set<number>();
    const blocks: number[] = [];

    const smallCount = Math.random() > 0.5 ? 2 : 1;
    let attempts = 0;
    while (blocks.length < smallCount && attempts < 100) {
      attempts++;
      const diff = (Math.floor(Math.random() * 5) + 1) * configs.step;
      const cap = Math.max(40, pSize - diff);
      if (!used.has(cap) && cap < pSize) {
        used.add(cap);
        blocks.push(cap);
      }
    }

    attempts = 0;
    while (blocks.length < 4 && attempts < 100) {
      attempts++;
      const diff = (Math.floor(Math.random() * 12) + 1) * configs.step;
      const cap = pSize + diff;
      if (!used.has(cap)) {
        used.add(cap);
        blocks.push(cap);
      }
    }

    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }

    const expected = calculateExpected(blocks, pSize, algorithm);
    questions.push({
      id: q,
      processSize: pSize,
      blocks,
      expected,
    });
  }

  return questions;
}

export function buildExplanation(
  blocks: number[],
  processSize: number,
  algorithm: Algorithm,
  choice: number,
  expected: number,
) {
  const correctLetter = String.fromCharCode(65 + expected);
  const correctCap = blocks[expected];
  const remainder = correctCap - processSize;

  const algoRule =
    algorithm === "first"
      ? `Algoritma First Fit menelusuri slot secara berurutan (A -> B -> C -> D) dan memilih slot pertama yang kapasitasnya cukup. Slot ${correctLetter} (${correctCap} KB) adalah slot pertama yang muat untuk proses ${processSize} KB.`
      : algorithm === "best"
        ? `Algoritma Best Fit mencari slot yang kapasitasnya cukup dengan sisa ruang terkecil. Slot ${correctLetter} (${correctCap} KB) menyisakan ruang paling sedikit, yaitu ${remainder} KB.`
        : `Algoritma Worst Fit mencari slot yang kapasitasnya cukup dengan sisa ruang terbesar. Slot ${correctLetter} (${correctCap} KB) menyisakan ruang paling besar, yaitu ${remainder} KB.`;

  let userEvaluation = "";
  if (choice !== expected) {
    const userLetter = String.fromCharCode(65 + choice);
    const userCap = blocks[choice];
    if (userCap < processSize) {
      userEvaluation = ` Kamu memilih Slot ${userLetter} (${userCap} KB), namun kapasitasnya tidak cukup untuk menampung proses berukuran ${processSize} KB.`;
    } else {
      userEvaluation = ` Kamu memilih Slot ${userLetter} (${userCap} KB). Walaupun kapasitasnya cukup, aturan ${algorithmLabels[algorithm]} menentukan bahwa Slot ${correctLetter} adalah pilihan yang lebih tepat.`;
    }
  }

  return `${algoRule}${userEvaluation}`;
}
