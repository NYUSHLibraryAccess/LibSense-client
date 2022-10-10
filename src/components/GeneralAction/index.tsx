import React from 'react';

const GeneralAction: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = ({ children, onClick }) => {
  return (
    <span
      className="mx-1 whitespace-nowrap select-none cursor-pointer text-violet-600 transition-colors hover:text-violet-900"
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export { GeneralAction };
