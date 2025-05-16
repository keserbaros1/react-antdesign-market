// src/components/Dashboard.js
import { Button, Switch, Row, Col, Typography, Input, List, Card } from 'antd';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';

import PurchasesDashboard from './PurchasesDashboard';



export default function Dashboard({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('sales'); // 'sales' veya 'purchases'
  
  const [filteredSales, setFilteredSales] = useState([]);
  const [salesQuery, setSalesQuery] = useState("");
  const salesTotalPrice = filteredSales.reduce((sum, item) => sum + parseFloat(item.fiyat), 0);
  
    
  const { Title } = Typography;
  
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
          setFilteredSales(prev => [...prev, product.product]);
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
        renderItem={item => (
          <List.Item>
            {item.urunAdi} - {item.bilgi} - {item.fiyat}₺
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

      {currentView === 'sales' ? renderSalesView() : <PurchasesDashboard user={user} />}
    </div>
  );
}