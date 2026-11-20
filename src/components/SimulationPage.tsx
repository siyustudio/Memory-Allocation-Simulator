import { useEffect, useMemo, useState } from "react"
import {
  algorithmLabels,
  defaultBlocks,
  defaultProcesses,
  generateSimulationSteps,
  simulateFixedPartition,
} from "../simulationEngine"
import type { Algorithm, MemoryBlock, MemoryProcess } from "../types"
import { Car } from "./Car"

export function SimulationPage({
  blocks,
  setBlocks,
  processes,
  setProcesses,
  onGoComparison,
}: {
  blocks: MemoryBlock[]
  setBlocks: (blocks: MemoryBlock[]) => void
  processes: MemoryProcess[]
  setProcesses: (processes: MemoryProcess[]) => void
  onGoComparison: () => void
}) {
  const [algorithm, setAlgorithm] = useState<Algorithm>("first")
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEditor, setShowEditor] = useState(true)

  const steps = useMemo(() => {
    return generateSimulationSteps(blocks, processes, algorithm)
  }, [blocks, processes, algorithm])

  const fullRun = useMemo(() => {
    return simulateFixedPartition(blocks, processes, algorithm)
  }, [blocks, processes, algorithm])

  // Keep stepIndex within valid bounds
  const safeStepIndex = Math.min(stepIndex, steps.length - 1)
  const currentStep = steps[safeStepIndex] || steps[0]

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    if (safeStepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1
        if (next >= steps.length - 1) {
          setIsPlaying(false)
        }
        return next
      })
    }, 1400)

    return () => clearTimeout(timer)
  }, [isPlaying, safeStepIndex, steps.length])

  function handleStepForward() {
    if (safeStepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1)
    }
  }

  function handleStepBackward() {
    if (safeStepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    }
  }

  function handleReset() {
    setIsPlaying(false)
    setStepIndex(0)
  }

  function handleRunAll() {
    setIsPlaying(false)
    setStepIndex(steps.length - 1)
  }

  function handleTogglePlay() {
    if (safeStepIndex >= steps.length - 1) {
      setStepIndex(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  function handleAlgorithmChange(algo: Algorithm) {
    setAlgorithm(algo)
    setIsPlaying(false)
    setStepIndex(0)
  }

  // Block editor handlers
  function handleAddBlock() {
    const nextChar = String.fromCharCode(65 + blocks.length)
    const newBlock: MemoryBlock = {
      id: nextChar,
      name: `Block ${nextChar}`,
      capacity: 250,
    }
    setBlocks([...blocks, newBlock])
    handleReset()
  }

  function handleDeleteBlock(id: string) {
    if (blocks.length <= 1) return
    setBlocks(blocks.filter((b) => b.id !== id))
    handleReset()
  }

  function handleBlockCapacityChange(id: string, capacity: number) {
    const safeCap = Math.max(10, capacity)
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, capacity: safeCap } : b)),
    )
    handleReset()
  }

  // Process editor handlers
  function handleAddProcess() {
    const nextIdx = processes.length + 1
    const newProcess: MemoryProcess = {
      id: `P${nextIdx}`,
      name: `Process P${nextIdx}`,
      size: 150,
      colorIndex: (nextIdx - 1) % 8,
    }
    setProcesses([...processes, newProcess])
    handleReset()
  }

  function handleDeleteProcess(id: string) {
    if (processes.length <= 1) return
    setProcesses(processes.filter((p) => p.id !== id))
    handleReset()
  }

  function handleProcessSizeChange(id: string, size: number) {
    const safeSize = Math.max(10, size)
    setProcesses(
      processes.map((p) => (p.id === id ? { ...p, size: safeSize } : p)),
    )
    handleReset()
  }

  function handleResetToDefaults() {
    setBlocks(defaultBlocks)
    setProcesses(defaultProcesses)
    handleReset()
  }

  return (
    <div className="simulation-page">
      {/* Hero Header */}
      <div className="sim-intro">
        <p className="eyebrow">SIMULATOR MEKANISME SISTEM OPERASI</p>
        <h1>Simulasi Memori Interaktif</h1>
        <p className="lead">
          Atur kapasitas blok memori dan ukuran proses sesukamu. Amati bagaimana
          algoritma mencari dan mengalokasikan slot parkir secara bertahap.
        </p>
      </div>

      {/* Algorithm Selection Cards */}
      <section className="sim-algo-section">
        <div className="section-header">
          <h2>Pilih Algoritma Alokasi</h2>
          <p>
            Setiap algoritma memiliki strategi berbeda dalam memilih blok memori
            kosong.
          </p>
        </div>
        <div className="algo-cards-grid">
          {([
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
          ] as const).map(([id, title, desc]) => (
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
              <span className="algo-check">
                {algorithm === id ? "✓ Aktif" : "Pilih"}
              </span>
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
              Ubah ukuran, tambah, atau hapus item di bawah. Simulasi akan
              menyesuaikan otomatis.
            </p>
          </div>
          <div className="config-actions">
            <button
              type="button"
              className="secondary small-btn"
              onClick={handleResetToDefaults}
            >
              Gunakan Contoh Default
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
                <button
                  type="button"
                  className="add-item-btn"
                  onClick={handleAddBlock}
                >
                  + Tambah Blok
                </button>
              </div>
              <div className="item-inputs-list">
                {blocks.map((block) => (
                  <div key={block.id} className="input-row">
                    <span className="block-tag">{block.name}</span>
                    <div className="unit-input">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={block.capacity}
                        onChange={(e) =>
                          handleBlockCapacityChange(
                            block.id,
                            Number(e.target.value),
                          )
                        }
                      />
                      <span className="unit">KB</span>
                    </div>
                    <button
                      type="button"
                      className="delete-item-btn"
                      disabled={blocks.length <= 1}
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
                <button
                  type="button"
                  className="add-item-btn"
                  onClick={handleAddProcess}
                >
                  + Tambah Proses
                </button>
              </div>
              <div className="item-inputs-list">
                {processes.map((p, idx) => (
                  <div key={p.id} className="input-row">
                    <div className="process-tag">
                      <Car index={p.colorIndex ?? idx} small />
                      <span>{p.name}</span>
                    </div>
                    <div className="unit-input">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={p.size}
                        onChange={(e) =>
                          handleProcessSizeChange(p.id, Number(e.target.value))
                        }
                      />
                      <span className="unit">KB</span>
                    </div>
                    <button
                      type="button"
                      className="delete-item-btn"
                      disabled={processes.length <= 1}
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
            onClick={handleTogglePlay}
          >
            {isPlaying ? "⏸ Jeda" : "▶ Jalankan Otomatis"}
          </button>

          <button
            type="button"
            className="secondary control-btn"
            disabled={safeStepIndex >= steps.length - 1}
            onClick={handleStepForward}
          >
            Langkah Berikutnya →
          </button>

          <button
            type="button"
            className="secondary control-btn reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="text-btn jump-btn"
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
              Biru: Kosong | Kuning: Sedang Diperiksa | Hijau: Berhasil Parkir |
              Abu-abu: Terisi
            </p>
          </div>
          <div className="color-legend">
            <span className="legend-item legend-blue">Kosong</span>
            <span className="legend-item legend-yellow">Diperiksa</span>
            <span className="legend-item legend-green">Berhasil</span>
            <span className="legend-item legend-gray">Terisi</span>
          </div>
        </div>

        <div className="parking-slots-container">
          {blocks.map((block) => {
            const allocation = currentStep.allocationsSoFar.find(
              (a) => a.block.id === block.id,
            )
            const isChecking = currentStep.checkingBlockId === block.id
            const isJustAllocated = currentStep.allocatedBlockId === block.id

            let slotClass = "slot-empty"
            if (allocation) {
              slotClass = isJustAllocated
                ? "slot-just-allocated"
                : "slot-occupied"
            } else if (isChecking) {
              slotClass = "slot-checking"
            }

            return (
              <div key={block.id} className={`sim-park-slot ${slotClass}`}>
                <div className="slot-top-row">
                  <span className="slot-id-badge">{block.name}</span>
                  <span className="slot-capacity-badge">
                    {block.capacity} KB
                  </span>
                </div>

                <div className="slot-content-area">
                  {allocation ? (
                    <div className="parked-car-box">
                      <Car
                        index={allocation.process.colorIndex}
                        color={
                          allocation.process.colorIndex !== undefined
                            ? undefined
                            : undefined
                        }
                      />
                      <div className="parked-meta">
                        <strong>{allocation.process.name}</strong>
                        <span>{allocation.process.size} KB</span>
                      </div>
                      <div className="fragmentation-pill">
                        Sisa: <b>{allocation.remainder} KB</b>
                      </div>
                    </div>
                  ) : isChecking ? (
                    <div className="checking-box">
                      <span className="scan-line" />
                      <p>
                        Sedang diperiksa oleh {algorithmLabels[algorithm]}...
                      </p>
                    </div>
                  ) : (
                    <div className="empty-box">
                      <span>Slot Kosong</span>
                      <small>Kapasitas: {block.capacity} KB</small>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Process Queue Strip below parking */}
        <div className="sim-process-strip">
          <div className="strip-title">
            <b>Antrean Proses:</b>
            <span>
              Urutan proses yang dialokasikan dalam model Fixed Partition
            </span>
          </div>
          <div className="strip-items">
            {processes.map((p, idx) => {
              const isAllocated = currentStep.allocationsSoFar.some(
                (a) => a.process.id === p.id,
              )
              const isFailed = currentStep.failedSoFar.some(
                (f) => f.id === p.id,
              )
              const isCurrent = currentStep.activeProcessIndex === idx

              let badgeText = "Menunggu"
              let itemClass = "status-waiting"
              if (isAllocated) {
                const alloc = currentStep.allocationsSoFar.find(
                  (a) => a.process.id === p.id,
                )
                badgeText = `Terparkir di ${alloc?.block.name}`
                itemClass = "status-parked"
              } else if (isFailed) {
                badgeText = "Gagal (Tidak muat)"
                itemClass = "status-failed"
              } else if (isCurrent) {
                badgeText = "Sedang diproses"
                itemClass = "status-active"
              }

              return (
                <div key={p.id} className={`process-pill-card ${itemClass}`}>
                  <Car index={p.colorIndex ?? idx} small />
                  <div className="process-pill-meta">
                    <strong>{p.name}</strong>
                    <span>{p.size} KB</span>
                  </div>
                  <span className="process-state-badge">{badgeText}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Result Summary */}
      <section className="sim-dashboard-summary">
        <div className="summary-header">
          <div>
            <p className="eyebrow">RINGKASAN METRIK HASIL SIMULASI</p>
            <h2>
              Hasil Alokasi {algorithmLabels[algorithm]} (Fixed Partition)
            </h2>
          </div>
          <button
            type="button"
            className="primary coral"
            onClick={onGoComparison}
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
            <strong>{fullRun.metrics.successCount}</strong>
            <small>{fullRun.metrics.successRate}% tingkat alokasi</small>
          </div>

          <div className="sim-stat-card stat-fail">
            <span className="stat-label">Proses Gagal</span>
            <strong>{fullRun.metrics.failCount}</strong>
            <small>Tidak ada blok yang muat</small>
          </div>

          <div className="sim-stat-card">
            <span className="stat-label">Blok Terpakai</span>
            <strong>
              {fullRun.metrics.blocksUsed} / {blocks.length}
            </strong>
            <small>Partisi tetap terisi</small>
          </div>

          <div className="sim-stat-card stat-frag">
            <span className="stat-label">Internal Fragmentation</span>
            <strong>{fullRun.metrics.totalInternalFrag} KB</strong>
            <small>Total sisa ruang terbuang</small>
          </div>

          <div className="sim-stat-card stat-efficiency">
            <span className="stat-label">Efisiensi Memori</span>
            <strong>{fullRun.metrics.efficiency}%</strong>
            <small>Memori proses / blok terpakai</small>
          </div>
        </div>
      </section>
    </div>
  )
}
