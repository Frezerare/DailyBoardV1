export async function ambilKutipan(elemenTarget) {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("Gagal mengambil kutipan");

    const data = await res.json();
    elemenTarget.textContent = `"${data.quote}" — ${data.author}`;
  } catch (error) {
    console.error("Detail Error:", error.message);
    elemenTarget.textContent = "Gagal memuat kutipan. Coba lagi nanti.";
  }
}

export async function ambilCuaca(kota, elemenTarget) {
  const apiKey = "18903514fb960080634adfa5cacdc75e";
  elemenTarget.textContent = "Memuat data cuaca...";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric&lang=id`
    );

    if (!res.ok) {
      if (res.status === 404) throw new Error("Kota tidak ditemukan");
      if (res.status === 401) throw new Error("API Key tidak valid");
      throw new Error("Gagal mengambil data cuaca");
    }

    const data = await res.json();

    const namaKota = data.name;
    const suhu = Math.round(data.main.temp);
    const deskripsi = data.weather[0].description;

    elemenTarget.innerHTML = `<p><strong>${namaKota}</strong>: ${suhu}°C, ${deskripsi}</p>`;
  } catch (error) {
    console.error("Detail Error Cuaca:", error);
    elemenTarget.textContent = error.message;
  }
}