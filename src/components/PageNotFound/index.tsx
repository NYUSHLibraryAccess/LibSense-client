import * as React from 'react';
import { Result } from 'antd';
import style from './style.module.less';
import Error from '@/images/404-error.png';

const PageNotFound: React.FC = () => {
  return (
    <Result
      icon={<img src={Error} draggable={false} alt="" width={128} />}
      title="Page Not Found"
      subTitle="Sorry, the page you visited does not exist."
      className={style.result}
    />
  );
};

export { PageNotFound };
