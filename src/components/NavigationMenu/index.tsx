import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { BookOutlined, CloudUploadOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
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
  { key: 'uploadData', path: '/Upload' },
  { key: 'settings', path: '/Settings' },
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
      defaultOpenKeys={['orders']}
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
        <Menu.Item key="allOrders">All Orders</Menu.Item>
        <Menu.Item key="rushOrders">Rush Orders</Menu.Item>
        <Menu.Item key="cdlOrders">CDL Orders</Menu.Item>
        <Menu.Item key="nyOrders">NY Orders</Menu.Item>
        <Menu.Item key="localOrders">Local Orders</Menu.Item>
        <Menu.Item key="dvdOrders">DVD Orders</Menu.Item>
        <Menu.Item key="courseReserveOrders">Course Reserve Orders</Menu.Item>
        <Menu.Item key="illOrders">ILL Orders</Menu.Item>
        <Menu.Item key="nonRushOrders">Non-Rush Orders</Menu.Item>
        <Menu.Item key="sensitiveTitles">Sensitive Titles</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="uploadData" icon={<CloudUploadOutlined />}>
        Upload Data
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
    </Menu>
  );
};

export { NavigationMenu };
