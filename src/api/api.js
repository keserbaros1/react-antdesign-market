import { G00GLE_SHEET_URL, NOCODEAPI_SHEET_URL } from '../api/config';

export async function fetchProducts(barkod) {
  try {
    const response = await fetch(`${G00GLE_SHEET_URL}?sheet=Stok&barkod=${barkod}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google Sheets API hatası:", error);
    return [];
  }
}

export async function login(username, password) {
  try {
    const response = await fetch(`${G00GLE_SHEET_URL}?sheet=Giris&username=${username}&password=${password}`);
    const data = await response.json();
    console.log(data, data.success); // Yanıtı konsola yazdır
    console.error("Giriş API yanıtı:", data); // Yanıtı konsola yazdır
    return data.success; // Başarı durumunu döndür
  } catch (error) {
    console.error("Giriş API hatası:", error);
    return false;
  }
}


export async function register(username, password) {
try {
    // 1. Google Apps Script API'ye GET isteği gönder
    const response = await fetch(`${G00GLE_SHEET_URL}?sheet=Giris&action=addUser&username=${username}`);
    const data = await response.json();
    console.error(data, data.success); // Yanıtı konsola yazdır

    // 2. Kullanıcı adı kontrolü
    if (!data.success) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "post",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify([[username, password]])
    };

    // Google Apps Script ile post yapamadığım için NoCodeAPI kullanıyorum.
    // aldığım hata 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // 3. NoCodeAPI ile Google Sheets satır sonuna ekleme
    await fetch(`${NOCODEAPI_SHEET_URL}?tabId=Giris`, requestOptions)

    if (response.ok) {
        console.log("Kayıt başarılı");
        return { success: true };
    } else {
        console.log("Kayıt başarısız");
        return { success: false, error: "Kayıt sırasında bir hata oluştu." };
    }

  };
    // return { success: false, error: "Bir hata oluştu" };
    // return { success: true };

  } catch (error) {
    console.error("Kayıt API hatası:", error);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }
}