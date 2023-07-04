import * as React from 'react';

import { FileUploader } from '@/components/FileUploader';
import { useUploadSensitiveDataMutation } from '@/services/data';

const SensitiveData: React.FC = () => {
  const [uploadSensitiveData, { isUninitialized, isLoading, isSuccess, isError, reset }] =
    useUploadSensitiveDataMutation();

  return (
    <FileUploader
      uploadData={uploadSensitiveData}
      isUninitialized={isUninitialized}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      reset={reset}
      title={
        <>
          <span className="font-bold">Click</span> or <span className="font-bold">Drag</span> the file to this area.
        </>
      }
      hint="Here you can upload the latest Sensitive Table."
      loadingDuration={15}
      loadingTitle="Do not close the page while uploading Sensitive Table."
      loadingHint="It takes up to 10-20 seconds."
      successTitle="Successfully Uploaded Sensitive Table"
      successHint="You can go to the Manage Orders page to check the results."
      errorTitle="Failed to Upload Sensitive Table"
      errorHint="Please double check the file and try again."
    />
  );
};

export { SensitiveData };
