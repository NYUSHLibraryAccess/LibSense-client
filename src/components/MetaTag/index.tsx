import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useAppSelector } from '@/store';
import logo from '@/assets/logo.png';

const MetaTag: React.FC = () => {
  const { title } = useAppSelector((state) => state.metaTag);

  return (
    <Helmet>
      <title>{title || __NAME__}</title>
      <link rel="icon" type="image/x-icon" href={logo} />
    </Helmet>
  );
};

export { MetaTag };
