import React from 'react';
import { Card, CardProps } from 'antd';

import { getClassName } from '@/utils/getClassName';

const StyledCard: React.FC<Omit<CardProps, 'bordered'>> = ({ children, className, ...props }) => {
  return (
    <Card
      bordered={false}
      className={getClassName('shadow-lg shadow-gray-400/20 overflow-hidden', className)}
      {...props}
    >
      {children}
    </Card>
  );
};

export { StyledCard };
