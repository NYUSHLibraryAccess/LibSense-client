import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Table } from 'antd';

import { GeneralAction } from '@/components/GeneralAction';
import { StyledModal } from '@/components/StyledModal';
import { useAllUsersQuery, useCreateUserMutation, useDeleteUserMutation } from '@/services/auth';
import { getSHA256 } from '@/utils/getSHA256';
import { SystemUser } from '@/types/SystemUser';

type ModalName = 'create' | 'delete' | null;

const UsersContext = React.createContext<{
  visibleModal: ModalName;
  setVisibleModal: React.Dispatch<React.SetStateAction<ModalName>>;
  currentUser: SystemUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<SystemUser>>;
  refetch: () => void;
}>(null);

const CreateModal: React.FC = () => {
  const { visibleModal, setVisibleModal, refetch } = useContext(UsersContext);
  const [createUser, { isLoading, isSuccess, isError }] = useCreateUserMutation();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      createUser({
        // These fields cannot be empty, so no fallback values needed.
        username: form.getFieldValue('username'),
        role: form.getFieldValue('role'),
        password: await getSHA256(form.getFieldValue('password')),
      });
    } catch (e) {
      // Do nothing on form validation error
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success(`User ${form.getFieldValue('username')} created.`);
      refetch();
      setVisibleModal(null);
      form.resetFields();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to create the user ${form.getFieldValue('username')}.`);
    }
  }, [isError]);

  return (
    <StyledModal
      title="Create User"
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
          name="username"
          label="Username"
          className="mb-2"
          rules={[
            {
              required: true,
              message: 'Please input the username!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          className="mb-2"
          rules={[
            {
              required: true,
              message: 'Please select the role!',
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            options={[
              { value: 'System Admin', label: 'System Admin' },
              { value: 'User', label: 'User' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          className="mb-2"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password allowClear />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          className="mb-2"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords you entered do not match!'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password allowClear />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

const DeleteModal: React.FC = () => {
  const { visibleModal, setVisibleModal, currentUser, setCurrentUser, refetch } = useContext(UsersContext);
  const [deleteUser, { isLoading, isSuccess, isError }] = useDeleteUserMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success(`User ${currentUser?.username} deleted.`);
      refetch();
      setVisibleModal(null);
      setCurrentUser(null);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error(`Failed to delete the user ${currentUser?.username}.`);
    }
  }, [isError]);

  return (
    <StyledModal
      title="Delete User"
      visible={visibleModal === 'delete' && currentUser !== null}
      width={420}
      confirmLoading={isLoading}
      onCancel={() => {
        setVisibleModal(null);
        setCurrentUser(null);
      }}
      onOk={() => {
        deleteUser({
          username: currentUser.username,
        });
      }}
    >
      Would you like to delete the user {currentUser?.username}?
    </StyledModal>
  );
};

const Users: React.FC = () => {
  const [visibleModal, setVisibleModal] = useState<ModalName>(null);
  const [currentUser, setCurrentUser] = useState<SystemUser>(null);
  const { data, isFetching, isError, refetch } = useAllUsersQuery();
  const contextValue = useMemo(
    () => ({
      visibleModal,
      setVisibleModal,
      currentUser,
      setCurrentUser,
      refetch,
    }),
    [visibleModal, currentUser]
  );

  useEffect(() => {
    if (isError) {
      message.error('Failed to fetch users from server.');
    }
  }, [isError]);

  return (
    <UsersContext.Provider value={contextValue}>
      <Button
        type="primary"
        className="mb-4"
        onClick={() => {
          setVisibleModal('create');
        }}
      >
        <PlusOutlined /> Create User
      </Button>
      <Table<SystemUser>
        dataSource={data}
        rowKey={({ username }) => username}
        columns={[
          {
            title: 'Username',
            dataIndex: 'username',
          },
          {
            title: 'Role',
            dataIndex: 'role',
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
                    setVisibleModal('delete');
                    setCurrentUser(record);
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
      <DeleteModal />
    </UsersContext.Provider>
  );
};

export { Users };
