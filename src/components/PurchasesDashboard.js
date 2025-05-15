import { Button, Input, List, Card, Form, Row, Col } from 'antd';
import { useState } from 'react';

export default function PurchasesDashboard({ user }) {
  const [form] = Form.useForm();
  const [purchaseCart, setPurchaseCart] = useState([]);

  const handleAddToCart = (values) => {
    const today = new Date().toLocaleDateString(); // Bugünün tarihi
    const newItem = {
      ...values,
      tarih: today,
      kullanici: user,
    };
    setPurchaseCart((prev) => [...prev, newItem]);
    form.resetFields(); // Formu temizle
  };

  const handleConfirmPurchase = () => {
    console.log("Onaylanan Alış Sepeti:", purchaseCart);
    // Burada API'ye istek atabilirsiniz
    // Örneğin:
    // await sendPurchaseCartToAPI(purchaseCart);
    setPurchaseCart([]); // Sepeti temizle
    alert("Alış işlemi başarıyla tamamlandı!");
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
              name="barkod"
              label="Barkod"
              rules={[{ required: true, message: 'Barkod gerekli!' }]}
            >
              <Input placeholder="Barkod Numarası" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="urunAdi"
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
              name="bilgi"
              label="Bilgi"
              rules={[{ required: true, message: 'Bilgi gerekli!' }]}
            >
              <Input placeholder="Ürün Bilgisi" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fiyat"
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
              name="miktar"
              label="Miktar"
              rules={[{ required: true, message: 'Miktar gerekli!' }]}
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
            {item.urunAdi} - {item.bilgi} - {item.fiyat}₺ - {item.miktar} adet - {item.tarih} - {item.kullanici}
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