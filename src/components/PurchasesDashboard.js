import { Button, Input, List, Card, Form, Row, Col } from 'antd';
import { useState } from 'react';
import { sendPurchaseCartToAPI } from '../api/api';

export default function PurchasesDashboard({ user }) {
  const [form] = Form.useForm();
  const [purchaseCart, setPurchaseCart] = useState([]);

  const handleAddToCart = (values) => {
    const today = new Date().toLocaleDateString(); // Bugünün tarihi

    // Rastgele barkod oluşturma
    const generateRandomBarcode = () => {
      return Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12 haneli rastgele sayı
    };

    const newItem = {
      ...values,
      Barkod: generateRandomBarcode(),
      Tarih: today,
      Kullanici: user,
    };
    setPurchaseCart((prev) => [...prev, newItem]);
    form.resetFields(); // Formu temizle
  };

  const handleConfirmPurchase = async () => {
    const result = await sendPurchaseCartToAPI(purchaseCart);
  if (result.success) {
    alert("Alış işlemi başarıyla tamamlandı!");
    setPurchaseCart([]); // Sepeti temizle
  } else {
    alert(`Alış işlemi başarısız! Hata: ${result.error}`);
  }
  };

  return (
    <div style={{ padding: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddToCart}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="UrunAdi"
              label="Ürün Adı"
              rules={[{ required: true, message: 'Ürün adı gerekli!' }]}
            >
              <Input placeholder="Ürün Adı" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Bilgi"
              label="Bilgi"
              rules={[{ required: true, message: 'Bilgi gerekli!' }]}
            >
              <Input placeholder="Ürün Bilgisi" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Fiyat"
              label="Fiyat"
              rules={[{ required: true, message: 'Fiyat gerekli!' }]}
            >
              <Input type="number" placeholder="Fiyat (₺)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="Stok"
              label="Stok"
              rules={[{ required: true, message: 'Stok gerekli!' }]}
            >
              <Input type="number" placeholder="Miktar" />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" block>
          Sepete Ekle
        </Button>
      </Form>

      <List
        header={<strong>Alış Sepeti</strong>}
        bordered
        dataSource={purchaseCart}
        renderItem={(item) => (
          <List.Item>
            {item.UrunAdi} - {item.Bilgi} - {item.Fiyat}₺ - {item.Stok} adet - {item.Tarih} - {item.Kullanici}
          </List.Item>
        )}
        locale={{ emptyText: 'Sepette ürün yok.' }}
      />

      {purchaseCart.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleConfirmPurchase} block>
            Alış İşlemini Onayla
          </Button>
        </Card>
      )}
    </div>
  );
}