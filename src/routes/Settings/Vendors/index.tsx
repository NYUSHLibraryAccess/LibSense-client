import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, message, Table } from 'antd';

import { GeneralAction } from '@/components/GeneralAction';
import { StyledModal } from '@/components/StyledModal';
import {
  useAllVendorsQuery,
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useUpdateVendorMutation,
} from '@/services/vendors';
import { Vendor } from '@/types/Vendor';

type ModalName = 'create' | 'edit' | 'delete' | null;

const VendorsContext = React.createContext<{
  visibleModal: ModalName;
  setVisibleModal: React.Dispatch<React.SetStateAction<ModalName>>;
  currentVendor: Vendor;
  setCurrentVendor: React.Dispatch<React.SetStateAction<Vendor>>;
  refetch: () => void;
}>(null);

const CreateModal: React.FC = () => {
  const { visibleModal, setVisibleModal, refetch } = useContext(VendorsContext);
  const [createVendor, { isLoading, isSuccess, isError }] = useCreateVendorMutation();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      createVendor({
        // This field cannot be empty, so no fallback value needed.
        vendorCode: form.getFieldValue('vendorCode'),
        // If the CheckBox is untouched, its form value will be undefined.
        // If it is checked then unchecked, its form value will be false.
        // Always send false.
        local: form.getFieldValue('local') ?? false,
        // If the InputNumber is untouched, its form value will be undefined.
        // If it is touched then cleared, its form value will be null.
        // Always send null to server.
        notifyIn: form.getFieldValue('notifyIn') ?? null,
      });
    } catch (e) {
      // Do nothing on form validation error
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(`Vendor ${form.getFieldValue('vendorCode')} created.`);
      refetch();
      setVisibleModal(null);
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to create the vendor ${form.getFieldValue('vendorCode')}.`);
    }
  }, [isError]);

  return (
    <StyledModal
      title="Create Vendor"
      visible={visibleModal === 'create'}
      width={500}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields();
        setVisibleModal(null);
      }}
      onOk={handleSubmit}
    >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          name="vendorCode"
          label="Vendor Code"
          className="mb-2"
          rules={[
            {
              required: true,
              message: 'Please input the vendor code!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name="local" label="Local Vendor" className="mb-2" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="notifyIn" label="Notify In" className="mb-2">
          <InputNumber min={0} addonAfter="Days" />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

const UpdateModal: React.FC = () => {
  const { visibleModal, setVisibleModal, currentVendor, setCurrentVendor, refetch } = useContext(VendorsContext);
  const [updateVendor, { isLoading, isSuccess, isError }] = useUpdateVendorMutation();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      updateVendor({
        vendorCode: form.getFieldValue('vendorCode'),
        local: form.getFieldValue('local') ?? false,
        // Since the form field values are set when the modal gets visible,
        // and the server always send the notifyIn field as a number or null,
        // so the value of the InputNumber can only be a number or null.
        notifyIn: form.getFieldValue('notifyIn'),
      });
    } catch (e) {
      // Do nothing on form validation error
    }
  }, []);

  // Set form field values when the modal gets visible
  useEffect(() => {
    if (visibleModal === 'edit' && currentVendor !== null) {
      form.setFieldsValue(currentVendor);
    }
  }, [visibleModal, currentVendor]);

  useEffect(() => {
    if (isSuccess) {
      message.success(`Vendor ${currentVendor?.vendorCode} updated.`);
      refetch();
      setVisibleModal(null);
      setCurrentVendor(null);
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to update the vendor ${currentVendor?.vendorCode}.`);
    }
  }, [isError]);

  return (
    <StyledModal
      title="Edit Vendor"
      visible={visibleModal === 'edit' && currentVendor !== null}
      width={500}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields();
        setVisibleModal(null);
        setCurrentVendor(null);
      }}
      onOk={handleSubmit}
    >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          name="vendorCode"
          label="Vendor Code"
          className="mb-2"
          rules={[
            {
              required: true,
              message: 'Please input the vendor code!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name="local" label="Local Vendor" className="mb-2" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="notifyIn" label="Notify In" className="mb-2">
          <InputNumber min={0} addonAfter="Days" />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

const DeleteModal: React.FC = () => {
  const { visibleModal, setVisibleModal, currentVendor, setCurrentVendor, refetch } = useContext(VendorsContext);
  const [deleteVendor, { isLoading, isSuccess, isError }] = useDeleteVendorMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(`Vendor ${currentVendor?.vendorCode} deleted.`);
      refetch();
      setVisibleModal(null);
      setCurrentVendor(null);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to delete the vendor ${currentVendor?.vendorCode}.`);
    }
  }, [isError]);

  return (
    <StyledModal
      title="Delete Vendor"
      visible={visibleModal === 'delete' && currentVendor !== null}
      width={420}
      confirmLoading={isLoading}
      onCancel={() => {
        setVisibleModal(null);
        setCurrentVendor(null);
      }}
      onOk={() => {
        deleteVendor({
          vendorCode: currentVendor?.vendorCode,
        });
      }}
    >
      Would you like to delete the vendor {currentVendor?.vendorCode}?
    </StyledModal>
  );
};

const Vendors: React.FC = () => {
  const [visibleModal, setVisibleModal] = useState<ModalName>(null);
  const [currentVendor, setCurrentVendor] = useState<Vendor>(null);
  const { data, isFetching, isError, refetch } = useAllVendorsQuery();
  const contextValue = useMemo(
    () => ({
      visibleModal,
      setVisibleModal,
      currentVendor,
      setCurrentVendor,
      refetch,
    }),
    [visibleModal, currentVendor]
  );

  useEffect(() => {
    if (isError) {
      message.error('Failed to fetch vendors from server.');
    }
  }, [isError]);

  return (
    <VendorsContext.Provider value={contextValue}>
      <Button
        type="primary"
        className="mb-4"
        onClick={() => {
          setVisibleModal('create');
        }}
      >
        <PlusOutlined /> Create Vendor
      </Button>
      <Table<Vendor>
        dataSource={data}
        rowKey={({ vendorCode }) => vendorCode}
        columns={[
          {
            title: 'Vendor Code',
            dataIndex: 'vendorCode',
          },
          {
            title: 'Local Vendor',
            dataIndex: 'local',
            render: (value) => (value ? 'Yes' : 'No'),
          },
          {
            title: 'Notify In',
            dataIndex: 'notifyIn',
            render: (value) => value ?? '-',
          },
          {
            title: 'Actions',
            key: 'actions',
            // Set width to 1 to shrink the column to fit its content
            width: 1,
            render: (value, record) => (
              <div className="flex gap-2 text-xs">
                <GeneralAction
                  onClick={() => {
                    setVisibleModal('edit');
                    setCurrentVendor(record);
                  }}
                >
                  Edit...
                </GeneralAction>
                <GeneralAction
                  onClick={() => {
                    setVisibleModal('delete');
                    setCurrentVendor(record);
                  }}
                >
                  Delete...
                </GeneralAction>
              </div>
            ),
          },
        ]}
        size="small"
        bordered
        loading={isFetching}
      />
      <CreateModal />
      <UpdateModal />
      <DeleteModal />
    </VendorsContext.Provider>
  );
};

export { Vendors };
