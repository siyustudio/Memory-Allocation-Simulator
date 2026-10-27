# Memory-Allocation-Simulator
Aplikasi simulasi visualisasi alokasi memori OS berbasis web
# Memory Allocation Simulator

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Web-brightgreen)](https://USERNAME_GITHUB.github.io/Memory-Allocation-Simulator/)

> **Link Aplikasi Live:** [https://siyustudio.github.io/Memory-Allocation-Simulator/](https://siyustudio.github.io/Memory-Allocation-Simulator/)

---

## Deskripsi Proyek

**Memory Allocation Simulator** adalah aplikasi web interaktif berbasis **React + TypeScript + Tailwind CSS** yang dirancang untuk memvisualisasikan algoritma alokasi memori pada Sistem Operasi (*First Fit*, *Best Fit*, dan *Worst Fit*). 

Menggunakan animasi *Conveyor Belt* yang intuitif dan antarmuka ramah pengguna (*family-friendly*), aplikasi ini memudahkan pemahaman proses alokasi memori serta perbandingan tingkat efisiensi alokasi secara real-time.

### Fitur Utama
- **Visualisasi Conveyor Belt Animation:** Antrean proses berjalan secara animasi di atas pita dan masuk ke blok RAM yang sesuai.
- **Simulasi 3 Algoritma:** *First Fit*, *Best Fit*, dan *Worst Fit*.
- **Mode Tampilan Ganda:** *Light Mode* pastel yang cerah serta *Dark Mode* (Deep Slate) yang nyaman di mata.
- **Interactive Tour (TourModal):** Panduan awal langkah demi langkah untuk pengguna baru.
- **Modul Komparasi & Metrik Real-time (CompareView):** Analisis efisiensi alokasi memori, fragmentasi internal, dan visualisasi *Vertical ProgressBar*.
- **Export Laporan (PDF):** Fitur untuk mengunduh ringkasan hasil simulasi dan tabel perbandingan ke format PDF.

---

## Cara Penggunaan

1. **Akses Aplikasi:** Buka link live demo di atas melalui browser laptop atau HP.
2. **Navigasi & Panduan:** Gunakan **Sidebar** untuk berpindah halaman. Ikuti panduan singkat via **TourModal** saat pertama kali masuk.
3. **Pengaturan Memori & Proses:**
   - Masukkan kapasitas RAM dan ukuran blok memori (*holes*) awal melalui **MainCanvas**.
   - Tambahkan daftar proses baru atau gunakan **Preset Uji Coba Cepat**.
4. **Jalankan Simulasi:**
   - Pilih algoritma (*First Fit*, *Best Fit*, atau *Worst Fit*).
   - Tekan tombol **Play / Start** untuk melihat animasi *Conveyor Belt* bekerja.
5. **Analisis Hasil:**
   - Masuk ke menu **CompareView** untuk melihat statistik perbandingan ketiga algoritma secara mendalam.
   - Klik tombol **"Download Hasil Simulasi (PDF)"** untuk menyimpan laporan hasil eksekusi.

---

## Anggota Tim Kelompok

Berikut adalah daftar anggota kelompok yang berkontribusi dalam pembangunan proyek ini (diurutkan berdasarkan NPM teratas):

| No | NPM | Nama Anggota | Peran / Fokus Kontribusi File |
| :-: | :--- | :--- | :--- |
| 1 | `257006111065` | **Salwa Salsabila** | Technical Writer & Landing Page (`LandingPage.tsx`, `README.md`) |
| 2 | `257006111084` | **Naila Kireina Nurdin** | Quality Assurance & Tour Modal (`TourModal.tsx`, `MainCanvas.tsx`, `docs/`) |
| 3 | `257006111087` | **Linda Dwi Martianda** | Feature Developer & Export (`CompareView.tsx`, `VerticalProgressBar.tsx`, `src/utils/`) |
| 4 | `257006111098` | **Reza Dzulhilmi Yasri** | Frontend Developer & UI (`Sidebar.tsx`, `ConveyorBelt.tsx`, `index.css`) |
| 5 | `257006111100` | **Yudha Arief Permana** | Ketua & Lead Developer (`App.tsx`, `main.tsx`, `types/`, Root Config) |

---
*Proyek Akhir Praktikum Sistem Operasi — Teknik Informatika, Fakultas Teknik, Universitas Siliwangi.*
