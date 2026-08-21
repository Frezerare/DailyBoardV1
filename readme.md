# DailyBoard - Dashboard Produktivitas Harian

DailyBoard adalah aplikasi web dashboard harian berbasis **Vanilla JavaScript (ES6 Modules)** yang dirancang untuk membantu pengelolaan tugas harian, catatan cepat, penyajian data cuaca real-time, serta kutipan inspiratif harian.

---

## Fitur Utama

- Manajemen Tugas (To-Do List):**
  - Tambah, edit (double click), tandai selesai, dan hapus tugas.
  - Filter tugas (*Semua*, *Belum*, *Selesai*).
  - Pencarian tugas real-time dengan fungsi **Debounce**.
  - Fitur **Drag and Drop** untuk mengubah urutan tugas secara manual.
- Catatan Cepat :**
  - Simpan catatan pendek lengkap dengan timestamp.
  - Tombol hapus catatan individual.
- Widget Cuaca & Kutipan Async:**
  - Menampilkan prediksi cuaca berbasis API Open-Meteo.
  - Random Quote Generator harian dari API DummyJSON.
- Ringkasan Statistik & Backup Data:**
  - Panel counter statistik tugas dan catatan.
  - Fitur **Export & Import Data** dalam format `.json` untuk backup/restore.
- UI Dynamic & Dark Mode:**
  - Dukungan **Dark Mode** yang tersimpan di LocalStorage.
  - Tampilan **1-Frame / Responsive Grid Dashboard**.
  - **Toast Notifications** dan **Empty State UI** untuk UX yang interaktif.

---

## Struktur Proyek

index.html          # File HTML Utama
style.css           # Styling gabungan (Dynamic & Responsive)
storage.js          # Modul pembantu pengelolaan LocalStorage
api.js              # Modul pemanggilan API luar (Cuaca & Kutipan)
catatan.js          # Modul logika & UI fitur Catatan
tugas.js            # Modul logika & UI fitur Tugas (To-Do + Debounce)
script.js           # Main Entry Point & Orchestrator Aplikasi