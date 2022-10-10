import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Checkbox, DatePicker, Form, FormItemProps, Input, message, Select, Spin } from 'antd';
import jsConvert from 'js-convert-case';
import { isEqual } from 'lodash-es';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import { StyledModal } from '@/components/StyledModal';
import { OrderTableContext } from '@/routes/OrderTable';
import { useMetaDataQuery } from '@/services/data';
import {
  useCreateCdlMutation,
  useDeleteCdlMutation,
  useOrderDetailQuery,
  useUpdateOrderMutation,
} from '@/services/orders';
import { getClassName } from '@/utils/getClassName';
import { CdlOrder } from '@/types/CdlOrder';
import { GeneralOrder } from '@/types/GeneralOrder';
import { MetaData } from '@/types/MetaData';

type FormFieldProps = {
  dataIndex: keyof (GeneralOrder & CdlOrder);
  title?: string;
  colSpan?: number;
  labelColSpan?: FormItemProps['labelCol']['span'];
  wrapperColSpan?: FormItemProps['wrapperCol']['span'];
} & (
  | {
      type: 'input' | 'textarea';
      readOnly?: boolean;
    }
  | {
      type: 'datepicker';
    }
  | {
      type: 'select';
      metaDataIndex: keyof Omit<MetaData, 'oldestDate'>;
    }
);

const itemInfoFields: FormFieldProps[] = [
  { dataIndex: 'title', type: 'input', readOnly: true },
  { dataIndex: 'barcode', type: 'input', readOnly: true },
  { dataIndex: 'material', title: 'Material Type', type: 'input', readOnly: true },
  { dataIndex: 'ipsCode', title: 'IPS Code', type: 'input', readOnly: true },
  { dataIndex: 'ips', title: 'IPS', type: 'input', readOnly: true },
  { dataIndex: 'ipsUpdateDate', title: 'IPS Changed Date', type: 'input', readOnly: true },
  { dataIndex: 'updateDate', title: 'Item Changed Date', type: 'input', readOnly: true },
  { dataIndex: 'ipsCodeOperator', title: 'Who Changed Item', type: 'input', readOnly: true },
  { dataIndex: 'bsn', title: 'BSN', type: 'input', readOnly: true },
  { dataIndex: 'libraryNote', type: 'textarea', readOnly: true },
];
const orderInfoFields: FormFieldProps[] = [
  { dataIndex: 'orderNumber', type: 'input', readOnly: true },
  { dataIndex: 'createdDate', title: 'Order Created Date', type: 'input', readOnly: true },
  { dataIndex: 'arrivalText', title: 'Arrival or Not', type: 'input', readOnly: true },
  { dataIndex: 'arrivalDate', title: 'Order Arrival Date', type: 'input', readOnly: true },
  { dataIndex: 'arrivalOperator', title: 'Who Marked Arrival', type: 'input', readOnly: true },
  { dataIndex: 'arrivalStatus', type: 'input', readOnly: true },
  { dataIndex: 'ipsDate', title: 'Order Status Date', type: 'input', readOnly: true },
  { dataIndex: 'orderStatusUpdateDate', title: 'Order Changed Date', type: 'input', readOnly: true },
  { dataIndex: 'vendorCode', type: 'input', readOnly: true },
  { dataIndex: 'totalPrice', type: 'input', readOnly: true },
];
const cdlInfoFields: FormFieldProps[] = [
  {
    dataIndex: 'cdlItemStatus',
    title: 'CDL Item Status',
    type: 'select',
    metaDataIndex: 'cdlTags',
    labelColSpan: 12,
    wrapperColSpan: 12,
  },
  {
    dataIndex: 'physicalCopyStatus',
    type: 'select',
    metaDataIndex: 'physicalCopyStatus',
    labelColSpan: 12,
    wrapperColSpan: 12,
  },
  { dataIndex: 'orderRequestDate', type: 'datepicker', labelColSpan: 12, wrapperColSpan: 12 },
  { dataIndex: 'scanningVendorPaymentDate', type: 'datepicker', labelColSpan: 12, wrapperColSpan: 12 },
  {
    dataIndex: 'pdfDeliveryDate',
    title: 'PDF Delivery Date',
    type: 'datepicker',
    labelColSpan: 12,
    wrapperColSpan: 12,
  },
  {
    dataIndex: 'backToKarmsDate',
    title: 'Back to KARMS Date',
    type: 'datepicker',
    labelColSpan: 12,
    wrapperColSpan: 12,
  },
  { dataIndex: 'orderPurchasedDate', type: 'datepicker', labelColSpan: 12, wrapperColSpan: 12 },
  {
    dataIndex: 'bobcatPermanentLink',
    title: 'BobCat Permanent Link',
    type: 'input',
    colSpan: 2,
    labelColSpan: 4,
    wrapperColSpan: 20,
  },
  { dataIndex: 'circPdfUrl', title: 'Circ PDF URL', type: 'input', colSpan: 2, labelColSpan: 4, wrapperColSpan: 20 },
  {
    dataIndex: 'vendorFileUrl',
    title: 'Vendor File URL',
    type: 'input',
    colSpan: 2,
    labelColSpan: 4,
    wrapperColSpan: 20,
  },
  { dataIndex: 'filePassword', type: 'textarea', colSpan: 2, labelColSpan: 4, wrapperColSpan: 20 },
];

