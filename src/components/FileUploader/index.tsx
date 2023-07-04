import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Progress, Result, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

const ProgressBar: React.FC<{ duration: number; title: string | JSX.Element; hint: string | JSX.Element }> = ({
  duration,
  title,
  hint,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setPercentage(0);
    const id = setInterval(() => {
      setPercentage((prevState) => (prevState < 99 ? prevState + 1 : prevState));
    }, (duration * 1000) / 100);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <Progress
        strokeColor={{
          '0%': '#7c3aed',
          '100%': '#c4b5fd',
        }}
        percent={percentage}
      />
      <p className="text-gray-600">{title}</p>
      <p className="text-gray-400">{hint}</p>
    </>
  );
};

const FileUploader: React.FC<{
  uploadData: (data: FormData) => void;
  isUninitialized: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
  title: string | JSX.Element;
  hint: string | JSX.Element;
  loadingDuration: number;
  loadingTitle: string | JSX.Element;
  loadingHint: string | JSX.Element;
  successTitle: string | JSX.Element;
  successHint: string | JSX.Element;
  errorTitle: string | JSX.Element;
  errorHint: string | JSX.Element;
}> = ({
  uploadData,
  isUninitialized,
  isLoading,
  isSuccess,
  isError,
  reset,
  title,
  hint,
  loadingDuration,
  loadingTitle,
  loadingHint,
  successTitle,
  successHint,
  errorTitle,
  errorHint,
}) => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<RcFile[]>([]);

  return (
    <>
      {(isUninitialized || isLoading) && (
        <>
          <Upload.Dragger
            maxCount={1}
            beforeUpload={(file) => {
              setFileList((prevState) => [...prevState, file]);
              return false;
            }}
            onRemove={(file) => {
              setFileList((prevState) => prevState.filter(({ uid }) => uid !== file.uid));
            }}
            disabled={isLoading}
          >
            <div className="h-48 px-8 flex flex-col justify-center">
              {isUninitialized && (
                <>
                  <div className="text-violet-600 text-6xl mb-4">
                    <CloudUploadOutlined />
                  </div>
                  <div className="text-gray-600 text-base mb-2">{title}</div>
                  <div className="text-gray-400 text-sm">{hint}</div>
                </>
              )}
              {isLoading && <ProgressBar duration={loadingDuration} title={loadingTitle} hint={loadingHint} />}
            </div>
          </Upload.Dragger>
          <Button
            type="primary"
            disabled={fileList.length === 0 || isLoading}
            onClick={() => {
              const formData = new FormData();
              formData.append('file', fileList[0]);
              uploadData(formData);
            }}
            className="mt-4 float-right"
          >
            Upload
          </Button>
        </>
      )}
      {isSuccess && (
        <Result
          status="success"
          title={successTitle}
          subTitle={successHint}
          extra={
            <>
              <Button type="primary" onClick={() => navigate('/manageOrders')}>
                Go to Manage Orders
              </Button>
              <Button onClick={() => reset()}>Go Back</Button>
            </>
          }
        />
      )}
      {isError && (
        <Result
          status="error"
          title={errorTitle}
          subTitle={errorHint}
          extra={
            <>
              <Button type="primary" onClick={() => reset()}>
                Go Back
              </Button>
            </>
          }
        />
      )}
    </>
  );
};

export { FileUploader };
