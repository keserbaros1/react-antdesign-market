import { G00GLE_SHEET_URL, NOCODEAPI_SHEET_URL } from '../api/config';


// Ürün sorgulama fonksiyonu
export async function fetchProducts(barkod, urunAdi) {
  try {
    const queryParam = barkod
      ? `barkod=${encodeURIComponent(barkod)}`
      : `urunAdi=${encodeURIComponent(urunAdi)}`;

    const response = await fetch(`${G00GLE_SHEET_URL}?sheet=Stok&${queryParam}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google Sheets API hatası:", error);
    return [];
  }
}


// Kullanıcı giriş fonksiyonu
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

// Kullanıcı kaydetme fonksiyonu
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
    const response = await fetch(`${NOCODEAPI_SHEET_URL}?tabId=Giris`, requestOptions)

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

// Alış işlemi gönderme fonksiyonu
export async function sendPurchaseCartToAPI(purchaseCart) {
  try {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");




    var requestOptions = {
        method: "post",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(purchaseCart.map(item => ({ ...item})))
    };

    const response = await fetch(`${NOCODEAPI_SHEET_URL}/addRows?tabId=Alis`, requestOptions);

    if (response.ok) {


    // Apps Script ile ürünlerin indexlerini ve stok sayısını çekicez. 
    const updateList = purchaseCart.map(item => item.UrunAdi);
    const updateListStock = purchaseCart.map(item => item.Stok);


    const response = await fetch(`${G00GLE_SHEET_URL}?sheet=Stok&action=updateStock&updateList=${updateList}`);
    const data = await response.json();



    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    // Her ürünün stok sayısını güncelle
    for (let i = 0; i < data.length; i++) {
        const { row_id, stock } = data[i];
        const old_stock = updateListStock[i];
        console.log(row_id, stock);
        if (stock === 0) {

            // Eğer ürünün stok sayısı 0 ise ürünü yeni satıra ekle
            var requestOptions = {
                method: "post",
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify([purchaseCart[i]])
            };
            await fetch(`${NOCODEAPI_SHEET_URL}/addRows?tabId=Stok`, requestOptions);


        } else {
            var requestOptions = {
                method: "put",
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify({"row_id":row_id,"Stok":Number(stock) + Number(old_stock)})
            };

            await fetch(`${NOCODEAPI_SHEET_URL}?tabId=Stok`, requestOptions);
        }
    }

    return { success: true };

    } else {
    console.error("Alış bilgileri eklenemedi:");
    return { success: false, error: "Alış bilgileri eklenemedi" };
    }
    } catch (error) {
    console.error("Kayıt API hatası:", error);
    return { success: false, error: "Kayıt sırasında bir hata oluştu." };
  }

}