import React from 'react';

import { FileUploader } from '@/components/FileUploader';
import { StyledCard } from '@/components/StyledCard';
import { useUploadDataMutation } from '@/services/data';

const UploadData: React.FC = () => {
  const [uploadData, { isUninitialized, isLoading, isSuccess, isError, reset }] = useUploadDataMutation();

  return (
    <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
      <div className="my-8 text-xl font-bold select-none">Upload Data</div>
      <div className="grid gap-6 grid-cols-1">
        <StyledCard>
          <FileUploader
            uploadData={uploadData}
            isUninitialized={isUninitialized}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            reset={reset}
            title={
              <>
                <span className="font-bold">Click</span> or <span className="font-bold">Drag</span> the file to this
                area.
              </>
            }
            hint="Here you can upload the latest New York Table."
            loadingDuration={45}
            loadingTitle="Do not close the page while uploading New York Table."
            loadingHint="It takes up to 30-60 seconds."
            successTitle="Successfully Uploaded New York Table"
            successHint="You can go to the Manage Orders page to check the results."
            errorTitle="Failed to Upload New York Table"
            errorHint="Please double check the file and try again."
          />
        </StyledCard>
      </div>
    </div>
  );
};

export { UploadData };
