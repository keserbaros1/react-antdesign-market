// src/components/LoginForm.js
import { Form, Input, Button, Card } from 'antd';
import { login } from '../api/googleApi';


export default function LoginForm({ onLogin }) {
  const onFinish = async (values) => {
    const { username, password } = values;
    const success = await login(username, password);
    if (success) {
      onLogin(username, password);
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
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
    </Card>
  );
}