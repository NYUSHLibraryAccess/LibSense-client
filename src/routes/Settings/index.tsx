import * as React from 'react';
import { Suspense, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

import { StyledCard } from '@/components/StyledCard';
import { useAppSelector } from '@/store';
import { SystemUser } from '@/types/SystemUser';

const items: { key: string; label: string; path: string; allowedRoles: SystemUser['role'][] }[] = [
  {
    key: 'users',
    label: 'Users',
    path: '/settings/users',
    allowedRoles: ['System Admin'],
  },
  {
    key: 'vendors',
    label: 'Vendors',
    path: '/settings/vendors',
    allowedRoles: ['System Admin'],
  },
  {
    key: 'cdlVendorDate',
    label: 'CDL Vendor Date',
    path: '/settings/cdlVendorDate',
    allowedRoles: ['System Admin'],
  },
  {
    key: 'sensitiveData',
    label: 'Sensitive Data',
    path: '/settings/sensitiveData',
    allowedRoles: ['System Admin'],
  },
  {
    key: 'about',
    label: 'About',
    path: '/settings/about',
    allowedRoles: ['System Admin', 'User'],
  },
];

const Settings: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = useMemo(() => items.find(({ path }) => path === location.pathname)?.key || '', [items, location]);

  return (
    <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
      <div className="my-8 text-xl font-bold select-none">Settings</div>
      <div className="grid gap-6 grid-cols-1">
        <StyledCard bodyStyle={{ padding: '0 8px' }}>
          <Menu
            mode="horizontal"
            items={items
              .filter(({ allowedRoles }) => allowedRoles.includes(role))
              .map(({ key, label }) => ({
                key,
                label,
              }))}
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
