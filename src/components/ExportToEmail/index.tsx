import * as React from 'react';
import { Modal, Card, Form, Select, Button, Input, Typography, Space } from 'antd';
import { useRequest } from '@/utils';
import { exportToEmail } from '@/api/exportToEmail';

const ExportToEmail: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Card title={<Typography.Title level={4}>Export to E-mail</Typography.Title>}>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={(values) => {
          console.log(values);
          useRequest(
            exportToEmail({
              reportType: typeof values.reportType === 'string' ? [values.reportType] : values.reportType,
              username: values.username,
              email: values.email,
            })
          ).then((r) => {
            if (r !== undefined) {
              Modal.success({
                title: 'Success',
                content: 'Exported data to e-mail successfully!',
              });
            }
          });
        }}
      >
        <Form.Item
          name="reportType"
          label="Report Type"
          rules={[{ required: true, message: 'Please choose Report Type!' }]}
        >
          <Select mode="multiple">
            <Select.Option value="RushLocal">Rush Local</Select.Option>
            <Select.Option value="CDLOrder">CDL Order</Select.Option>
            <Select.Option value="ShanghaiOrder">Shanghai Order</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input Username!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Please input E-mail!' }]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
              }}
            >
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export { ExportToEmail };
