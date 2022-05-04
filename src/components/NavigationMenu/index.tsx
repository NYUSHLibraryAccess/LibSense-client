import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  BookOutlined,
  CloudUploadOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import style from './style.module.less';

const navigationInfo: { key: string; path: string }[] = [
  { key: 'home', path: '/' },
  { key: 'allOrders', path: '/Orders/All' },
  { key: 'rushOrders', path: '/Orders/Rush' },
  { key: 'cdlOrders', path: '/Orders/CDL' },
  { key: 'nyOrders', path: '/Orders/NYC' },
  { key: 'localOrders', path: '/Orders/Local' },
  { key: 'dvdOrders', path: '/Orders/DVD' },
  { key: 'courseReserveOrders', path: '/Orders/Course-Reserve' },
  { key: 'illOrders', path: '/Orders/ILL' },
  { key: 'nonRushOrders', path: '/Orders/Non-Rush' },
  { key: 'sensitiveTitles', path: '/Orders/Sensitive' },
  { key: 'settings', path: '/Settings' },
  { key: 'uploadData', path: '/Settings/Upload' },
  { key: 'exportData', path: '/Settings/Export' },
  { key: 'userManagement', path: '/Settings/UserManagement' },
];

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const [selectedKey, setSelectedKey] = useState('home');

  // Set key based on path at component creation
  useEffect(() => {
    const item = navigationInfo.find((item) => item.path === location.pathname);
    item !== undefined && setSelectedKey(item.key);
  }, []);

  return (
    <Menu
      mode="inline"
      className={style.menu}
      defaultOpenKeys={['orders', 'settings']}
      selectedKeys={[selectedKey]}
      onClick={({ key }) => {
        setSelectedKey(key);
        // Update path
        const item = navigationInfo.find((item) => item.key === key);
        item !== undefined && history.push(item.path);
      }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.SubMenu key="orders" icon={<BookOutlined />} title="Orders">
        <Menu.Item key="allOrders" icon={<BookOutlined />}>
          All Orders
        </Menu.Item>
        <Menu.Item key="rushOrders" icon={<BookOutlined />}>
          Rush Orders
        </Menu.Item>
        <Menu.Item key="cdlOrders" icon={<BookOutlined />}>
          CDL Orders
        </Menu.Item>
        <Menu.Item key="nyOrders" icon={<BookOutlined />}>
          NY Orders
        </Menu.Item>
        <Menu.Item key="localOrders" icon={<BookOutlined />}>
          Local Orders
        </Menu.Item>
        <Menu.Item key="dvdOrders" icon={<BookOutlined />}>
          DVD Orders
        </Menu.Item>
        <Menu.Item key="courseReserveOrders" icon={<BookOutlined />}>
          Course Reserve Orders
        </Menu.Item>
        <Menu.Item key="illOrders" icon={<BookOutlined />}>
          ILL Orders
        </Menu.Item>
        <Menu.Item key="nonRushOrders" icon={<BookOutlined />}>
          Non-Rush Orders
        </Menu.Item>
        <Menu.Item key="sensitiveTitles" icon={<BookOutlined />}>
          Sensitive Titles
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
        <Menu.Item key="uploadData" icon={<CloudUploadOutlined />}>
          Upload Data
        </Menu.Item>
        <Menu.Item key="exportData" icon={<ExportOutlined />}>
          Export Data
        </Menu.Item>
        <Menu.Item key="userManagement" icon={<UserOutlined />}>
          User Management
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export { NavigationMenu };
