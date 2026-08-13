// tugas.js

import { simpanKeStorage, muatDariStorage } from "./storage.js";

let daftarTugas = [];
let currentFilter = "semua";
let callbackOnUpdate = null;

// Helper Debounce Internal
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function inisialisasiTugas(containerSection, onUpdateCallback) {
  daftarTugas = muatDariStorage("daftarTugas", [
    { id: 1, nama: "Belajar Javascript", selesai: false },
    { id: 2, nama: "Olahraga pagi", selesai: false }
  ]);
  callbackOnUpdate = onUpdateCallback;

  // Input & Tombol Tambah
  const inputTugas = document.createElement("input");
  inputTugas.type = "text";
  inputTugas.id = "input-tugas";
  inputTugas.placeholder = "Masukan nama tugas...";

  const tombolTambah = document.createElement("button");
  tombolTambah.textContent = "Tambah tugas";

  tombolTambah.addEventListener("click", () => {
    tambahTugas(inputTugas.value);
    inputTugas.value = "";
  });

  // Input Pencarian Menggunakan Debounce
  const inputCari = document.createElement("input");
  inputCari.placeholder = "🔍 Cari tugas...";

  const cariTugasDebounced = debounce((kataKunci) => {
    const hasil = daftarTugas.filter((t) =>
      t.nama.toLowerCase().includes(kataKunci)
    );
    renderTugasKustom(hasil);
  }, 300);

  inputCari.addEventListener("input", (e) => {
    const kataKunci = e.target.value.toLowerCase();
    cariTugasDebounced(kataKunci);
  });

  // Filter Buttons
  const divFilter = document.createElement("div");
  divFilter.className = "filter-container";

  ["semua", "belum", "selesai"].forEach((f) => {
    const btn = document.createElement("button");
    btn.textContent = f.toUpperCase();
    btn.addEventListener("click", () => {
      currentFilter = f;
      renderTugas(currentFilter);
    });
    divFilter.appendChild(btn);
  });

  // List <ul>
  const listUl = document.createElement("ul");
  listUl.id = "daftar-tugas";

  containerSection.appendChild(inputTugas);
  containerSection.appendChild(tombolTambah);
  containerSection.appendChild(inputCari);
  containerSection.appendChild(divFilter);
  containerSection.appendChild(listUl);

  renderTugas(currentFilter);
}

function tambahTugas(nama) {
  if (nama.trim() === "") return alert("Nama tugas tidak boleh kosong!");
  daftarTugas.push({ id: Date.now(), nama, selesai: false });
  simpanKeStorage("daftarTugas", daftarTugas);
  renderTugas(currentFilter);
  if (callbackOnUpdate) callbackOnUpdate("Tugas baru ditambahkan!");
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  simpanKeStorage("daftarTugas", daftarTugas);
  renderTugas(currentFilter);
  if (callbackOnUpdate) callbackOnUpdate("Tugas berhasil dihapus.");
}

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanKeStorage("daftarTugas", daftarTugas);
  renderTugas(currentFilter);
  if (callbackOnUpdate) callbackOnUpdate("Status tugas diperbarui.");
}

function editTugas(id, namaBaru) {
  if (namaBaru === null || namaBaru.trim() === "") return;
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanKeStorage("daftarTugas", daftarTugas);
  renderTugas(currentFilter);
  if (callbackOnUpdate) callbackOnUpdate("Nama tugas diperbarui.");
}

export function renderTugas(filter = "semua") {
  const tugasTersaring = daftarTugas.filter((t) => {
    if (filter === "selesai") return t.selesai;
    if (filter === "belum") return !t.selesai;
    return true;
  });

  renderTugasKustom(tugasTersaring);
}

function renderTugasKustom(arrayTugas) {
  const list = document.getElementById("daftar-tugas");
  if (!list) return;
  list.innerHTML = "";

  if (arrayTugas.length === 0) {
    list.innerHTML = `<li class="empty-state">Tidak ada tugas ditemukan.</li>`;
    if (callbackOnUpdate) callbackOnUpdate();
    return;
  }

  arrayTugas.forEach((tugas) => {
    const li = document.createElement("li");
    li.dataset.id = tugas.id;

    const spanTeks = document.createElement("span");
    spanTeks.textContent = tugas.nama;
    spanTeks.style.textDecoration = tugas.selesai ? "line-through" : "none";
    spanTeks.style.cursor = "pointer";

    spanTeks.addEventListener("click", () => toggleSelesai(tugas.id));
    spanTeks.addEventListener("dblclick", () => {
      const namaBaru = prompt("Edit nama tugas:", tugas.nama);
      editTugas(tugas.id, namaBaru);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", (e) => {
      e.stopPropagation();
      hapusTugas(tugas.id);
    });

    li.appendChild(spanTeks);
    li.appendChild(tombolHapus);
    list.appendChild(li);
  });

  aktifkanDragDrop();
  if (callbackOnUpdate) callbackOnUpdate();
}

function aktifkanDragDrop() {
  const items = document.querySelectorAll("#daftar-tugas li:not(.empty-state)");
  const list = document.getElementById("daftar-tugas");

  items.forEach((item) => {
    item.setAttribute("draggable", true);
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.dataset.id);
    });
  });

  if (!list) return;
  list.addEventListener("dragover", (e) => e.preventDefault());
  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData("text/plain"));
    const targetLi = e.target.closest("li");

    if (targetLi && targetLi.dataset.id) {
      const targetId = Number(targetLi.dataset.id);
      const draggedIndex = daftarTugas.findIndex((t) => t.id === draggedId);
      const targetIndex = daftarTugas.findIndex((t) => t.id === targetId);

      if (draggedIndex > -1 && targetIndex > -1) {
        const [movedItem] = daftarTugas.splice(draggedIndex, 1);
        daftarTugas.splice(targetIndex, 0, movedItem);

        simpanKeStorage("daftarTugas", daftarTugas);
        renderTugas(currentFilter);
      }
    }
  });
}

export function dapatkanStatistikTugas() {
  const total = daftarTugas.length;
  const selesai = daftarTugas.filter((t) => t.selesai).length;
  const belum = total - selesai;
  return { total, selesai, belum };
}      