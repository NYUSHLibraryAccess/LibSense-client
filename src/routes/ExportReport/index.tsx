import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { Button, Form, Input, Modal, Select, Tag } from 'antd';

import { ContentLimiter } from '@/components/ContentLimiter';
import { StyledCard } from '@/components/StyledCard';
import { useAppSelector } from '@/store';
import { useSendReportMutation } from '@/services/report';
import { ReportType } from '@/types/ReportType';

const ExportReport: React.FC = () => {
  const [form] = Form.useForm();
  const { username } = useAppSelector((state) => state.auth);
  const [sendReport, { isLoading, isSuccess, isError }] = useSendReportMutation();

  const handleFinish = useCallback((data: { username: string; email: string; reportType: ReportType[] }) => {
    sendReport(data);
  }, []);

  useEffect(() => {
    form.setFieldsValue({ username });
  }, [username]);

  useEffect(() => {
    if (isSuccess) {
      Modal.success({
        title: 'Successfully sent report!',
        content: 'The report has been sent. Go to the inbox to check it.',
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      Modal.error({
        title: 'Failed to send report!',
        content: 'Please check the configurations and try again.',
      });
    }
  }, [isError]);

  return (
    <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
      <div className="my-8 text-xl font-bold select-none">Export Report</div>
      <div className="grid gap-6 grid-cols-1">
        <StyledCard>
          <ContentLimiter>
            <Form form={form} onFinish={handleFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
                className="mb-4"
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                  {
                    type: 'email',
                    message: 'The input is not a valid E-mail!',
                  },
                ]}
                className="mb-4"
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                name="reportType"
                label="Report Types"
                rules={[
                  {
                    required: true,
                    message: 'Please select your report types!',
                  },
                ]}
                className="mb-4"
              >
                <Select
                  mode="multiple"
                  showArrow
                  allowClear
                  options={[
                    { label: 'Rush-Local', value: 'RushLocal' },
                    { label: 'CDL Order', value: 'CDLOrder' },
                    { label: 'Shanghai Order', value: 'ShanghaiOrder' },
                  ]}
                  tagRender={({ label, onClose }) => (
                    <Tag className="mr-1" closable onClose={onClose}>
                      {label}
                    </Tag>
                  )}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
                <Button type="primary" htmlType="submit" loading={isLoading} className="float-right">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </ContentLimiter>
        </StyledCard>
      </div>
    </div>
  );
};

export { ExportReport };
