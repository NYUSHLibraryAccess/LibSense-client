import * as React from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Upload, Card, Result, Form, Divider, Space } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import { urlPrefix } from '@/utils/constants';
import style from './style.module.less';

const FileUploader: React.FC = observer(() => {
  const [status, setStatus] = useState(false);

  return (
    <Card>
      {!status && (
        <Form>
          <Form.Item label="File">
            <Upload.Dragger
              className={style.dragBox}
              name="file"
              action={`${urlPrefix}/v1/data/upload`}
              onChange={(params) => {
                if (params.file.status === 'done') {
                  setStatus(true);
                }
              }}
            >
              <Space direction="vertical">
                <span>
                  <FileExcelOutlined /> Drag the file here
                </span>
                <Divider>or</Divider>
                Click to select the file
              </Space>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item>
            <Space className={style.buttons}>
              <Button type="primary" icon={<UploadOutlined />}>
                Upload
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
      {status && (
        <Result status="success" title="Successfully uploaded the file!" subTitle="The database is updated." />
      )}
    </Card>
  );
});

export { FileUploader };
