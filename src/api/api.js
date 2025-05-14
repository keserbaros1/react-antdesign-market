import { SHEET_URL } from '../config';

export async function fetchProducts(barkod) {
  try {
    const response = await fetch(`${SHEET_URL}?sheet=Stok&barkod=${barkod}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google Sheets API hatası:", error);
    return [];
  }
}

export async function login(username, password) {
  try {
    const response = await fetch(`${SHEET_URL}?sheet=Giris&username=${username}&password=${password}`);
    const data = await response.json();
    console.error("Giriş API yanıtı:", data); // Yanıtı konsola yazdır
    return data.success; // Başarı durumunu döndür
  } catch (error) {
    console.error("Giriş API hatası:", error);
    return false;
  }
}