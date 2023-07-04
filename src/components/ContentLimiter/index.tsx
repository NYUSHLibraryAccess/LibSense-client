import * as React from 'react';

const ContentLimiter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="max-w-xl md:ml-2 xl:ml-4">{children}</div>;
};

export { ContentLimiter };