const OrderEditorContext = React.createContext<{
  cachedOrderDetail: GeneralOrder | CdlOrder;
  setCachedOrderDetail: React.Dispatch<React.SetStateAction<GeneralOrder | CdlOrder>>;
  refetchOrderDetail: () => void;
}>(null);

const CdlButton: React.FC<Pick<ButtonProps, 'disabled'>> = ({ disabled }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refetchAllOrders } = useContext(OrderTableContext);
  const { cachedOrderDetail } = useContext(OrderEditorContext);
  const [createCdl, { isLoading: isCreateCdlLoading, isSuccess: isCreateCdlSuccess, isError: isCreateCdlError }] =
    useCreateCdlMutation();
  const [deleteCdl, { isLoading: isDeleteCdlLoading, isSuccess: isDeleteCdlSuccess, isError: isDeleteCdlError }] =
    useDeleteCdlMutation();

  useEffect(() => {
    if (isCreateCdlSuccess) {
      // In case orderNumber is nullish, use fallback.
      message.success(`Order ${cachedOrderDetail?.orderNumber ?? '-'} is now a CDL Order.`);
      // Changing the searchParams triggers re-fetching
      searchParams.set('cdl', 'true');
      setSearchParams(searchParams);
      // Re-fetch all orders
      refetchAllOrders();
    }
  }, [isCreateCdlSuccess]);
  useEffect(() => {
    if (isDeleteCdlSuccess) {
      // In case orderNumber is nullish, use fallback.
      message.success(`Order ${cachedOrderDetail?.orderNumber ?? '-'} is now a Regular Order.`);
      // Changing the searchParams triggers re-fetching
      searchParams.set('cdl', 'false');
      setSearchParams(searchParams);
      // Re-fetch all orders
      refetchAllOrders();
    }
  }, [isDeleteCdlSuccess]);

  useEffect(() => {
    if (isCreateCdlError) {
      // In case orderNumber is nullish, use fallback.
      message.error(`Failed to register order ${cachedOrderDetail?.orderNumber ?? '-'} as a CDL Order.`);
    }
  }, [isCreateCdlError]);
  useEffect(() => {
    if (isDeleteCdlError) {
      // In case orderNumber is nullish, use fallback.
      message.error(`Failed to register order ${cachedOrderDetail?.orderNumber ?? '-'} as a Regular Order.`);
    }
  }, [isDeleteCdlError]);

  return cachedOrderDetail?.tags.includes('CDL') ? (
    <Button
      className="float-left"
      loading={isDeleteCdlLoading}
      onClick={() => {
        deleteCdl({
          bookId: cachedOrderDetail?.id,
        });
      }}
      disabled={disabled}
    >
      <MinusOutlined /> Remove CDL Order
    </Button>
  ) : (
    <Button
      className="float-left"
      loading={isCreateCdlLoading}
      onClick={() => {
        createCdl({
          bookId: cachedOrderDetail?.id,
        });
      }}
      disabled={disabled}
    >
      <PlusOutlined /> Create CDL Order
    </Button>
  );
};

