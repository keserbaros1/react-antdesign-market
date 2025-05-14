// src/components/LoginForm.js
import { Form, Input, Button, Card, Modal } from 'antd';
import { useState } from 'react';
import { login, register } from '../api/api';


export default function LoginForm({ onLogin }) {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const onFinish = async (values) => {
    const { username, password } = values;
    const success = await login(username, password);
    if (success) {
      onLogin(username, password);
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };
  
  
  const handleRegister = async (values) => {
    const { username, password } = values;
    const success = await register(username, password);
    if (success) {
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      setIsRegisterModalVisible(false); // Modalı kapat
    } else {
      alert("Kayıt başarısız! Lütfen tekrar deneyin.");
    }
  };

  return (
    <Card 
      title="Market Otomasyonu Giriş" 
      style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      
      <Form onFinish={onFinish}>        
        <Form.Item 
          name="username" 
          rules={[{ required: true, message: 'Kullanıcı adı gerekli!' }]}>
          <Input placeholder="Kullanıcı Adı" />
        </Form.Item>
        
        <Form.Item
          name="password" 
          rules={[{ required: true, message: 'Şifre gerekli!' }]}>
          <Input.Password placeholder="Şifre" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Giriş Yap</Button>
        </Form.Item>
      </Form>

      <Button
        type="link"
        onClick={() => setIsRegisterModalVisible(true)}
        block
        >
        Hesap Oluştur
        </Button>

      <Modal
      title="Üye Ol"
      visible={isRegisterModalVisible}
      onCancel={() => setIsRegisterModalVisible(false)}
      footer={null}
      >
        <Form onFinish={handleRegister}>
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Kullanıcı adı gerekli!' }]}
          >
            <Input placeholder="Kullanıcı Adı" />
          </Form.Item>
          
          <Form.Item
            name="password" 
            rules={[{ required: true, message: 'Şifre gerekli!' }]}
          >
            <Input.Password placeholder="Şifre" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Kayıt Ol</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}