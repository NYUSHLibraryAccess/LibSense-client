import React, { useCallback, useEffect } from 'react';
import { Button, DatePicker, Form, message } from 'antd';

import { ContentLimiter } from '@/components/ContentLimiter';
import { useResetCdlVendorDateMutation } from '@/services/orders';

const CdlVendorDate: React.FC = () => {
  const [resetCdlVendorDate, { isLoading, isSuccess, isError }] = useResetCdlVendorDateMutation();

  const [form] = Form.useForm();
  const handleFinish = useCallback(() => {
    resetCdlVendorDate({ date: form.getFieldValue('date').format('YYYY-MM-DD') });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(`Updated CDL Vendor Date to ${form.getFieldValue('date').format('YYYY-MM-DD')}.`);
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error('Failed to update CDL Vendor Date.');
    }
  }, [isError]);

  return (
    <ContentLimiter>
      <Form form={form} onFinish={handleFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          name="date"
          label="CDL Vendor Date"
          rules={[
            {
              required: true,
              message: 'Please input the CDL Vendor Date!',
            },
          ]}
          className="mb-4"
        >
          <DatePicker className="w-full" allowClear placeholder="" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
          <Button type="primary" htmlType="submit" loading={isLoading} className="float-right">
            Update
          </Button>
        </Form.Item>
      </Form>
    </ContentLimiter>
  );
};

export { CdlVendorDate };
