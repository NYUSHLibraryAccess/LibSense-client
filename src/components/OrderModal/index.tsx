import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Spin,
  Space,
  Button,
  Tooltip,
  Typography,
  Card,
  Select,
  DatePicker,
  message,
} from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { PlusOutlined, MinusOutlined, LockOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IAppDispatch, IRootState } from '@/utils/store';
import { IDetailedCdlOrder, IDetailedOrder, IMetadata } from '@/utils/interfaces';
import { fetchMetadata } from '@/slices/metadata';
import style from './style.module.less';
import { useRequest } from '@/utils';
import { addCdlOrder } from '@/api/addCdlOrder';
import { removeCdlOrder } from '@/api/removeCdlOrder';
import { updateCdlOrder } from '@/api/updateCdlOrder';

const textAreaAutoSize: Pick<TextAreaProps, 'autoSize'> = { autoSize: { minRows: 1, maxRows: 3 } };
const dateFormat = 'YYYY-MM-DD';

// TODO: add modification indicator

const OrderModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  data: IDetailedOrder | IDetailedCdlOrder;
  setData: React.Dispatch<React.SetStateAction<IDetailedOrder | IDetailedCdlOrder>>;
  isCdl: boolean;
  onReload: () => void;
}> = ({ visible, setVisible, isLoading, data, setData, onReload }) => {
  const dispatch = useDispatch<IAppDispatch>();

  // Metadata states
  const metadata = useSelector<IRootState, IMetadata>(({ metadata }) => metadata.metadata);

  // Load metadata at component creation
  useEffect(() => {
    dispatch(fetchMetadata());
  }, []);

  return (
    <Modal
      title={`Order Detail - ${data?.orderNumber || ''}`}
      visible={visible}
      className={style.modal}
      onOk={() => {
        useRequest(
          updateCdlOrder({
            bookId: data.id,
            author: (data as IDetailedCdlOrder)?.author,
            backToKarmsDate: (data as IDetailedCdlOrder)?.backToKarmsDate,
            bobcatPermanentLink: (data as IDetailedCdlOrder)?.bobcatPermanentLink,
            cdlItemStatus: (data as IDetailedCdlOrder)?.cdlItemStatus,
            circPdfUrl: (data as IDetailedCdlOrder)?.circPdfUrl,
            dueDate: (data as IDetailedCdlOrder)?.dueDate,
            filePassword: (data as IDetailedCdlOrder)?.filePassword,
            orderPurchasedDate: (data as IDetailedCdlOrder)?.orderPurchasedDate,
            orderRequestDate: (data as IDetailedCdlOrder)?.orderPurchasedDate,
            pages: (data as IDetailedCdlOrder)?.pages,
            pdfDeliveryDate: (data as IDetailedCdlOrder)?.pdfDeliveryDate,
            physicalCopyStatus: (data as IDetailedCdlOrder)?.physicalCopyStatus,
            scanningVendorPaymentDate: (data as IDetailedCdlOrder)?.scanningVendorPaymentDate,
            vendorFileUrl: (data as IDetailedCdlOrder)?.vendorFileUrl,
          })
        ).then(() => {
          message.success('Successfully updated order!');
          setVisible(false);
        });
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
              <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={style.form}>
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
                <Form.Item label="Library Note">
                  <Input.TextArea rows={2} value={data?.libraryNote} />
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
              <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={style.form}>
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
          {/* CDL Information */}
          {data?.tags.includes('CDL') && (
            <Col span={24}>
              <Card size="small" title={<Typography.Title level={5}>CDL Information</Typography.Title>}>
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={style.form}>
                  <Row gutter={[16, 16]}>
                    {/* CDL Item Status */}
                    <Col span={12}>
                      <Form.Item label="CDL Item Status">
                        <Select
                          options={metadata.cdlTags.map((item) => ({
                            value: item,
                            label: item !== null ? item : '(Empty)',
                          }))}
                          value={(data as IDetailedCdlOrder)?.cdlItemStatus[0]}
                          onChange={(value) => {
                            setData({
                              ...data,
                              cdlItemStatus: [value],
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Physical Copy Status */}
                    <Col span={12}>
                      <Form.Item label="Physical Copy Status">
                        <Select
                          options={metadata.physicalCopyStatus.map((item) => ({
                            value: item,
                            label: item !== null ? item : '(Empty)',
                          }))}
                          value={(data as IDetailedCdlOrder)?.physicalCopyStatus}
                          onChange={(value) => {
                            setData({
                              ...data,
                              physicalCopyStatus: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Order Request Date */}
                    <Col span={12}>
                      <Form.Item label="Order Request Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).orderRequestDate !== null
                              ? moment((data as IDetailedCdlOrder).orderRequestDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              orderRequestDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Scanning Vendor Payment Date */}
                    <Col span={12}>
                      <Form.Item label="Scanning Vendor Payment Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).scanningVendorPaymentDate !== null
                              ? moment((data as IDetailedCdlOrder).scanningVendorPaymentDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              scanningVendorPaymentDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* PDF Delivery Date */}
                    <Col span={12}>
                      <Form.Item label="PDF Delivery Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).pdfDeliveryDate !== null
                              ? moment((data as IDetailedCdlOrder).pdfDeliveryDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              pdfDeliveryDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Back to KARMS Date */}
                    <Col span={12}>
                      <Form.Item label="Back to KARMS Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).backToKarmsDate !== null
                              ? moment((data as IDetailedCdlOrder).backToKarmsDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              backToKarmsDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Order Purchase Date */}
                    <Col span={12}>
                      <Form.Item label="Order Purchase Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).orderPurchasedDate !== null
                              ? moment((data as IDetailedCdlOrder).orderPurchasedDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              orderPurchasedDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Due Date */}
                    <Col span={12}>
                      <Form.Item label="Due Date">
                        <DatePicker
                          className={style.datePicker}
                          format={dateFormat}
                          value={
                            (data as IDetailedCdlOrder).dueDate !== null
                              ? moment((data as IDetailedCdlOrder).dueDate)
                              : null
                          }
                          onChange={(value) => {
                            setData({
                              ...data,
                              dueDate: value !== null ? value.format(dateFormat) : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Author Input */}
                    <Col span={12}>
                      <Form.Item label="Author">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.author}
                          onChange={(e) => {
                            setData({
                              ...data,
                              author: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Pages Input */}
                    <Col span={12}>
                      <Form.Item label="Pages">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.pages}
                          onChange={(e) => {
                            setData({
                              ...data,
                              pages: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* BobCat Permanent Link */}
                    <Col span={24}>
                      <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="BobCat Permanent Link">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.bobcatPermanentLink}
                          onChange={(e) => {
                            setData({
                              ...data,
                              bobcatPermanentLink: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Circ PDF URL */}
                    <Col span={24}>
                      <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="Circ PDF URL">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.circPdfUrl}
                          onChange={(e) => {
                            setData({
                              ...data,
                              circPdfUrl: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Vendor File URL */}
                    <Col span={24}>
                      <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="Vendor File URL">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.vendorFileUrl}
                          onChange={(e) => {
                            setData({
                              ...data,
                              vendorFileUrl: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* File Password */}
                    <Col span={24}>
                      <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="File Password">
                        <Input.TextArea
                          {...textAreaAutoSize}
                          value={(data as IDetailedCdlOrder)?.filePassword}
                          onChange={(e) => {
                            setData({
                              ...data,
                              filePassword: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          )}
          {/* Buttons */}
          <Col span={24}>
            <Space className={style.buttons}>
              {!data?.tags.includes('CDL') ? (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Register as CDL Order',
                      content: 'Confirm to register this order as a CDL order?',
                      onOk: () => {
                        useRequest(addCdlOrder({ orderId: data.id })).then((r) => {
                          if (r !== undefined) {
                            message.success('Successfully added CDL order!');
                            onReload();
                          }
                        });
                      },
                    });
                  }}
                >
                  Register as CDL
                </Button>
              ) : (
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Remove CDL Order',
                      content: 'Confirm to remove this order from CDL order list?',
                      onOk: () => {
                        useRequest(removeCdlOrder({ orderId: data.id })).then((r) => {
                          if (r !== undefined) {
                            message.success('Successfully removed CDL order!');
                            onReload();
                          }
                        });
                      },
                    });
                  }}
                >
                  Remove CDL
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export { OrderModal };
