export type AlgorithmType = 'first-fit' | 'best-fit' | 'worst-fit';

export type ViewMode = 'tab' | 'compare';

export type ThemeMode = 'dark' | 'light';

export type ScreenMode = 'landing' | 'simulator';

export interface Process {
  id: string;
  name: string;
  size: number; // in KB
  color: string; // Tailwind color class or hex string
}

export interface Hole {
  id: string;
  name: string;
  size: number; // in KB
  baseAddress?: number;
  allocatedProcess: Process | null;
  usedSize: number; // in KB
  remainingSize: number; // in KB (Internal Fragmentation)
}

export interface MemoryMetrics {
  totalCapacity: number; // in KB
  totalUsed: number; // in KB
  totalFree: number; // in KB
  usedPercentage: number; // 0 - 100
  freePercentage: number; // 0 - 100
  internalFragmentation: number; // in KB
  efficiencyPercentage: number; // 0 - 100
  allocatedCount: number;
  failedCount: number;
  totalProcesses: number;
}

export interface ExecutionStep {
  stepNumber: number;
  process: Process | null;
  action: 'start' | 'evaluate' | 'allocated' | 'failed' | 'completed';
  targetHoleId?: string | null;
  description: string;
  holesState: Hole[];
  allocatedProcesses: { process: Process; holeId: string; holeName: string }[];
  failedProcesses: Process[];
  metrics: MemoryMetrics;
}

export interface AllocationResult {
  algorithm: AlgorithmType;
  steps: ExecutionStep[];
  finalHoles: Hole[];
  allocatedProcesses: { process: Process; holeId: string; holeName: string }[];
  failedProcesses: Process[];
  metrics: MemoryMetrics;
}
