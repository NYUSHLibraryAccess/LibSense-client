import * as React from 'react';
import { message } from 'antd';
import { useClipboard } from 'use-clipboard-copy';

import { getClassName } from '@/utils/getClassName';

const CopyAction: React.FC<React.PropsWithChildren<{ contentToCopy: string }>> = ({ children, contentToCopy }) => {
  const { target, copy } = useClipboard({
    onSuccess: () => message.success('Copied to clipboard.'),
    onError: () => message.error('Failed to copy to clipboard.'),
  });

  return (
    <>
      <input ref={target} value={contentToCopy ?? ''} readOnly className="hidden" />
      <span
        className={getClassName(
          'mx-1 whitespace-nowrap select-none',
          contentToCopy
            ? 'cursor-pointer text-violet-600 transition-colors hover:text-violet-900'
            : 'cursor-not-allowed text-gray-400'
        )}
        onClick={() => {
          contentToCopy && copy();
        }}
      >
        {children}
      </span>
    </>
  );
};

export { CopyAction };
