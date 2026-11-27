# Memory Allocation Simulator (Memory Parking)

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Web-brightgreen)](https://siyustudio.github.io/Memory-Allocation-Simulator/)

> **Link Aplikasi Live:** [https://siyustudio.github.io/Memory-Allocation-Simulator/](https://siyustudio.github.io/Memory-Allocation-Simulator/)  
> **Repositori GitHub:** [https://github.com/siyustudio/Memory-Allocation-Simulator](https://github.com/siyustudio/Memory-Allocation-Simulator)

---

## Deskripsi Proyek

**Memory Allocation Simulator** adalah aplikasi web interaktif berbasis **React 18 + TypeScript + Tailwind CSS 3 + Vite 6** yang dirancang untuk memvisualisasikan proses alokasi memori berurutan (*contiguous allocation*) dengan partisi tetap (*fixed partition*) pada mata kuliah **Sistem Operasi** menggunakan algoritma **First Fit**, **Best Fit**, dan **Worst Fit**.

Aplikasi ini dikemas dengan konsep tema **Memory Parking** yang intuitif:
- **Memori Utama** $\rightarrow$ Area Parkir
- **Blok Memori (*Hole*)** $\rightarrow$ Tempat / Slot Parkir (1 proses per blok tanpa pemecahan blok)
- **Proses** $\rightarrow$ Mobil yang akan diparkirkan

---

## Fitur Utama

- **Navigasi 5 Halaman Terintegrasi (`HeaderNav`):** Mencakup menu *Beranda*, *Belajar Materi*, *Simulasi Memori*, *Perbandingan Algoritma*, dan *Latihan / Kuis*.
- **Modul Belajar Materi Interaktif:** 6 materi pembelajaran berbasis analogi parkir yang dilengkapi indikator progres dan tombol pintasan *Langsung Coba Simulasi*.
- **Visualisasi Area Parkir Memori (`SimulationPage`):** Memvisualisasikan proses penempatan mobil (proses) ke slot parkir (blok memori) untuk algoritma **First Fit**, **Best Fit**, dan **Worst Fit**, lengkap dengan status blok (*Kosong*, *Diperiksa*, *Berhasil*, *Terisi*, dan *Fragmentasi/Sisa*).
- **Kontrol Simulasi & Log Aktivitas Real-Time:** Mendukung eksekusi *Langkah Demi Langkah*, *Jalankan Otomatis*, atau *Langsung Selesai*, disertai log penjelasan keputusan algoritma dan penyebab jika proses gagal dialokasikan.
- **Perbandingan Kinerja Algoritma (`ComparisonPage`):** Mengevaluasi ketiga algoritma secara bersamaan dengan konfigurasi data yang sama melalui tabel komparasi 6 metrik utama, grafik batang horizontal (*Efisiensi Penggunaan Memori* & *Internal Fragmentation*), serta kesimpulan analisis teoretis.
- **Latihan / Kuis Interaktif:** Fitur evaluasi mandiri dengan pilihan algoritma (*First Fit*, *Best Fit*, *Worst Fit*) dan tingkat kesulitan (*Mudah*, *Sedang*, *Sulit*), terdiri dari 5 soal pilihan ganda lengkap dengan skor akhir dan pembahasan.

---

## Cara Penggunaan

1. **Akses Aplikasi:** Buka tautan *Live Demo* di atas melalui peramban (Chrome, Firefox, atau Edge) tanpa memerlukan instalasi tambahan.
2. **Eksplorasi Materi:** Gunakan **Bilah Navigasi Atas (`HeaderNav`)** untuk membuka halaman **Belajar Materi** jika ingin memahami konsep dasar alokasi memori terlebih dahulu.
3. **Pengaturan Memori & Proses:**
   - Masuk ke menu **Simulasi Memori**.
   - Atur jumlah dan kapasitas blok memori serta ukuran proses (dalam satuan **KB**), atau gunakan tombol **Preset Example Simulation** bawaan.
4. **Jalankan Simulasi:**
   - Pilih salah satu algoritma (**First Fit**, **Best Fit**, atau **Worst Fit**).
   - Gunakan kontrol simulasi (**Langkah Berikutnya**, **Jalankan Otomatis**, atau **Langsung Selesai**) sambil mengamati visualisasi area parkir, log aktivitas algoritma, dan ringkasan metrik.
5. **Analisis Perbandingan & Kuis:**
   - Buka halaman **Perbandingan Algoritma** untuk melihat tabel metrik dan grafik batang perbandingan ketiga algoritma secara menyeluruh.
   - Uji pemahaman melalui menu **Latihan / Kuis** dengan memilih mode algoritma dan tingkat kesulitan yang diinginkan.

---

## Batasan Sistem

- Simulasi berfokus pada model alokasi memori berurutan (*contiguous allocation*) dengan partisi tetap (*fixed partition*): satu blok hanya dapat menampung maksimal satu proses dan tidak dapat dipecah.
- Belum mencakup fitur dealokasi proses secara dinamis, *compaction*, *paging*, *segmentasi*, maupun ekspor hasil simulasi ke dokumen/gambar.

---

## Anggota Tim Kelompok

Berikut adalah daftar anggota kelompok yang berkontribusi dalam pembangunan proyek ini (diurutkan berdasarkan NPM):

| No | NPM | Nama Anggota | Peran & Rincian Kontribusi |
| :-: | :--- | :--- | :--- |
| 1 | `257006111065` | **Salwa Salsabila** | **Penulis Dokumentasi (*Technical Writer*):** Menyusun dokumentasi proyek (`README.md` dan laporan akhir) serta menyiapkan konten halaman pembuka (*Beranda* & materi). |
| 2 | `257006111084` | **Naila Kireina Nurdin** | **Pengembang Antarmuka (*UI/UX Developer*):** Membangun dan menyesuaikan tata letak serta gaya tampilan antarmuka pada seluruh halaman aplikasi. |
| 3 | `257006111087` | **Linda Dwi Martianda** | **Pengembang Fitur (*Feature Developer*):** Mengembangkan logika fitur perbandingan kinerja algoritma (`ComparisonPage`), utilitas pendukung, dan verifikasi fungsionalitas. |
| 4 | `257006111098` | **Reza Dzulhilmi Yasri** | **Penguji (*Quality Assurance*):** Menyiapkan elemen pendukung, melakukan pengujian skenario fungsionalitas aplikasi, serta menyusun dokumentasi pengujian. |
| 5 | `257006111100` | **Yudha Arief Permana** | **Ketua / Manajer Proyek:** Mengoordinasikan alur kerja tim, menyusun struktur arsitektur aplikasi (`App`, `simulationEngine.ts`), serta mengintegrasikan kode ke repositori GitHub. |

---
*Laporan Project Mata Kuliah Sistem Operasi (Dosen Pengampu: Muhammad Sidik Asyaky, S.T., M.T.) — Program Studi Informatika, Fakultas Teknik, Universitas Siliwangi (2026).*