const UpdateButton: React.FC<Pick<ButtonProps, 'disabled'>> = ({ disabled }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refetchAllOrders } = useContext(OrderTableContext);
  const { cachedOrderDetail } = useContext(OrderEditorContext);
  const [updateOrder, { isLoading, isSuccess, isError }] = useUpdateOrderMutation();

  const handleUpdate = useCallback(() => {
    // cachedOrderDetail must be CdlOrder
    const cdl = Object.fromEntries(
      cdlInfoFields.map(({ dataIndex }) => [dataIndex, (cachedOrderDetail as CdlOrder)?.[dataIndex] || null])
    );
    // Setting one field to null can delete this field.
    updateOrder({
      bookId: cachedOrderDetail?.id,
      trackingNote: cachedOrderDetail?.trackingNote || null,
      checked: cachedOrderDetail?.checked,
      attention: cachedOrderDetail?.attention,
      // If it is not checked, or the overrideReminderTime is empty, send null to delete this field.
      overrideReminderTime: (cachedOrderDetail?.checked && cachedOrderDetail?.overrideReminderTime) || null,
      ...(searchParams.get('cdl') === 'true' ? { cdl } : null),
    });
  }, [cachedOrderDetail, searchParams.get('cdl')]);

  useEffect(() => {
    if (isSuccess) {
      // In case orderNumber is nullish, use fallback.
      message.success(`Order ${cachedOrderDetail?.orderNumber ?? '-'} updated.`);
      // Re-fetch all orders
      refetchAllOrders();
      // Close modal
      searchParams.delete('detail');
      searchParams.delete('cdl');
      setSearchParams(searchParams);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to update order ${cachedOrderDetail?.orderNumber ?? '-'}.`);
    }
  }, [isError]);

  return (
    <Button type="primary" loading={isLoading} onClick={handleUpdate} disabled={disabled}>
      Update
    </Button>
  );
};

const FormField: React.FC<FormFieldProps> = (props) => {
  const { cachedOrderDetail, setCachedOrderDetail } = useContext(OrderEditorContext);
  const { data: metaData } = useMetaDataQuery();

  return (
    <Form.Item
      label={props.title || jsConvert.toHeaderCase(props.dataIndex)}
      labelCol={{ span: props.labelColSpan ?? 8 }}
      wrapperCol={{ span: props.wrapperColSpan ?? 16 }}
      className={getClassName('mb-0', props.colSpan && `col-span-${props.colSpan}`)}
    >
      {props.type === 'input' && (
        <Input
          // Assume the type of cachedData is the union of GeneralOrder and CdlOrder, and assume the value is of string type.
          value={
            ((cachedOrderDetail as GeneralOrder & CdlOrder)?.[props.dataIndex] as string) || (props.readOnly ? '-' : '')
          }
          onChange={(event) => {
            setCachedOrderDetail((prevState) => ({
              ...prevState,
              [props.dataIndex]: event.target.value,
            }));
          }}
          allowClear
          readOnly={props.readOnly}
        />
      )}
      {props.type === 'textarea' && (
        <Input.TextArea
          // Assume the type of cachedData is the union of GeneralOrder and CdlOrder, and assume the value is of string type.
          value={
            ((cachedOrderDetail as GeneralOrder & CdlOrder)?.[props.dataIndex] as string) || (props.readOnly ? '-' : '')
          }
          onChange={(event) => {
            setCachedOrderDetail((prevState) => ({
              ...prevState,
              [props.dataIndex]: event.target.value,
            }));
          }}
          allowClear
          readOnly={props.readOnly}
        />
      )}
      {props.type === 'datepicker' && (
        <DatePicker
          className="w-full"
          value={
            // Assume the type of cachedData is the union of GeneralOrder and CdlOrder
            (cachedOrderDetail as GeneralOrder & CdlOrder)?.[props.dataIndex]
              ? // Assume the type of cachedData is the union of GeneralOrder and CdlOrder, and assume the value is of string type.
                moment((cachedOrderDetail as GeneralOrder & CdlOrder)?.[props.dataIndex] as string)
              : null
          }
          onChange={(date, dateString) => {
            setCachedOrderDetail((prevState) => ({
              ...prevState,
              [props.dataIndex]: dateString,
            }));
          }}
          allowClear
          placeholder=""
        />
      )}
      {props.type === 'select' && (
        <Select
          showSearch
          allowClear
          // Assume the type of cachedData is the union of GeneralOrder and CdlOrder
          value={(cachedOrderDetail as GeneralOrder & CdlOrder)?.[props.dataIndex]}
          options={metaData?.[props.metaDataIndex].map((value) => ({
            label: value ?? '(Empty)',
            value,
          }))}
          onChange={(value) => {
            setCachedOrderDetail((prevState) => ({
              ...prevState,
              [props.dataIndex]: value,
            }));
          }}
        />
      )}
    </Form.Item>
  );
};

const OrderEditor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: orderDetail,
    isFetching,
    isSuccess,
    isError,
    refetch: refetchOrderDetail,
  } = useOrderDetailQuery(
    {
      bookId: parseInt(searchParams.get('detail')),
      cdlView: searchParams.get('cdl') === 'true',
    },
    {
      skip: !searchParams.has('detail') || !searchParams.has('cdl'),
      refetchOnMountOrArgChange: true,
    }
  );
  const [cachedOrderDetail, setCachedOrderDetail] = useState<typeof orderDetail>();

  // Update cached data when data changes
  useEffect(() => {
    if (isSuccess && orderDetail) {
      setCachedOrderDetail(orderDetail);
    }
  }, [isSuccess, orderDetail]);

  // Show error message on error
  useEffect(() => {
    if (isError) {
      message.error('Failed to fetch order details from server.');
    }
  }, [isError]);

  const handleClose = useCallback(() => {
    searchParams.delete('detail');
    searchParams.delete('cdl');
    setSearchParams(searchParams);
  }, [searchParams]);

  const contextValue = useMemo(
    () => ({
      cachedOrderDetail,
      setCachedOrderDetail,
      refetchOrderDetail,
    }),
    [cachedOrderDetail]
  );

  return (
    <OrderEditorContext.Provider value={contextValue}>
      <StyledModal
        title="Edit Order"
        visible={searchParams.has('detail') && searchParams.has('cdl')}
        footer={
          <>
            <CdlButton disabled={isFetching} />
            <Button onClick={handleClose} disabled={isFetching}>
              Close
            </Button>
            <UpdateButton disabled={isFetching || isEqual(orderDetail, cachedOrderDetail)} />
          </>
        }
        width={1200}
        bodyStyle={{
          padding: 0,
        }}
        centered
        maskClosable={false}
        onCancel={handleClose}
      >
        <Spin spinning={isFetching} tip={<div className="mt-2">Loading...</div>}>
          <Scrollbars style={{ height: 'calc(100vh - 200px)' }}>
            <Form className="px-8 py-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="rounded-md outline outline-1 outline-gray-200 px-8 py-6">
                  <div className="grid grid-cols-1 gap-y-3">
                    {itemInfoFields.map((field, index) => (
                      <FormField key={index} {...field} />
                    ))}
                    <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
                      <span className="text-gray-400 select-none">
                        <InfoCircleOutlined /> This section is read-only.
                      </span>
                    </Form.Item>
                  </div>
                </div>
                <div className="rounded-md outline outline-1 outline-gray-200 px-8 py-6">
                  <div className="grid grid-cols-1 gap-y-3">
                    {orderInfoFields.map((field, index) => (
                      <FormField key={index} {...field} />
                    ))}
                    <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
                      <span className="text-gray-400 select-none">
                        <InfoCircleOutlined /> This section is read-only.
                      </span>
                    </Form.Item>
                  </div>
                </div>
                {searchParams.get('cdl') === 'true' && (
                  <div className="rounded-md outline outline-1 outline-gray-200 px-8 py-6 col-span-2">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {cdlInfoFields.map((field, index) => (
                        <FormField key={index} {...field} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="rounded-md outline outline-1 outline-gray-200 px-8 py-6 col-span-2">
                  <div className="grid grid-cols-1 gap-y-3">
                    <Form.Item label="Tracking Note" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="mb-0">
                      <Input.TextArea
                        value={cachedOrderDetail?.trackingNote}
                        onChange={(event) => {
                          setCachedOrderDetail((prevState) => ({
                            ...prevState,
                            trackingNote: event.target.value,
                          }));
                        }}
                        allowClear
                        rows={4}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="rounded-md outline outline-1 outline-gray-200 px-8 py-6 col-span-2">
                  <div className="grid grid-cols-1 gap-y-3">
                    <Form.Item wrapperCol={{ offset: 4 }} className="mb-0">
                      <Checkbox
                        checked={cachedOrderDetail?.checked}
                        onChange={(event) => {
                          setCachedOrderDetail((prevState) => ({
                            ...prevState,
                            checked: event.target.checked,
                          }));
                        }}
                      >
                        Mark as Tracked until
                      </Checkbox>
                      <DatePicker
                        className="ml-2 w-48"
                        value={
                          cachedOrderDetail?.overrideReminderTime
                            ? moment(cachedOrderDetail?.overrideReminderTime)
                            : null
                        }
                        onChange={(date, dateString) => {
                          setCachedOrderDetail((prevState) => ({
                            ...prevState,
                            overrideReminderTime: dateString,
                          }));
                        }}
                        allowClear
                        placeholder="Forever"
                        disabled={!cachedOrderDetail?.checked}
                      />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4 }} className="mb-0">
                      <Checkbox
                        checked={cachedOrderDetail?.attention}
                        onChange={(event) => {
                          setCachedOrderDetail((prevState) => ({
                            ...prevState,
                            attention: event.target.checked,
                          }));
                        }}
                      >
                        Mark as Attention-Required
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </Scrollbars>
        </Spin>
      </StyledModal>
    </OrderEditorContext.Provider>
  );
};

export { OrderEditor };
