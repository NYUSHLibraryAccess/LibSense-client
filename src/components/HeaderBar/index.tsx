import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { setDisplayUsername } from '@/slices/auth';
import { IRootState, IAppDispatch } from '@/utils/store';
import style from './style.module.less';
import Logo from '@/images/books.png';
import User from '@/images/user.png';

const HeaderBar: React.FC = () => {
  const username = useSelector<IRootState>(({ auth }) => auth.displayUsername);
  const dispatch = useDispatch<IAppDispatch>();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setDisplayUsername('Test User'));
    }, 1000);
  });

  return (
    <>
      <div className={style.logo}>
        <img src={Logo} alt="" draggable={false} className={style.image} />
        LibSense
      </div>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              Log Out
            </Menu.Item>
          </Menu>
        }
        overlayClassName={style.userOverlay}
      >
        <a className={style.user}>
          <Avatar src={<img src={User} alt="" draggable={false} />} className={style.avatar} />
          {username}
        </a>
      </Dropdown>
    </>
  );
};

export { HeaderBar };
