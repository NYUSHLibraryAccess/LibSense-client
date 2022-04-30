import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { BookOutlined, CloudUploadOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useDidMountEffect } from '@/utils/useDidMountEffect';

type NavigationInfoItem = {
  key: string;
  path: string;
};

const navigationInfo: NavigationInfoItem[] = [
  { key: 'home', path: '/' },
  { key: 'allOrders', path: '/Orders' },
  { key: 'rushOrders', path: '/Orders/Rush' },
  { key: 'cdlOrders', path: '/Orders/Rush/CDL' },
  { key: 'nyOrders', path: '/Orders/Rush/NY' },
  { key: 'localOrders', path: '/Orders/Rush/Local' },
  { key: 'dvdOrders', path: '/Orders/Rush/DVD' },
  { key: 'courseReserveOrders', path: '/Orders/Rush/CourseReserve' },
  { key: 'illOrders', path: '/Orders/Rush/ILL' },
  { key: 'nonRushOrders', path: '/Orders/NonRush' },
  { key: 'sensitiveTitles', path: '/Orders/SensitiveTitles' },
  { key: 'uploadData', path: '/Upload' },
  { key: 'settings', path: '/Settings' },
];

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [selectedKey, setSelectedKey] = useState<string>('home');

  // Set key at component creation
  useEffect(() => {
    const item = navigationInfo.find((item) => item.path === location.pathname);
    item !== undefined && setSelectedKey(item.key);
  }, []);

  // Set path on key update
  useDidMountEffect(() => {
    const item = navigationInfo.find((item) => item.key === selectedKey);
    item !== undefined && history.push(item.path);
  }, [selectedKey]);

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={['orders']}
      selectedKeys={[selectedKey]}
      onClick={({ key }) => setSelectedKey(key)}
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
