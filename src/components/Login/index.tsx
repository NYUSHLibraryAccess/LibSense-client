import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { sha256 } from 'crypto-hash';
import { IAppDispatch } from '@/utils/store';
import { login } from '@/api/login';
import style from './style.module.less';
import Background from '@/images/nyush-library.jpeg';
import { setRole, setUsername } from '@/slices/auth';

const Login: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch<IAppDispatch>();

  const [form] = Form.useForm();

  return (
    <div className={style.container}>
      <img className={style.background} src={Background} alt="" draggable={false} />
      <Card className={style.card}>
        <Form
          form={form}
          onFinish={async ({ username, password }: { username: string; password: string }) => {
            try {
              const { data } = await login({
                username,
                password: await sha256(password),
              });
              dispatch(setUsername(data.username));
              dispatch(setRole(data.role));
              history.push('/');
            } catch {
              message.error('Login failed! Either Username or Password is incorrect!');
              form.resetFields();
            }
          }}
        >
          <Form.Item>
            <Typography.Title level={4}>Log In</Typography.Title>
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export { Login };
