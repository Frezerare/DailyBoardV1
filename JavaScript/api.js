// api.js
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
  elemenTarget.textContent = "Memuat data cuaca...";
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${kota}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Kota tidak ditemukan");
    }

    const { latitude, longitude, name } = geoData.results[0];
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    elemenTarget.innerHTML = `<p><strong>${name}</strong>: ${weatherData.current_weather.temperature}°C</p>`;
  } catch (error) {
    elemenTarget.textContent = error.message;
  }
}