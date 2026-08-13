// storage.js
export function simpanKeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function muatDariStorage(key, nilaiDefault = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : nilaiDefault;
}