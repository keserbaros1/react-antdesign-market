// src/components/LoginForm.js
import { Form, Input, Button, Card } from 'antd';

export default function LoginForm({ onLogin }) {
  const onFinish = (values) => {
    const { username } = values;
    onLogin(username);
  };

  return (
    <Card title="Market Otomasyonu Giriş" style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Kullanıcı adı gerekli!' }]}>
          <Input placeholder="Kullanıcı Adı" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Giriş Yap</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
