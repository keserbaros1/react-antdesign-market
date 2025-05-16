// src/components/Dashboard.js
import { Button, Switch, Row, Col, Typography, Input, List, Card } from 'antd';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';

import PurchasesDashboard from './PurchasesDashboard';
// import SaleDashboard from './SaleDashboard';



export default function Dashboard({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('sales'); // 'sales' veya 'purchases'
  
  const [filteredSales, setFilteredSales] = useState([]);
  const [salesQuery, setSalesQuery] = useState("");
  const salesTotalPrice = filteredSales.reduce((sum, item) => sum + parseFloat(item.fiyat), 0);
  
    
  const { Title } = Typography;

  // Azaltma ve artırma işlemleri
  const handleIncreaseSelected = (index) => {
    setFilteredSales((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, selected: Math.min(item.selected + 1, item.stok) } // Seçilen ürün sayısı stok miktarını aşamaz
          : item
      )
    );
  };

  const handleDecreaseSelected = (index) => {
    setFilteredSales((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, selected: Math.max(item.selected - 1, 0) } // Seçilen ürün sayısı 0'ın altına inemez
          : item
      ).filter((item) => item.selected > 0) // Seçilen miktarı 0 olan ürünleri filtrele

    );
  };

  const handleSaveSaleCart = () => {
    const data = JSON.stringify(filteredSales, null, 2); // JSON formatına çevir
    setFilteredSales([]); // Sepeti temizle
  };
  
  const handleSalesSearch = async (barkod) => {
    try {
      const product = await fetchProducts(barkod); // Barkod ile API'ye istek gönder
      if (product.success && product.product) {
        // Eğer ürün bulunursa ve zaten listede yoksa ekle
        if (!filteredSales.some(item => item.barkod === product.product.barkod)) {
          setFilteredSales(prev => [
            ...prev, { ...product.product, selected: 1 }]); // Seçilen miktar 1 olarak başlat
        }
      } else {
        alert("Ürün bulunamadı!");
      }
    } catch (error) {
      console.error("Ürün sorgulama hatası:", error);
      alert("Ürün sorgulama sırasında bir hata oluştu.");
    }
    setSalesQuery(""); // Barkod alanını temizle
  };


  const renderSalesView = () => (
    <>
      <Input.Search
        placeholder="Satış için Barkod Numarası Girin"
        value={salesQuery}
        onChange={(e) => setSalesQuery(e.target.value)}
        onSearch={handleSalesSearch} // Barkod arama işlemi
        enterButton="Ara"
        style={{ marginBottom: 16 }}
      />
      <List
        header={<strong>Satış Listesi</strong>}
        bordered
        dataSource={filteredSales}
        renderItem={(item, index) => (
        <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                {item.urunAdi} - {item.bilgi} - {item.fiyat}₺ - Stok: {item.stok} - Seçilen: {item.selected}
              </div>
              <div>
                <Button
                  size="small"
                  onClick={() => handleDecreaseSelected(index)}
                  disabled={item.selected <= 0} // Seçilen miktar 0 ise azaltma butonunu devre dışı bırak
                  style={{ marginRight: 8 }}
                >
                  -
                </Button>
                <Button
                  size="small"
                  onClick={() => handleIncreaseSelected(index)}
                  disabled={item.selected >= item.stok} // Seçilen miktar stok miktarını aşamaz
                >
                  +
                </Button>
              </div>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: 'Listede ürün yok.' }}
      />
      {filteredSales.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          Toplam Ürün: {filteredSales.length} <br />
          Toplam Tutar: {salesTotalPrice.toFixed(2)} ₺
          <Button
            type="primary"
            onClick={handleSaveSaleCart}
            style={{ marginTop: 16, display: 'block' }}
          >
            Satış Sepetini Kaydet
          </Button>
        </Card>
      )}
    </>
  );


    
  // Satış ve alış görünümünü geçiş
    const handleViewChange = (checked) => {
    setCurrentView(checked ? 'sales' : 'purchases');
  };


  
  return (
    <div style={{ padding: 24, maxWidth: 700, margin: 'auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Hoş geldin, {user}</Title>
        </Col>
        <Col>
          <Button
            type="default"
            onClick={onLogout}
          >
            Çıkış Yap
          </Button>
        </Col>
      </Row>

      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Switch
          checkedChildren="Satış Modu"
          unCheckedChildren="Alış Modu"
          checked={currentView === 'sales'}
          onChange={handleViewChange}
        />
      </div>

      {currentView === 'sales' ? 
      renderSalesView() : 
      // <SaleDashboard/> :
      <PurchasesDashboard user={user} />}
    </div>
  );
}