import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useRequest } from '@/utils';
import { IRootState, IAppDispatch } from '@/utils/store';
import { logout } from '@/api/logout';
import { setRole, setUsername } from '@/slices/auth';
import style from './style.module.less';
import Logo from '@/images/books.png';

const HeaderBar: React.FC = () => {
  const history = useHistory();

  const username = useSelector<IRootState, string>(({ auth }) => auth.username);
  const dispatch = useDispatch<IAppDispatch>();

  return (
    <>
      <div className={style.logo}>
        <img src={Logo} alt="" draggable={false} className={style.image} />
        LibSense
      </div>
      {username !== null && (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={() => {
                  useRequest(logout()).then(() => {
                    dispatch(setUsername(null));
                    dispatch(setRole(null));
                    history.push('/Login');
                  });
                }}
              >
                Log Out
              </Menu.Item>
            </Menu>
          }
          overlayClassName={style.userOverlay}
        >
          <a className={style.user}>
            <Avatar className={style.avatar} style={{ backgroundColor: '#d08700' }}>
              {username?.slice(0, 1).toUpperCase()}
            </Avatar>
            {username}
          </a>
        </Dropdown>
      )}
    </>
  );
};

export { HeaderBar };
