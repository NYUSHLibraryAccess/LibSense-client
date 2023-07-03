import React, { useCallback, useEffect } from 'react';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';

import { useLoginMutation } from '@/services/auth';
import { getClassName } from '@/utils/getClassName';
import { getSHA256 } from '@/utils/getSHA256';
import { isFriendlyError } from '@/utils/isFriendlyError';
import { useRequireAuthStatus } from '@/hooks/useRequireAuthStatus';
import { useTitle } from '@/hooks/useTitle';
import logo from '@/assets/logo.png';
import style from './index.module.less';

const Login: React.FC = () => {
  const { refetchAuthStatus } = useRequireAuthStatus(false);
  useTitle('Login', true);

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const handleFinish = useCallback(
    async ({ username, password, remember }: { username: string; password: string; remember: boolean }) => {
      login({
        username,
        password: await getSHA256(password),
        remember,
      });
    },
    []
  );

  useEffect(() => {
    if (isSuccess) {
      refetchAuthStatus();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(isFriendlyError(error) ? error.data.detail : 'An unknown error occurred.');
    }
  }, [isError, error]);

  return (
    <div className={getClassName('h-screen select-none flex justify-center items-center', style.backgroundImage)}>
      <div className="w-96 px-8 py-10 rounded-md bg-white shadow-xl shadow-gray-600/25 flex flex-col items-center">
        <div className="mb-8 flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-12 h-12 drop-shadow" />
          <span className="text-xl text-gray-800">Login to {__NAME__}</span>
        </div>
        <Form onFinish={handleFinish} className="w-full">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            className="mb-4"
          >
            <Input
              size="middle"
              prefix={<UserOutlined className="mr-0.5" />}
              placeholder="Username"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            className="mb-6"
          >
            <Input.Password
              size="middle"
              prefix={<KeyOutlined className="mr-0.5" />}
              placeholder="Password"
              disabled={isLoading}
            />
          </Form.Item>
          <div className="flex justify-between items-center">
            <Form.Item className="mb-0" name="remember" valuePropName="checked" initialValue={true}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export { Login };
