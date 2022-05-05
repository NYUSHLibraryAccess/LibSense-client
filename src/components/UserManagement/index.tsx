import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Col, Collapse, Form, Input, message, Modal, Row, Select, Space, Typography } from 'antd';
import { getHash, useRequest } from '@/utils';
import { IRole } from '@/utils/interfaces';
import { IRootState } from '@/utils/store';
import { listUsers } from '@/api/listUsers';
import { removeUser } from '@/api/removeUser';
import { addUser } from '@/api/addUser';

const User: React.FC<{
  username: string;
  role: IRole;
  onRemove: () => void;
  allowRemove: boolean;
}> = ({ username, role, onRemove, allowRemove }) => {
  return (
    <Card>
      <Space direction="horizontal" size={20}>
        <Avatar style={{ backgroundColor: '#d08700' }}>{username?.slice(0, 1).toUpperCase()}</Avatar>
        <Space direction="vertical">
          <strong>{username}</strong>
          <span>{role}</span>
          <Button
            size="small"
            disabled={!allowRemove}
            onClick={() => {
              Modal.confirm({
                title: `Delete user ${username}`,
                content: `Confirm to delete user ${username}?`,
                onOk: onRemove,
              });
            }}
          >
            Remove
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

const UserManagement: React.FC = () => {
  const username = useSelector<IRootState>(({ auth }) => auth.username);

  const [users, setUsers] = useState<{ username: string; role: IRole }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    useRequest(listUsers()).then((r) => {
      if (r !== undefined) {
        setUsers(r);
      }
    });
  }, []);

  return (
    <Card title={<Typography.Title level={4}>User Management</Typography.Title>}>
      <Row gutter={[16, 16]}>
        {users.map((user, index) => (
          <Col span={8} key={index}>
            <User
              username={user?.username}
              role={user?.role}
              allowRemove={username !== user?.username}
              onRemove={() => {
                useRequest(
                  removeUser({
                    username: user.username,
                  })
                ).then((r) => {
                  if (r !== undefined) {
                    message.success('Successfully removed the account!');
                  }
                  useRequest(listUsers()).then((r) => {
                    if (r !== undefined) {
                      setUsers(r);
                    }
                  });
                });
              }}
            />
          </Col>
        ))}
        <Col span={24}>
          <Collapse>
            <Collapse.Panel key="addNewUser" header="Add New User">
              <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={async (values) => {
                  useRequest(
                    addUser({
                      username: values.username,
                      role: values.role,
                      password: getHash(values.password),
                    })
                  ).then((r) => {
                    if (r !== undefined) {
                      Modal.success({
                        title: 'Success',
                        content: 'Added user successfully!',
                      });
                      form.resetFields();
                      useRequest(listUsers()).then((r) => {
                        if (r !== undefined) {
                          setUsers(r);
                        }
                      });
                    }
                  });
                }}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: 'Please choose Username!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please choose Role!' }]}>
                  <Select>
                    <Select.Option value="System Admin">System Admin</Select.Option>
                    <Select.Option value="User">User</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input Password!' }]}
                >
                  <Input type="password" />
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
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    </Card>
  );
};

export { UserManagement };
