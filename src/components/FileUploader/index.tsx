import * as React from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Upload, Card, Result, Form, Divider, Space, Typography, message, Spin, Modal } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { urlPrefix } from '@/utils/constants';
import style from './style.module.less';

const FileUploader: React.FC = observer(() => {
  const [status, setStatus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  return (
    <Spin spinning={!status && uploading} tip="Please wait... It may take up to 1 minute to upload the file...">
      <Card title={<Typography.Title level={4}>Upload Data</Typography.Title>}>
        {!status && (
          <Form layout="vertical">
            <Form.Item label="File">
              <Upload.Dragger
                className={style.dragBox}
                name="file"
                fileList={fileList}
                onChange={(params) => {
                  if (params.file.status === 'done') {
                    setStatus(true);
                  }
                }}
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}
                onRemove={() => {
                  setFileList([]);
                }}
                maxCount={1}
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
                <Typography.Text type="secondary">(Please only upload the latest New York table)</Typography.Text>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  loading={uploading}
                  onClick={() => {
                    if (fileList.length === 0) {
                      message.warning('Please choose the file to upload!');
                      return;
                    }
                    const formData = new FormData();
                    formData.append('file', fileList[0]);
                    setUploading(true);
                    fetch(`${urlPrefix}/v1/data/upload`, {
                      method: 'POST',
                      body: formData,
                    }).then((r) => {
                      if (r.status === 200) {
                        setUploading(false);
                        setStatus(true);
                      } else {
                        Modal.error({
                          title: 'Upload Failed',
                          content: `There is an error uploading and parsing the file. Please make sure you uploaded the latest file.`,
                        });
                        setFileList([]);
                        setUploading(false);
                      }
                    });
                  }}
                >
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
    </Spin>
  );
});

export { FileUploader };
