export type Page = "home" | "learn" | "simulation" | "comparison" | "setup" | "quiz" | "result";

export type Algorithm = "first" | "best" | "worst";
export type Difficulty = "easy" | "medium" | "hard";

export type MemoryBlock = {
  id: string;
  name: string;
  capacity: number | null;
};

export type MemoryProcess = {
  id: string;
  name: string;
  size: number | null;
  colorIndex: number;
};

export type BlockAllocation = {
  process: MemoryProcess;
  block: MemoryBlock;
  remainder: number;
};

export type ProcessAllocationResult = {
  process: MemoryProcess;
  block: MemoryBlock | null;
  remainder: number | null;
  status: "allocated" | "failed";
  explanation: string;
};

export type SimulationMetrics = {
  successCount: number;
  failCount: number;
  totalAllocatedMem: number;
  totalInternalFrag: number;
  blocksUsed: number;
  totalBlocks: number;
  efficiency: number; // percentage
  successRate: number; // percentage
};

export type SimulationRunResult = {
  algorithm: Algorithm;
  allocations: ProcessAllocationResult[];
  metrics: SimulationMetrics;
};

export type SimulationStep = {
  stepIndex: number;
  totalSteps: number;
  activeProcessIndex: number | null;
  checkingBlockId: string | null;
  allocatedBlockId: string | null;
  failedProcessId: string | null;
  allocationsSoFar: BlockAllocation[];
  failedSoFar: MemoryProcess[];
  logMessage: string;
  isFinished: boolean;
};

export type ComparisonResult = {
  blocks: MemoryBlock[];
  processes: MemoryProcess[];
  first: SimulationRunResult;
  best: SimulationRunResult;
  worst: SimulationRunResult;
};

export type QuizItem = {
  id: number;
  processSize: number;
  blocks: number[];
  expected: number;
};

export type AnswerRecord = {
  questionIndex: number;
  processSize: number;
  blocks: number[];
  choice: number;
  expected: number;
  correct: boolean;
  remainder: number;
};
