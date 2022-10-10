import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import { ContentLimiter } from '@/components/ContentLimiter';
import logo from '@/assets/logo-colored.png';

const About: React.FC = () => {
  return (
    <ContentLimiter>
      <Form labelAlign="left" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item className="mb-4" wrapperCol={{ span: 24 }}>
          <div className="flex items-center gap-6">
            <img src={logo} alt="Logo" className="w-16 h-16 drop-shadow" />
            <span className="font-display text-4xl">{__NAME__}</span>
          </div>
        </Form.Item>
        <Form.Item label="Version" className="mb-0">
          {__VERSION__}
        </Form.Item>
        <Form.Item label="Build Type" className="mb-0">
          {__IS_DEV__ ? 'Development Build' : 'Production Build'}
        </Form.Item>
        <Form.Item label="Build Time" className="mb-0">
          {new Date(__BUILD_TIMESTAMP__).toLocaleString()}
        </Form.Item>
        <Form.Item label="Build Timestamp" className="mb-0">
          {__BUILD_TIMESTAMP__}
        </Form.Item>
        <Form.Item label="Source Code" className="mb-0">
          <span
            className="select-none cursor-pointer transition-colors hover:text-violet-600"
            onClick={() => {
              window.open('https://github.com/NYUSHLibraryAccess/LibSense-client', '_blank').focus();
            }}
          >
            <GithubOutlined /> GitHub
          </span>
        </Form.Item>
      </Form>
    </ContentLimiter>
  );
};

export { About };
