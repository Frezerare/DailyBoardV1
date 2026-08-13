// catatan.js
import { simpanKeStorage, muatDariStorage } from "./storage.js";

let daftarCatatan = [];
let callbackOnUpdate = null;

export function inisialisasiCatatan(containerSection, onUpdateCallback) {
  daftarCatatan = muatDariStorage("daftarCatatan", []);
  callbackOnUpdate = onUpdateCallback;

  const textareaCatatan = document.createElement("textarea");
  textareaCatatan.id = "input-catatan";
  textareaCatatan.placeholder = "Tulis catatan pendek...";

  const btnCatatan = document.createElement("button");
  btnCatatan.textContent = "Simpan Catatan";

  const divDaftarCatatan = document.createElement("div");
  divDaftarCatatan.id = "daftar-catatan";

  containerSection.appendChild(textareaCatatan);
  containerSection.appendChild(btnCatatan);
  containerSection.appendChild(divDaftarCatatan);

  btnCatatan.addEventListener("click", () => {
    tambahCatatan(textareaCatatan.value);
    textareaCatatan.value = "";
  });

  renderCatatan();
}

function tambahCatatan(isi) {
  if (isi.trim() === "") return alert("Catatan tidak boleh kosong!");
  
  daftarCatatan.push({
    id: Date.now(),
    isi,
    tanggal: new Date().toLocaleDateString("id-ID")
  });
  
  simpanKeStorage("daftarCatatan", daftarCatatan);
  renderCatatan();
  if (callbackOnUpdate) callbackOnUpdate("Catatan berhasil ditambahkan");
}

function hapusCatatan(id) {
  daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
  simpanKeStorage("daftarCatatan", daftarCatatan);
  renderCatatan();
  if (callbackOnUpdate) callbackOnUpdate("Catatan berhasil dihapus");
}

export function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  if (!container) return;  
  container.innerHTML = "";

  // Empty State (Minggu 15)
  if (daftarCatatan.length === 0) {
    container.innerHTML = `<p class="empty-state">Belum ada catatan tersimpan.</p>`;
    if (callbackOnUpdate) callbackOnUpdate();
    return;
  }

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    
    const p = document.createElement("p");
    p.textContent = catatan.isi;

    const footer = document.createElement("div");
    footer.className = "catatan-footer";

    const small = document.createElement("small");
    small.textContent = catatan.tanggal;

    // Tombol Hapus Catatan
    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";
    btnHapus.className = "btn-hapus-catatan";
    btnHapus.addEventListener("click", () => hapusCatatan(catatan.id));

    footer.appendChild(small);
    footer.appendChild(btnHapus);
    div.appendChild(p);
    div.appendChild(footer);
    container.appendChild(div);
  });

  if (callbackOnUpdate) callbackOnUpdate();
}

export function dapatkanTotalCatatan() {
  return daftarCatatan.length;
}