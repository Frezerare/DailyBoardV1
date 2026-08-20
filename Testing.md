# DailyBoard

Dashboard Produktivitas harian :
Teknologi yang di gunakan (HTML, CSS, dan JavaScript)
6 Fase
16 Minggu

# Fitur
- Tugas (To-Do List) : Tambah, hapus, tandai selesai (klik 1x), edit (klik 2x), filter (Semua/Selesai/Belum), Dapat mengurutkan tugas dengan Drag and Drop.
- Catatan Cepat : Tambah dan Hapus. Ditampilkannya Catatan beserta Tanggal pembuatan.
- Kutipan harian : Diambil otomatis dari API publik.
- Cuaca : Cari cuaca kota apa pun secara Real-Time
- Dark Mode : Dapat mengubah warna tampilan DailyBoard
- Pencarian Tugas : Dapat mencari tugas

## Struktur File

Projek_Dailyboard/
- index.html
- style.css
- JavaScipt/
    - api.js
    - catatan.js
    - script.js
    - storage.js
    - tugas.js
- readme.md
- Testing.md

# CheckList

- [x] Tambah tugas baru muncul di daftar
- [x] Hapus tugas menghilangkan item
- [x] Klik tugas → tercoret (selesai)
- [x] Klik dua kali → bisa edit nama tugas
- [x] Validasi input kosong/terlalu panjang ditolak
- [x] Filter (Semua/Selesai/Belum) bekerja
- [x] Refresh halaman → data tugas & catatan tetap ada
- [x] Tambah & hapus catatan berfungsi
- [x] Kutipan & cuaca otomatis dimuat saat halaman dibuka
- [x] Dark mode tersimpan setelah refresh
- [x] Pencarian real-time dengan debounce
- [x] Drag-drop mengubah urutan & tersimpan
- [x] Tidak ada error di console