import * as React from 'react';
import { Form, Input, Modal, Row, Col, Spin, Space, Button, Tooltip, Typography, Card } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { PlusOutlined, LockOutlined } from '@ant-design/icons';
import { IDetailedOrder } from '@/utils/interfaces';
import style from './style.module.less';

const textAreaAutoSize: Pick<TextAreaProps, 'autoSize'> = { autoSize: { minRows: 1, maxRows: 2 } };

const OrderModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  data: IDetailedOrder;
}> = ({ visible, setVisible, isLoading, data }) => {
  return (
    <Modal
      title={`Order Detail - ${data?.orderNumber || ''}`}
      visible={visible}
      className={style.modal}
      onOk={() => {
        setVisible(true);
      }}
      onCancel={() => {
        setVisible(false);
      }}
      width={1200}
    >
      <Spin tip="Loading..." delay={50} spinning={isLoading}>
        <Row gutter={[16, 16]}>
          {/* Left column */}
          <Col span={12}>
            <Card
              title={
                <Typography.Title level={5}>
                  Item Information{' '}
                  <Tooltip title="This section is read-only">
                    <LockOutlined />
                  </Tooltip>
                </Typography.Title>
              }
              size="small"
            >
              <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className={style.form}>
                <Form.Item label="Title">
                  <Input.TextArea {...textAreaAutoSize} value={data?.title} />
                </Form.Item>
                <Form.Item label="Barcode">
                  <Input.TextArea {...textAreaAutoSize} value={data?.barcode} />
                </Form.Item>
                <Form.Item label="Material Format">
                  <Input.TextArea {...textAreaAutoSize} value={data?.material} />
                </Form.Item>
                <Form.Item label="IPS Code">
                  <Input.TextArea {...textAreaAutoSize} value={data?.ipsCode} />
                </Form.Item>
                <Form.Item label="IPS">
                  <Input.TextArea {...textAreaAutoSize} value={data?.ips} />
                </Form.Item>
                <Form.Item label="IPS Changed Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.ipsUpdateDate} />
                </Form.Item>
                <Form.Item label="Item Changed Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.updateDate} />
                </Form.Item>
                <Form.Item label="Who Changed Item">
                  <Input.TextArea {...textAreaAutoSize} value={data?.ipsCodeOperator} />
                </Form.Item>
                <Form.Item label="BSN">
                  <Input.TextArea {...textAreaAutoSize} value={data?.bsn} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          {/* Right column */}
          <Col span={12}>
            <Card
              title={
                <Typography.Title level={5}>
                  Order Information{' '}
                  <Tooltip title="This section is read-only">
                    <LockOutlined />
                  </Tooltip>
                </Typography.Title>
              }
              size="small"
            >
              <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className={style.form}>
                <Form.Item label="Order Number">
                  <Input.TextArea {...textAreaAutoSize} value={data?.orderNumber} />
                </Form.Item>
                <Form.Item label="Order Created Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.createdDate} />
                </Form.Item>
                <Form.Item label="Arrival or not">
                  <Input.TextArea {...textAreaAutoSize} value={data?.arrivalText} />
                </Form.Item>
                <Form.Item label="Order Arrival Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.arrivalDate} />
                </Form.Item>
                <Form.Item label="Who Mark Arrival">
                  <Input.TextArea {...textAreaAutoSize} value={data?.arrivalOperator} />
                </Form.Item>
                <Form.Item label="Arrival Status">
                  <Input.TextArea {...textAreaAutoSize} value={data?.arrivalStatus} />
                </Form.Item>
                <Form.Item label="Order Status Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.ipsDate} />
                </Form.Item>
                <Form.Item label="Order Changed Date">
                  <Input.TextArea {...textAreaAutoSize} value={data?.orderStatusUpdateDate} />
                </Form.Item>
                <Form.Item label="Vendor Code">
                  <Input.TextArea {...textAreaAutoSize} value={data?.vendorCode} />
                </Form.Item>
                <Form.Item label="Total Price">
                  <Input.TextArea {...textAreaAutoSize} value={data?.totalPrice} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          {/* Library note */}
          <Col span={24}>
            <Card size="small">
              <Form layout="vertical">
                <Form.Item label="Library Note">
                  <Input.TextArea value={data?.libraryNote} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          {/* Buttons */}
          <Col span={24}>
            <Card size="small">
              <Space className={style.buttons}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Register as CDL Order',
                      content: 'Confirm to register this order as a CDL order?',
                    });
                  }}
                >
                  Register as CDL
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export { OrderModal };
