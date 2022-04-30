import * as React from 'react';
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input, Modal, Row, Col, Spin, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getOneOrder } from '@/api/getOneOrder';
import { IDetailedOrder } from '@/utils/interfaces';
import { requestWithCatch } from '@/utils/requestWithCatch';
import style from './style.module.less';

const OrderModal: React.FC<RouteComponentProps<{ orderId: string }>> = ({ history, match }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IDetailedOrder>();

  // Update order detail on component creation
  useEffect(() => {
    setIsLoading(true);
    requestWithCatch(
      getOneOrder({
        orderId: Number.parseInt(match.params.orderId),
      })
    ).then((r) => {
      if (r !== undefined) {
        setData(r);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <Modal
      title={`Order Detail - ${data?.orderNumber}`}
      visible
      onCancel={() => {
        history.goBack();
      }}
      width={1200}
    >
      <Spin tip="Loading..." delay={100} spinning={isLoading}>
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
        <Form labelCol={{ span: 8, flex: 'string' }} wrapperCol={{ span: 16 }}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Title">
                <Input.TextArea value={data?.title} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Order Number">
                <Input value={data?.orderNumber} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Barcode">
                <Input value={data?.barcode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Order Created Date">
                <Input value={data?.createdDate} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Material Format">
                <Input value={data?.material} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Arrival or not">
                <Input value={data?.arrivalText} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="IPS Code">
                <Input value={data?.ipsCode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Order Arrival Date">
                <Input value={data?.arrivalDate} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="IPS">
                <Input value={data?.ips} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Who Mark Arrival">
                <Input value={data?.arrivalOperator} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="IPS Changed Date">
                <Input value={data?.ipsUpdateDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Arrival Status">
                <Input value={data?.arrivalStatus} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Item Changed Date">
                <Input value={data?.updateDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Order Status Date">
                <Input value={data?.ipsDate} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Who Changed Item">
                <Input value={data?.ipsCodeOperator} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Order Changed Date">
                <Input value={data?.orderStatusUpdateDate} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="BSN">
                <Input value={data?.bsn} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vendor Code">
                <Input value={data?.vendorCode} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Total Price">
                <Input value={data?.totalPrice} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="Library Note" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Input.TextArea value={data?.libraryNote} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export { OrderModal };
