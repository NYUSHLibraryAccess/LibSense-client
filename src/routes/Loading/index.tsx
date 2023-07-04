import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const Loading: React.FC = () => {
  return (
    <div className="h-screen text-gray-500 bg-gray-50 select-none flex flex-col justify-center items-center gap-4">
      <LoadingOutlined style={{ fontSize: '40px' }} spin />
      <p className="text-xl font-light">Loading...</p>
    </div>
  );
};

export { Loading };
