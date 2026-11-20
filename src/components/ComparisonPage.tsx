import { useMemo } from "react";
import { compareAlgorithms, isConfigurationValid } from "../simulationEngine";
import type { MemoryBlock, MemoryProcess } from "../types";

export function ComparisonPage({
  blocks,
  processes,
  onGoSimulation,
  onGoQuiz,
}: {
  blocks: MemoryBlock[];
  processes: MemoryProcess[];
  onGoSimulation: () => void;
  onGoQuiz: () => void;
}) {
  const isValid = isConfigurationValid(blocks, processes);
  const comparison = useMemo(() => {
    return compareAlgorithms(blocks, processes);
  }, [blocks, processes]);

  const { first, best, worst } = comparison;

  // Determine winners
  const maxSuccess = Math.max(
    first.metrics.successCount,
    best.metrics.successCount,
    worst.metrics.successCount,
  );
  const minFrag = Math.min(
    first.metrics.totalInternalFrag,
    best.metrics.totalInternalFrag,
    worst.metrics.totalInternalFrag,
  );
  const maxEfficiency = Math.max(
    first.metrics.efficiency,
    best.metrics.efficiency,
    worst.metrics.efficiency,
  );

  // Max fragmentation for chart bar percentage scaling
  const maxFragValue = Math.max(
    1,
    first.metrics.totalInternalFrag,
    best.metrics.totalInternalFrag,
    worst.metrics.totalInternalFrag,
  );

  if (!isValid) {
    return (
      <div className="comparison-page">
        <div className="comp-hero">
          <p className="eyebrow">ANALISIS KOMPARASI SISTEM OPERASI</p>
          <h1>Data Simulasi Belum Lengkap</h1>
          <p className="lead">
            Lengkapi seluruh kapasitas Block dan kebutuhan memori Process sebelum menjalankan
            perbandingan algoritma.
          </p>
          <button type="button" className="primary" onClick={onGoSimulation}>
            Kembali ke Pengaturan Simulasi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-page">
      {/* Hero Header */}
      <div className="comp-hero">
        <p className="eyebrow">ANALISIS KOMPARASI SISTEM OPERASI</p>
        <h1>Perbandingan Kinerja Algoritma</h1>
        <p className="lead">
          Evaluasi perbandingan langsung antara <b>First Fit</b>, <b>Best Fit</b>, dan{" "}
          <b>Worst Fit</b> menggunakan konfigurasi blok memori dan proses yang identik dalam model{" "}
          <i>Fixed Partition Allocation</i>.
        </p>
      </div>

      {/* Active Data Summary Card */}
      <div className="comp-dataset-card">
        <div className="dataset-header">
          <div>
            <h3>Konfigurasi Data Pengujian Saat Ini</h3>
            <p>
              Data yang sama diuji pada ketiga algoritma agar hasil perbandingan objektif dan adil.
            </p>
          </div>
          <button type="button" className="secondary small-btn" onClick={onGoSimulation}>
            Ubah Data di Menu Simulasi ✎
          </button>
        </div>
        <div className="dataset-pills">
          <div className="pills-group">
            <span className="pills-label">Blok Memori ({blocks.length}):</span>
            <div className="pills-row">
              {blocks.map((b) => (
                <span key={b.id} className="data-pill block-pill">
                  {b.name}: <b>{b.capacity} KB</b>
                </span>
              ))}
            </div>
          </div>
          <div className="pills-group">
            <span className="pills-label">Proses yang Diuji ({processes.length}):</span>
            <div className="pills-row">
              {processes.map((p) => (
                <span key={p.id} className="data-pill process-pill">
                  {p.name}: <b>{p.size} KB</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Comparison Table */}
      <section className="comp-table-section">
        <div className="section-title">
          <h2>Tabel Perbandingan Kinerja</h2>
          <p>Dihitung secara otomatis berdasarkan eksekusi nyata dari model partisi tetap.</p>
        </div>

        <div className="table-responsive">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Metrik Evaluasi</th>
                <th>
                  <span className="algo-col-title">First Fit</span>
                  <small>Cukup Pertama</small>
                </th>
                <th>
                  <span className="algo-col-title">Best Fit</span>
                  <small>Cukup Terkecil</small>
                </th>
                <th>
                  <span className="algo-col-title">Worst Fit</span>
                  <small>Cukup Terbesar</small>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>1. Jumlah Proses Berhasil</strong>
                  <small>Banyaknya proses yang mendapatkan slot memori</small>
                </td>
                <td className={first.metrics.successCount === maxSuccess ? "highlight-best" : ""}>
                  <span className="val-text">{first.metrics.successCount} proses</span>
                  {first.metrics.successCount === maxSuccess && (
                    <span className="badge-best">Terbaik ✓</span>
                  )}
                </td>
                <td className={best.metrics.successCount === maxSuccess ? "highlight-best" : ""}>
                  <span className="val-text">{best.metrics.successCount} proses</span>
                  {best.metrics.successCount === maxSuccess && (
                    <span className="badge-best">Terbaik ✓</span>
                  )}
                </td>
                <td className={worst.metrics.successCount === maxSuccess ? "highlight-best" : ""}>
                  <span className="val-text">{worst.metrics.successCount} proses</span>
                  {worst.metrics.successCount === maxSuccess && (
                    <span className="badge-best">Terbaik ✓</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>2. Jumlah Proses Gagal</strong>
                  <small>Proses yang tidak mendapatkan blok kosong cukup</small>
                </td>
                <td>
                  <span className="val-text">{first.metrics.failCount} proses</span>
                </td>
                <td>
                  <span className="val-text">{best.metrics.failCount} proses</span>
                </td>
                <td>
                  <span className="val-text">{worst.metrics.failCount} proses</span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>3. Total Memori Teralokasi</strong>
                  <small>Akumulasi ukuran proses yang berhasil masuk</small>
                </td>
                <td>
                  <span className="val-text">{first.metrics.totalAllocatedMem} KB</span>
                </td>
                <td>
                  <span className="val-text">{best.metrics.totalAllocatedMem} KB</span>
                </td>
                <td>
                  <span className="val-text">{worst.metrics.totalAllocatedMem} KB</span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>4. Total Internal Fragmentation</strong>
                  <small>Sisa kapasitas blok yang terbuang (makin kecil makin baik)</small>
                </td>
                <td className={first.metrics.totalInternalFrag === minFrag ? "highlight-best" : ""}>
                  <span className="val-text">{first.metrics.totalInternalFrag} KB</span>
                  {first.metrics.totalInternalFrag === minFrag && (
                    <span className="badge-best">Paling Minim ✓</span>
                  )}
                </td>
                <td className={best.metrics.totalInternalFrag === minFrag ? "highlight-best" : ""}>
                  <span className="val-text">{best.metrics.totalInternalFrag} KB</span>
                  {best.metrics.totalInternalFrag === minFrag && (
                    <span className="badge-best">Paling Minim ✓</span>
                  )}
                </td>
                <td className={worst.metrics.totalInternalFrag === minFrag ? "highlight-best" : ""}>
                  <span className="val-text">{worst.metrics.totalInternalFrag} KB</span>
                  {worst.metrics.totalInternalFrag === minFrag && (
                    <span className="badge-best">Paling Minim ✓</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>5. Total Blok yang Digunakan</strong>
                  <small>Jumlah partisi memori yang terisi proses</small>
                </td>
                <td>
                  <span className="val-text">
                    {first.metrics.blocksUsed} dari {blocks.length} blok
                  </span>
                </td>
                <td>
                  <span className="val-text">
                    {best.metrics.blocksUsed} dari {blocks.length} blok
                  </span>
                </td>
                <td>
                  <span className="val-text">
                    {worst.metrics.blocksUsed} dari {blocks.length} blok
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>6. Efisiensi Penggunaan Memori</strong>
                  <small>(Memori Proses / Kapasitas Blok Terpakai) × 100%</small>
                </td>
                <td className={first.metrics.efficiency === maxEfficiency ? "highlight-best" : ""}>
                  <span className="val-text font-bold">{first.metrics.efficiency}%</span>
                  {first.metrics.efficiency === maxEfficiency && (
                    <span className="badge-best">Tertinggi ✓</span>
                  )}
                </td>
                <td className={best.metrics.efficiency === maxEfficiency ? "highlight-best" : ""}>
                  <span className="val-text font-bold">{best.metrics.efficiency}%</span>
                  {best.metrics.efficiency === maxEfficiency && (
                    <span className="badge-best">Tertinggi ✓</span>
                  )}
                </td>
                <td className={worst.metrics.efficiency === maxEfficiency ? "highlight-best" : ""}>
                  <span className="val-text font-bold">{worst.metrics.efficiency}%</span>
                  {worst.metrics.efficiency === maxEfficiency && (
                    <span className="badge-best">Tertinggi ✓</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Bar Charts Section */}
      <section className="comp-charts-section">
        <div className="section-title">
          <h2>Grafik Batang Perbandingan Visual</h2>
          <p>Visualisasi perbandingan metrik utama untuk memudahkan analisis kinerja.</p>
        </div>

        <div className="charts-grid">
          {/* Chart 1: Efisiensi Penggunaan Memori */}
          <div className="chart-card">
            <h3>Efisiensi Penggunaan Memori (%)</h3>
            <p className="chart-subtitle">
              Persentase kapasitas blok yang benar-benar terpakai oleh proses
            </p>
            <div className="bar-group">
              <div className="bar-row">
                <span className="bar-label">First Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-teal"
                    style={{ width: `${first.metrics.efficiency}%` }}
                  />
                </div>
                <strong className="bar-value">{first.metrics.efficiency}%</strong>
              </div>
              <div className="bar-row">
                <span className="bar-label">Best Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-gold"
                    style={{ width: `${best.metrics.efficiency}%` }}
                  />
                </div>
                <strong className="bar-value">{best.metrics.efficiency}%</strong>
              </div>
              <div className="bar-row">
                <span className="bar-label">Worst Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-coral"
                    style={{ width: `${worst.metrics.efficiency}%` }}
                  />
                </div>
                <strong className="bar-value">{worst.metrics.efficiency}%</strong>
              </div>
            </div>
          </div>

          {/* Chart 2: Total Internal Fragmentation */}
          <div className="chart-card">
            <h3>Internal Fragmentation (KB)</h3>
            <p className="chart-subtitle">Semakin pendek batang grafik, semakin hemat memori</p>
            <div className="bar-group">
              <div className="bar-row">
                <span className="bar-label">First Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-teal"
                    style={{
                      width: `${(first.metrics.totalInternalFrag / maxFragValue) * 100}%`,
                    }}
                  />
                </div>
                <strong className="bar-value">{first.metrics.totalInternalFrag} KB</strong>
              </div>
              <div className="bar-row">
                <span className="bar-label">Best Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-gold"
                    style={{
                      width: `${(best.metrics.totalInternalFrag / maxFragValue) * 100}%`,
                    }}
                  />
                </div>
                <strong className="bar-value">{best.metrics.totalInternalFrag} KB</strong>
              </div>
              <div className="bar-row">
                <span className="bar-label">Worst Fit</span>
                <div className="bar-track">
                  <div
                    className="bar-fill fill-coral"
                    style={{
                      width: `${(worst.metrics.totalInternalFrag / maxFragValue) * 100}%`,
                    }}
                  />
                </div>
                <strong className="bar-value">{worst.metrics.totalInternalFrag} KB</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytical Conclusion Card */}
      <section className="comp-analysis-card">
        <div className="analysis-icon">💡</div>
        <div>
          <h3>Kesimpulan & Analisis Teoretis Sistem Operasi</h3>
          <p>Berdasarkan simulasi Fixed Partition Allocation pada dataset ini:</p>
          <ul className="analysis-list">
            <li>
              <b>Best Fit</b> cenderung menghasilkan fragmentasi internal paling kecil (
              {best.metrics.totalInternalFrag} KB) dan efisiensi memori tertinggi (
              {best.metrics.efficiency}%), karena selalu mencari blok terkecil yang masih cukup.
            </li>
            <li>
              <b>First Fit</b> bekerja dengan mencari blok kosong pertama tanpa perlu memindai
              seluruh memori. Meskipun cepat, penempatan proses dapat meninggalkan fragmentasi (
              {first.metrics.totalInternalFrag} KB) tergantung urutan blok.
            </li>
            <li>
              <b>Worst Fit</b> menempatkan proses ke dalam blok terbesar yang tersedia (
              {worst.metrics.totalInternalFrag} KB fragmentasi internal). Dalam model partisi tetap
              satu proses per blok, strategi ini sering kali memboroskan blok besar untuk proses
              kecil dan berpotensi menggagalkan proses berukuran besar berikutnya.
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="comp-footer-actions">
        <button type="button" className="secondary" onClick={onGoSimulation}>
          ← Kembali ke Simulasi Memori
        </button>
        <button type="button" className="primary" onClick={onGoQuiz}>
          Uji Pemahaman di Latihan Kuis →
        </button>
      </div>
    </div>
  );
}
