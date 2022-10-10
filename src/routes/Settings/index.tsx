import React, { Suspense, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

import { StyledCard } from '@/components/StyledCard';
import { useAppSelector } from '@/store';

const Settings: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const items = useMemo<{ key: string; label: string; path: string; disabled?: boolean }[]>(
    () => [
      {
        key: 'users',
        label: 'Users',
        disabled: role !== 'System Admin',
        path: '/settings/users',
      },
      {
        key: 'vendors',
        label: 'Vendors',
        path: '/settings/vendors',
      },
      {
        key: 'cdlVendorDate',
        label: 'CDL Vendor Date',
        path: '/settings/cdlVendorDate',
      },
      {
        key: 'sensitiveData',
        label: 'Sensitive Data',
        path: '/settings/sensitiveData',
      },
      {
        key: 'about',
        label: 'About',
        path: '/settings/about',
      },
    ],
    [role]
  );
  const selectedKey = useMemo(() => items.find(({ path }) => path === location.pathname)?.key || '', [items, location]);

  return (
    <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
      <div className="my-8 text-xl font-bold select-none">Settings</div>
      <div className="grid gap-6 grid-cols-1">
        <StyledCard bodyStyle={{ padding: '0 8px' }}>
          <Menu
            mode="horizontal"
            items={items.filter(({ disabled }) => !disabled).map(({ key, label }) => ({ key, label }))}
            selectedKeys={[selectedKey]}
            onClick={({ key }) => {
              const matchedItem = items.find((item) => item.key === key);
              if (matchedItem) {
                navigate(matchedItem.path);
              }
            }}
          />
        </StyledCard>
        <StyledCard>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </StyledCard>
      </div>
    </div>
  );
};

export { Settings };
