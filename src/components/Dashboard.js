// src/components/Dashboard.js
import { Button, Input, List, Card, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/googleApi';

const { Title } = Typography;

export default function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  
  const totalPrice = filtered.reduce((sum, item) => sum + parseFloat(item.fiyat), 0);
  
  const handleSaveCart = () => {
    const data = JSON.stringify(filtered, null, 2); // JSON formatına çevir
    setFiltered([]); // Sepeti temizle
  };

  const handleSearch = async (barkod) => {
    try {
      const product = await fetchProducts(barkod); // Barkod ile API'ye istek gönder
      if (product.success && product.product) {
        // Eğer ürün bulunursa ve zaten listede yoksa ekle
        if (!filtered.some(item => item.barkod === product.product.barkod)) {
          setFiltered(prev => [...prev, product.product]);
        }
      } else {
        alert("Ürün bulunamadı!");
      }
    } catch (error) {
      console.error("Ürün sorgulama hatası:", error);
      alert("Ürün sorgulama sırasında bir hata oluştu.");
    }
    setQuery(""); // Barkod alanını temizle
  };

  // Sürekli dinleme kaldırıldı
  // useEffect(() => {
  //   fetchProducts().then(setProducts);
  // }, []);  

  // useEffect(() => {
  //   const match = products.find(p => p.barkod === query);
  //   if (match && !filtered.some(item => item.barkod === match.barkod)) {
  //     setFiltered(prev => [...prev, match]);
  //     setQuery(""); // barkod girildikten sonra input boşalsın
  //   }  
  // }, [query]);    

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <Title level={3}>Hoş geldin, {user}</Title>
      <Button 
        type="default" 
        onClick={onLogout} 
        style={{ marginBottom: 16 }}
      >
        Çıkış Yap
      </Button>
      <Input.Search
        placeholder="Barkod numarası girin"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch} // Barkod arama işlemi
        enterButton
        style={{ marginBottom: 16 }}
      />
      <List
        header={<strong>Satış Listesi</strong>}
        bordered
        dataSource={filtered}
        renderItem={item => (
          <List.Item>
            {item.urunAdi} - {item.bilgi} - {item.fiyat}₺
          </List.Item>
        )}
      />
      <Card style={{ marginTop: 16 }}>
        Toplam Ürün: {filtered.length} <br />
        Toplam Tutar: {totalPrice.toFixed(2)} ₺
        <Button 
          type="primary" 
          onClick={handleSaveCart} 
          style={{ marginTop: 16 }}
        >
          Sepeti Kaydet
        </Button>
      </Card>
    </div>
  );
}
