// script.js
import { ambilKutipan, ambilCuaca } from "./api.js";
import { inisialisasiCatatan, renderCatatan, dapatkanTotalCatatan } from "./catatan.js";
import { inisialisasiTugas, renderTugas, dapatkanStatistikTugas } from "./tugas.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  let header = document.querySelector("header");
  if (!header) {
    header = document.createElement("header");
    document.body.insertBefore(header, app);
  }

  const judul = document.createElement("h2");
  judul.textContent = "Dashboard Produktivitas Harian";
  header.appendChild(judul);

  const statusElemen = document.createElement("span");
  statusElemen.id = "status";
  header.appendChild(statusElemen);

  const toggleTema = document.createElement("button");
  toggleTema.id = "toggle-tema";
  toggleTema.textContent = "Mode Gelap";
  header.appendChild(toggleTema);

  toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", modeAktif ? "gelap" : "terang");
  });

  if (localStorage.getItem("tema") === "gelap") {
    document.body.classList.add("dark-mode");
  }

  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  document.body.appendChild(toastContainer);

  function tampilkanToast(pesan) {
    if (!pesan) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = pesan;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const statsSection = document.createElement("section");
  statsSection.id = "stats";

  const cuacaSection = document.createElement("section");
  cuacaSection.id = "cuaca";

  const tugasSection = document.createElement("section");
  tugasSection.id = "tugas";

  const catatanSection = document.createElement("section");
  catatanSection.id = "catatan";

  app.append(statsSection, cuacaSection, tugasSection, catatanSection);

  function perbaruiStatistik(pesanToast) {
    const { total, selesai, belum } = dapatkanStatistikTugas();
    const totalCatatan = dapatkanTotalCatatan();

    statsSection.innerHTML = `
      <h3>Ringkasan</h3>
      <div class="stats-grid">
        <div class="stat-card"><span>Total Tugas</span><strong>${total}</strong></div>
        <div class="stat-card"><span>Selesai</span><strong>${selesai}</strong></div>
        <div class="stat-card"><span>Belum</span><strong>${belum}</strong></div>
        <div class="stat-card"><span>Catatan</span><strong>${totalCatatan}</strong></div>
      </div>`

    if (pesanToast) tampilkanToast(pesanToast);
  }

  function exportData() {
    const data = {
      daftarTugas: JSON.parse(localStorage.getItem("daftarTugas") || "[]"),
      daftarCatatan: JSON.parse(localStorage.getItem("daftarCatatan") || "[]")
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dailyboard_backup_${Date.now()}.json`;
    a.click();
    tampilkanToast("Data berhasil di-export!");
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.daftarTugas) localStorage.setItem("daftarTugas", JSON.stringify(json.daftarTugas));
        if (json.daftarCatatan) localStorage.setItem("daftarCatatan", JSON.stringify(json.daftarCatatan));
        
        renderTugas();
        renderCatatan();
        perbaruiStatistik();
        tampilkanToast("Data berhasil di-import!");
      } catch (err) {
        alert("File JSON tidak valid!");
      }
    };
    reader.readAsText(file);
  }

  inisialisasiTugas(tugasSection, perbaruiStatistik);
  inisialisasiCatatan(catatanSection, perbaruiStatistik);

  const kutipanWrapper = document.createElement("div");
  kutipanWrapper.className = "kutipan-refresh";

  const eKutipan = document.createElement("p");
  eKutipan.id = "kutipan-harian";
  eKutipan.textContent = "Memuat kutipan...";
  cuacaSection.appendChild(eKutipan);

  const btnRefreshKutipan = document.createElement("button");
  btnRefreshKutipan.id = "refresh-kutipan";
  btnRefreshKutipan.className = "btn-refresh";
  btnRefreshKutipan.textContent = "Refresh";

  kutipanWrapper.appendChild(eKutipan);
  kutipanWrapper.appendChild(btnRefreshKutipan);
  cuacaSection.appendChild(kutipanWrapper);

  const divCuacaForm = document.createElement("div");
  const inputKota = document.createElement("input");
  inputKota.placeholder = "Nama kota...";

  const btnCariCuaca = document.createElement("button");
  btnCariCuaca.textContent = "Cari Cuaca";

  const infoCuaca = document.createElement("div");
  infoCuaca.id = "info-cuaca";

  divCuacaForm.appendChild(inputKota);
  divCuacaForm.appendChild(btnCariCuaca);
  cuacaSection.appendChild(divCuacaForm);
  cuacaSection.appendChild(infoCuaca);

  btnCariCuaca.addEventListener("click", () => {
    if (inputKota.value.trim() !== "") {
      ambilCuaca(inputKota.value.trim(), infoCuaca);
    }
  });

  async function muatSemuaWidget() {
    statusElemen.textContent = "Memuat data...";
    try {
      await Promise.all([
        ambilKutipan(eKutipan),
        ambilCuaca("Jakarta", infoCuaca)
      ]);
      statusElemen.textContent = "• Terhubung";
    } catch (error) {
      statusElemen.textContent = "• Sebagian gagal";
    }
  }

  perbaruiStatistik();
  muatSemuaWidget();
});