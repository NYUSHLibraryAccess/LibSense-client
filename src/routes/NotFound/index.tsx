import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useTitle } from '@/hooks/useTitle';
import BrokenLinkSvg from '@/assets/broken-link.svg';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  useTitle('Page Not Found', true);

  return (
    <div className="h-screen bg-gray-50 select-none flex flex-col justify-center items-center">
      <BrokenLinkSvg className="w-20 h-20 mb-4" />
      <p className="text-gray-500 text-xl font-light mb-6">Oops, the page you requested was not found.</p>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 px-4 py-1 rounded-md ring-1 ring-gray-500 transition-colors hover:text-violet-500 hover:ring-violet-500 active:text-violet-800 active:ring-violet-800"
      >
        Back to Previous Page
      </button>
    </div>
  );
};

export { NotFound };
