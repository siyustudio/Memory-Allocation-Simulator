import { useEffect, useMemo, useState } from "react";
import {
  algorithmLabels,
  defaultBlocks,
  defaultProcesses,
  exampleBlocks,
  exampleProcesses,
  generateSimulationSteps,
  isConfigurationValid,
  simulateFixedPartition,
} from "../simulationEngine";
import type { Algorithm, MemoryBlock, MemoryProcess } from "../types";
import { Car } from "./Car";

export function SimulationPage({
  blocks,
  setBlocks,
  processes,
  setProcesses,
  onGoComparison,
}: {
  blocks: MemoryBlock[];
  setBlocks: (blocks: MemoryBlock[]) => void;
  processes: MemoryProcess[];
  setProcesses: (processes: MemoryProcess[]) => void;
  onGoComparison: () => void;
}) {
  const [algorithm, setAlgorithm] = useState<Algorithm>("first");
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const isValid = isConfigurationValid(blocks, processes);

  const steps = useMemo(() => {
    return generateSimulationSteps(blocks, processes, algorithm);
  }, [blocks, processes, algorithm]);

  const fullRun = useMemo(() => {
    return simulateFixedPartition(blocks, processes, algorithm);
  }, [blocks, processes, algorithm]);

  const slotsDensityClass =
    blocks.length >= 13 ? "slots-dense" : blocks.length >= 6 ? "slots-compact" : "slots-normal";

  const gridCols = Math.min(Math.max(blocks.length, 1), 6);

  const queueDensityClass =
    processes.length >= 8
      ? "queue-dense"
      : processes.length >= 5
        ? "queue-compact"
        : "queue-normal";

  // Keep stepIndex within valid bounds
  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    if (safeStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 1400);

    return () => clearTimeout(timer);
  }, [isPlaying, safeStepIndex, steps.length]);

  function handleStepForward() {
    if (safeStepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  }

  function handleStepBackward() {
    if (safeStepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  function handleRunAll() {
    setIsPlaying(false);
    setStepIndex(steps.length - 1);
  }

  function handleTogglePlay() {
    if (!isValid) return;
    if (safeStepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }

  function handleAlgorithmChange(algo: Algorithm) {
    setAlgorithm(algo);
    setIsPlaying(false);
    setStepIndex(0);
  }

  // Block editor handlers
  function createNextBlock(index: number, existing: MemoryBlock[]): MemoryBlock {
    const usedIds = new Set(existing.map((b) => b.id));
    let letterIdx = index;
    let candidate = letterIdx < 26 ? String.fromCharCode(65 + letterIdx) : `B${letterIdx + 1}`;
    while (usedIds.has(candidate)) {
      letterIdx++;
      candidate = letterIdx < 26 ? String.fromCharCode(65 + letterIdx) : `B${letterIdx + 1}`;
    }
    return {
      id: candidate,
      name: `Block ${candidate}`,
      capacity: null,
    };
  }

  function handleAddBlock() {
    const newBlock = createNextBlock(blocks.length, blocks);
    setBlocks([...blocks, newBlock]);
    handleReset();
  }

  function handleBlockCountChange(rawValue: number) {
    const target = Number.isNaN(rawValue) ? 0 : Math.max(0, Math.min(30, Math.floor(rawValue)));
    if (target === blocks.length) return;
    if (target < blocks.length) {
      setBlocks(blocks.slice(0, target));
    } else {
      const nextBlocks = [...blocks];
      while (nextBlocks.length < target) {
        nextBlocks.push(createNextBlock(nextBlocks.length, nextBlocks));
      }
      setBlocks(nextBlocks);
    }
    handleReset();
  }

  function handleDeleteBlock(id: string) {
    setBlocks(blocks.filter((b) => b.id !== id));
    handleReset();
  }

  function handleBlockNameChange(id: string, name: string) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, name } : b)));
    handleReset();
  }

  function handleBlockCapacityChange(id: string, rawValue: string) {
    const parsed = rawValue === "" ? null : Number(rawValue);
    const safeCap = parsed !== null && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, capacity: safeCap } : b)));
    handleReset();
  }

  // Process editor handlers
  function createNextProcess(index: number, existing: MemoryProcess[]): MemoryProcess {
    const usedIds = new Set(existing.map((p) => p.id));
    const usedNames = new Set(existing.map((p) => p.name.trim().toUpperCase()));
    let num = index + 1;
    let candidate = `P${num}`;
    while (usedIds.has(candidate) || usedNames.has(candidate.toUpperCase())) {
      num++;
      candidate = `P${num}`;
    }
    return {
      id: candidate,
      name: candidate,
      size: null,
      colorIndex: (num - 1) % 8,
    };
  }

  function handleAddProcess() {
    const newProcess = createNextProcess(processes.length, processes);
    setProcesses([...processes, newProcess]);
    handleReset();
  }

  function handleProcessCountChange(rawValue: number) {
    const target = Number.isNaN(rawValue) ? 0 : Math.max(0, Math.min(30, Math.floor(rawValue)));
    if (target === processes.length) return;
    if (target < processes.length) {
      setProcesses(processes.slice(0, target));
    } else {
      const nextProcesses = [...processes];
      while (nextProcesses.length < target) {
        nextProcesses.push(createNextProcess(nextProcesses.length, nextProcesses));
      }
      setProcesses(nextProcesses);
    }
    handleReset();
  }

  function handleDeleteProcess(id: string) {
    setProcesses(processes.filter((p) => p.id !== id));
    handleReset();
  }

  function handleProcessNameChange(id: string, name: string) {
    setProcesses(processes.map((p) => (p.id === id ? { ...p, name } : p)));
    handleReset();
  }

  function handleProcessSizeChange(id: string, rawValue: string) {
    const parsed = rawValue === "" ? null : Number(rawValue);
    const safeSize = parsed !== null && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    setProcesses(processes.map((p) => (p.id === id ? { ...p, size: safeSize } : p)));
    handleReset();
  }

  function handleClearData() {
    setBlocks(defaultBlocks.map((block) => ({ ...block })));
    setProcesses(defaultProcesses.map((process) => ({ ...process })));
    handleReset();
  }

  function handleApplyExample() {
    setBlocks(exampleBlocks.map((block) => ({ ...block })));
    setProcesses(exampleProcesses.map((process) => ({ ...process })));
    handleReset();
  }

  return (
    <div className="simulation-page">
      {/* Hero Header */}
      <div className="sim-intro">
        <p className="eyebrow">SIMULATOR MEKANISME SISTEM OPERASI</p>
        <h1>Simulasi Memori Interaktif</h1>
        <p className="lead">
          Atur kapasitas blok memori dan ukuran proses sesukamu. Amati bagaimana algoritma mencari
          dan mengalokasikan slot parkir secara bertahap.
        </p>
      </div>

      {/* Algorithm Selection Cards */}
      <section className="sim-algo-section">
        <div className="section-header">
          <h2>Pilih Algoritma Alokasi</h2>
          <p>Setiap algoritma memiliki strategi berbeda dalam memilih blok memori kosong.</p>
        </div>
        <div className="algo-cards-grid">
          {(
            [
              [
                "first",
                "First Fit",
                "Memilih blok kosong pertama dari awal urutan yang kapasitasnya cukup.",
              ],
              [
                "best",
                "Best Fit",
                "Memilih blok kosong terkecil yang cukup agar sisa ruang (fragmentasi) sesedikit mungkin.",
              ],
              [
                "worst",
                "Worst Fit",
                "Memilih blok kosong terbesar yang cukup sehingga menyisakan ruang paling besar.",
              ],
            ] as const
          ).map(([id, title, desc]) => (
            <button
              key={id}
              type="button"
              className={`sim-algo-card ${algorithm === id ? "active" : ""}`}
              onClick={() => handleAlgorithmChange(id)}
            >
              <span className="algo-badge-icon">{title[0]}</span>
              <div className="algo-info">
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
              <span className="algo-check">{algorithm === id ? "✓ Aktif" : "Pilih"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Config Editor Accordion / Panel */}
      <section className="sim-config-section">
        <div className="config-head">
          <div>
            <h2>Pengaturan Blok Memori & Proses</h2>
            <p>
              Ubah ukuran, tambah, atau hapus item di bawah. Simulasi akan menyesuaikan otomatis.
            </p>
          </div>
          <div className="config-actions">
            <button type="button" className="secondary small-btn" onClick={handleApplyExample}>
              Preset: Example Simulation
            </button>
            <button
              type="button"
              className="secondary small-btn clear-data-btn"
              onClick={handleClearData}
            >
              Clear Data
            </button>
            <button
              type="button"
              className="secondary small-btn"
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? "Sembunyikan Editor ▲" : "Buka Editor ▼"}
            </button>
          </div>
        </div>

        {showEditor && (
          <div className="config-grid">
            {/* Memory Blocks Editor */}
            <div className="editor-card">
              <div className="editor-title">
                <div>
                  <h3>1. Blok Memori (Tempat Parkir)</h3>
                  <span className="badge-count">{blocks.length} Blok</span>
                </div>
                <div className="editor-count-controls">
                  <label className="count-input-wrap">
                    <span>Jumlah:</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={blocks.length}
                      onChange={(e) => handleBlockCountChange(Number(e.target.value))}
                    />
                  </label>
                  <button type="button" className="add-item-btn" onClick={handleAddBlock}>
                    + Tambah
                  </button>
                </div>
              </div>
              <div className="item-inputs-list">
                {blocks.length === 0 && (
                  <p className="editor-empty-hint">
                    Jumlah blok diatur ke 0. Ubah angka jumlah atau klik + Tambah.
                  </p>
                )}
                {blocks.map((block) => (
                  <div key={block.id} className="input-row">
                    <input
                      type="text"
                      className="name-edit-input"
                      value={block.name}
                      onChange={(e) => handleBlockNameChange(block.id, e.target.value)}
                      placeholder="Nama blok"
                      aria-label={`Nama ${block.id}`}
                    />
                    <div className="unit-input">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={block.capacity ?? ""}
                        placeholder="Masukkan kapasitas..."
                        aria-label={`Kapasitas ${block.name}`}
                        onChange={(e) => handleBlockCapacityChange(block.id, e.target.value)}
                      />
                      <span className="unit">KB</span>
                    </div>
                    <button
                      type="button"
                      className="delete-item-btn"
                      onClick={() => handleDeleteBlock(block.id)}
                      title="Hapus blok ini"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Processes Editor */}
            <div className="editor-card">
              <div className="editor-title">
                <div>
                  <h3>2. Proses (Mobil)</h3>
                  <span className="badge-count">{processes.length} Proses</span>
                </div>
                <div className="editor-count-controls">
                  <label className="count-input-wrap">
                    <span>Jumlah:</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={processes.length}
                      onChange={(e) => handleProcessCountChange(Number(e.target.value))}
                    />
                  </label>
                  <button type="button" className="add-item-btn" onClick={handleAddProcess}>
                    + Tambah
                  </button>
                </div>
              </div>
              <div className="item-inputs-list">
                {processes.length === 0 && (
                  <p className="editor-empty-hint">
                    Jumlah proses diatur ke 0. Ubah angka jumlah atau klik + Tambah.
                  </p>
                )}
                {processes.map((p, idx) => (
                  <div key={p.id} className="input-row">
                    <div className="process-tag">
                      <input
                        type="text"
                        className="name-edit-input"
                        value={p.name}
                        onChange={(e) => handleProcessNameChange(p.id, e.target.value)}
                        placeholder="Nama proses"
                        aria-label={`Nama ${p.id}`}
                      />
                    </div>
                    <div className="unit-input">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={p.size ?? ""}
                        placeholder="Masukkan kebutuhan..."
                        aria-label={`Kebutuhan memori ${p.name}`}
                        onChange={(e) => handleProcessSizeChange(p.id, e.target.value)}
                      />
                      <span className="unit">KB</span>
                    </div>
                    <button
                      type="button"
                      className="delete-item-btn"
                      onClick={() => handleDeleteProcess(p.id)}
                      title="Hapus proses ini"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {!isValid && (
        <div className="simulation-validation" role="alert">
          <strong>Data simulasi belum lengkap.</strong>
          <span>
            Isi seluruh kapasitas Block dan kebutuhan memori Process dengan angka lebih dari 0 KB,
            atau gunakan preset Example Simulation.
          </span>
        </div>
      )}

      {/* Step Controls Bar */}
      <section className="sim-controls-bar">
        <div className="step-counter">
          <span className="step-badge">
            Langkah {currentStep.stepIndex} dari {processes.length}
          </span>
          <span className="step-label">
            {currentStep.isFinished
              ? "Simulasi Selesai"
              : currentStep.activeProcessIndex !== null
                ? `Memproses ${processes[currentStep.activeProcessIndex].name}`
                : "Siap Memulai"}
          </span>
        </div>

        <div className="controls-buttons">
          <button
            type="button"
            className="secondary control-btn"
            disabled={safeStepIndex <= 0}
            onClick={handleStepBackward}
          >
            ← Langkah Sebelumnya
          </button>

          <button
            type="button"
            className={`primary control-btn ${isPlaying ? "coral" : ""}`}
            disabled={!isValid}
            onClick={handleTogglePlay}
          >
            {isPlaying ? "⏸ Jeda" : "▶ Jalankan Otomatis"}
          </button>

          <button
            type="button"
            className="secondary control-btn"
            disabled={!isValid || safeStepIndex >= steps.length - 1}
            onClick={handleStepForward}
          >
            Langkah Berikutnya →
          </button>

          <button type="button" className="secondary control-btn reset-btn" onClick={handleReset}>
            Reset
          </button>

          <button
            type="button"
            className="text-btn jump-btn"
            disabled={!isValid}
            onClick={handleRunAll}
          >
            Langsung Selesai ⏩
          </button>
        </div>
      </section>

      {/* Real-time Activity Log Card */}
      <div className="sim-log-card" role="status" aria-live="polite">
        <div className="log-indicator">
          <span className="pulse-dot" />
          <strong>Aktivitas Algoritma ({algorithmLabels[algorithm]}):</strong>
        </div>
        <p className="log-text">{currentStep.logMessage}</p>
      </div>

      {/* Interactive Memory Parking Lot Visualization */}
      <section className="sim-parking-lot">
        <div className="parking-lot-header">
          <div>
            <h2>Visualisasi Area Parkir Memori</h2>
            <p>
              Biru: Kosong | Kuning: Sedang Diperiksa | Hijau: Berhasil Parkir | Abu-abu: Terisi |
              Arsiran: Ruang Kosong / Fragmentasi
            </p>
          </div>
          <div className="color-legend">
            <span className="legend-item legend-blue">Kosong</span>
            <span className="legend-item legend-yellow">Diperiksa</span>
            <span className="legend-item legend-green">Berhasil</span>
            <span className="legend-item legend-gray">Terisi</span>
            <span className="legend-item legend-frag">Fragmentasi / Free</span>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="parking-empty-state">
            <strong>Tidak ada blok memori (0 Blok)</strong>
            <span>
              Atur jumlah blok memori lebih dari 0 pada panel pengaturan untuk menampilkan slot
              parkir.
            </span>
          </div>
        ) : (
          <div
            className={`parking-slots-container ${slotsDensityClass}`}
            style={{ "--slot-cols": gridCols } as React.CSSProperties}
          >
            {blocks.map((block) => {
              const allocation = currentStep.allocationsSoFar.find((a) => a.block.id === block.id);
              const isChecking = currentStep.checkingBlockId === block.id;
              const isJustAllocated = currentStep.allocatedBlockId === block.id;

              let slotClass = "slot-empty";
              if (allocation) {
                slotClass = isJustAllocated ? "slot-just-allocated" : "slot-occupied";
              } else if (isChecking) {
                slotClass = "slot-checking";
              }

              const displayBlockName = block.name.trim() || block.id;
              const displayProcessName = allocation
                ? allocation.process.name.trim() || allocation.process.id
                : "";

              return (
                <div
                  key={block.id}
                  className={`sim-park-slot ${slotClass}`}
                  title={`${displayBlockName} (${block.capacity} KB)`}
                >
                  <div className="slot-top-row">
                    <span className="slot-id-badge">{displayBlockName}</span>
                    <span className="slot-capacity-badge">{block.capacity ?? "—"} KB</span>
                  </div>

                  <div className="slot-content-area">
                    {allocation ? (
                      <div className="parked-car-box">
                        <div
                          className={`slot-frag-banner ${allocation.remainder === 0 ? "frag-zero" : ""}`}
                          title={`Free Space: ${allocation.remainder} KB`}
                        >
                          Free Space: {allocation.remainder} KB
                        </div>
                        <Car
                          index={allocation.process.colorIndex}
                          small={blocks.length >= 5}
                          label={displayProcessName}
                        />
                        <div className="parked-meta">
                          <strong>{allocation.process.size} KB</strong>
                        </div>
                      </div>
                    ) : isChecking ? (
                      <div className="checking-box">
                        <span className="scan-line" />
                        <p>Memeriksa...</p>
                      </div>
                    ) : (
                      <div className="slot-free-zone" title={`Free Space: ${block.capacity} KB`}>
                        <span className="free-zone-badge">Free Space</span>
                        <strong className="free-zone-size">{block.capacity ?? "—"} KB</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Process Queue Strip below parking */}
        <div className={`sim-process-strip ${queueDensityClass}`}>
          <div className="strip-title">
            <b>Antrean Proses ({processes.length})</b>
            <span>Fixed Partition Queue</span>
          </div>
          {processes.length === 0 ? (
            <div className="queue-empty-state">Antrean proses kosong (0 Proses).</div>
          ) : (
            <div className="strip-items">
              {processes.map((p, idx) => {
                const isAllocated = currentStep.allocationsSoFar.some((a) => a.process.id === p.id);
                const isFailed = currentStep.failedSoFar.some((f) => f.id === p.id);
                const isCurrent = currentStep.activeProcessIndex === idx;

                let badgeText = "Waiting";
                let itemClass = "status-waiting";
                if (isAllocated) {
                  badgeText = "Parked";
                  itemClass = "status-parked";
                } else if (isFailed) {
                  badgeText = "Failed";
                  itemClass = "status-failed";
                } else if (isCurrent) {
                  badgeText = "Allocating";
                  itemClass = "status-active";
                }

                const progressPct = isAllocated ? 100 : 0;
                const displayProcessName = p.name.trim() || p.id;

                return (
                  <div
                    key={p.id}
                    className={`queue-car-card ${itemClass}`}
                    title={`${displayProcessName} • ${progressPct}% • ${p.size} KB (${badgeText})`}
                  >
                    <span className="queue-status-pill">{badgeText}</span>
                    <div className="queue-car-wrap">
                      <Car index={p.colorIndex ?? idx} small label={displayProcessName} />
                    </div>
                    <span className="queue-progress-meta">
                      {progressPct}% • {p.size ?? "—"} KB
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dashboard Result Summary */}
      <section className="sim-dashboard-summary">
        <div className="summary-header">
          <div>
            <p className="eyebrow">RINGKASAN METRIK HASIL SIMULASI</p>
            <h2>Hasil Alokasi {algorithmLabels[algorithm]} (Fixed Partition)</h2>
          </div>
          <button
            type="button"
            className="primary coral"
            onClick={onGoComparison}
            disabled={!isValid}
          >
            Bandingkan Kinerja 3 Algoritma →
          </button>
        </div>

        <div className="sim-stats-grid">
          <div className="sim-stat-card">
            <span className="stat-label">Total Proses</span>
            <strong>{processes.length}</strong>
            <small>Proses yang diuji</small>
          </div>

          <div className="sim-stat-card stat-success">
            <span className="stat-label">Proses Berhasil</span>
            <strong>{isValid ? fullRun.metrics.successCount : "—"}</strong>
            <small>{fullRun.metrics.successRate}% tingkat alokasi</small>
          </div>

          <div className="sim-stat-card stat-fail">
            <span className="stat-label">Proses Gagal</span>
            <strong>{isValid ? fullRun.metrics.failCount : "—"}</strong>
            <small>Tidak ada blok yang muat</small>
          </div>

          <div className="sim-stat-card">
            <span className="stat-label">Blok Terpakai</span>
            <strong>{isValid ? `${fullRun.metrics.blocksUsed} / ${blocks.length}` : "—"}</strong>
            <small>Partisi tetap terisi</small>
          </div>

          <div className="sim-stat-card stat-frag">
            <span className="stat-label">Internal Fragmentation</span>
            <strong>{isValid ? `${fullRun.metrics.totalInternalFrag} KB` : "—"}</strong>
            <small>Total sisa ruang terbuang</small>
          </div>

          <div className="sim-stat-card stat-efficiency">
            <span className="stat-label">Efisiensi Memori</span>
            <strong>{isValid ? `${fullRun.metrics.efficiency}%` : "—"}</strong>
            <small>Memori proses / blok terpakai</small>
          </div>
        </div>
      </section>
    </div>
  );
}
