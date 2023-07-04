import * as React from 'react';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faArrowRightFromBracket,
  faCloudArrowUp,
  faDatabase,
  faFileExport,
  faGear,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, Transition } from '@headlessui/react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import { Loading } from '@/routes/Loading';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateTitle } from '@/slices/metaTag';
import { useLogoutMutation } from '@/services/auth';
import { getClassName } from '@/utils/getClassName';
import { useRequireAuthStatus } from '@/hooks/useRequireAuthStatus';
import { SystemUser } from '@/types/SystemUser';
import avatar from '@/assets/avatar.png';
import LogoSvg from '@/assets/logo.svg';

type MenuItemProps = {
  icon: JSX.Element;
  title: string;
  path: string;
  pattern: RegExp;
  allowedRoles: SystemUser['role'][];
};

const items: MenuItemProps[] = [
  {
    icon: <FontAwesomeIcon icon={faHouse} />,
    title: 'Dashboard',
    path: '/',
    pattern: /^\/$/,
    allowedRoles: ['System Admin', 'User'],
  },
  {
    icon: <FontAwesomeIcon icon={faDatabase} />,
    title: 'Manage Orders',
    path: '/manageOrders',
    pattern: /^\/manageOrders/,
    allowedRoles: ['System Admin', 'User'],
  },
  {
    icon: <FontAwesomeIcon icon={faCloudArrowUp} />,
    title: 'Upload Data',
    path: '/uploadData',
    pattern: /^\/uploadData/,
    allowedRoles: ['System Admin'],
  },
  {
    icon: <FontAwesomeIcon icon={faFileExport} />,
    title: 'Export Report',
    path: '/exportReport',
    pattern: /^\/exportReport/,
    allowedRoles: ['System Admin', 'User'],
  },
  {
    icon: <FontAwesomeIcon icon={faGear} />,
    title: 'Settings',
    path: '/settings/about',
    pattern: /^\/settings/,
    allowedRoles: ['System Admin', 'User'],
  },
];

const NavMenuContext = React.createContext<{
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}>(null);

const LogoItem: React.FC = () => {
  const { collapsed } = useContext(NavMenuContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={getClassName(
        'my-6 cursor-pointer overflow-hidden flex items-center transition-all',
        collapsed ? 'w-12 mx-2' : 'w-44 mx-8'
      )}
      onClick={() => {
        if (!location.pathname.match(items[0].pattern)) {
          navigate(items[0].path);
        }
      }}
    >
      <LogoSvg
        className={getClassName(
          'w-12 h-12 mr-4 fill-violet-400 flex-none transition-transform',
          collapsed && 'scale-75'
        )}
      />
      <span
        className={getClassName(
          'text-3xl text-gray-200 font-display flex-none transition-opacity',
          collapsed && 'opacity-0'
        )}
      >
        {__NAME__}
      </span>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, path, pattern }) => {
  const { collapsed } = useContext(NavMenuContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Tooltip title={collapsed && title} placement="right">
      <div
        className={getClassName(
          'my-2 py-2 overflow-hidden cursor-pointer flex items-center gap-3 transition-all',
          collapsed ? 'mx-3 px-2 rounded-full' : 'px-7',
          location.pathname.match(pattern)
            ? 'text-white bg-violet-500'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        )}
        onClick={() => {
          if (!location.pathname.match(pattern)) {
            navigate(path);
          }
        }}
      >
        {React.cloneElement(icon, {
          className: getClassName('flex-none w-6 h-6 transition-transform', !collapsed && 'scale-75'),
        })}
        <span className={getClassName('flex-none text-sm transition-opacity', collapsed && 'opacity-0')}>{title}</span>
      </div>
    </Tooltip>
  );
};

const UserProfileItem: React.FC = () => {
  const { collapsed } = useContext(NavMenuContext);
  const { username } = useAppSelector((state) => state.auth);
  const [logout, { isSuccess }] = useLogoutMutation();
  const { refetchAuthStatus } = useRequireAuthStatus();

  useEffect(() => {
    if (isSuccess) {
      refetchAuthStatus();
    }
  }, [isSuccess]);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Tooltip title={collapsed && username} placement="right">
            <Disclosure.Button
              as="div"
              className={getClassName(
                'my-2 py-2 cursor-pointer overflow-hidden flex items-center gap-2 transition-all text-gray-200 hover:text-white hover:bg-gray-700',
                collapsed ? 'mx-2 px-2 rounded-full' : 'px-6'
              )}
            >
              <img
                src={avatar}
                alt="User avatar"
                className={getClassName(
                  'w-8 h-8 rounded-full bg-gray-600 ring-2 ring-gray-200 ring-offset-2 ring-offset-gray-600 overflow-hidden flex-none transition-transform',
                  !collapsed && 'scale-75'
                )}
              />
              <span className={getClassName('flex-none text-sm transition-opacity', collapsed && 'opacity-0')}>
                {username}
              </span>
              <div className={getClassName('flex-1 text-right transition-opacity', collapsed && 'opacity-0')}>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={getClassName('w-4.5 h-4.5 transition-transform duration-300', open && '-rotate-180')}
                />
              </div>
            </Disclosure.Button>
          </Tooltip>

          <Transition
            show={open}
            enter="transition-all ease-out"
            enterFrom="scale-y-0 opacity-0"
            enterTo="scale-y-100 opacity-100"
            leave="transition-all ease-out"
            leaveFrom="scale-y-100 opacity-100"
            leaveTo="scale-y-0 opacity-0"
          >
            <Disclosure.Panel as="div" className="my-2 py-2 bg-gray-900">
              <Tooltip title={collapsed && 'Logout'} placement="right">
                <div
                  className={getClassName(
                    'py-2 overflow-hidden cursor-pointer flex items-center gap-3 transition-all text-gray-400 hover:text-gray-200 hover:bg-gray-700',
                    collapsed ? 'mx-3 px-2 rounded-full' : 'px-7'
                  )}
                  onClick={() => logout()}
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className={getClassName('flex-none w-6 h-6 transition-transform', !collapsed && 'scale-75')}
                  />
                  <span className={getClassName('flex-none text-sm transition-opacity', collapsed && 'opacity-0')}>
                    Logout
                  </span>
                </div>
              </Tooltip>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

const ExpandCollapseItem: React.FC = () => {
  const { collapsed, setCollapsed } = useContext(NavMenuContext);

  return (
    <div
      className={getClassName(
        'my-2 h-12 relative cursor-pointer flex justify-center items-center transition-all text-gray-400 hover:text-gray-200 hover:bg-gray-700',
        collapsed ? 'mx-2 rounded-full' : ''
      )}
      onClick={() => setCollapsed((prevState) => !prevState)}
    >
      <FontAwesomeIcon
        icon={faAngleLeft}
        className={getClassName('w-4 h-4 absolute transition-opacity duration-300', collapsed && 'opacity-0')}
      />
      <FontAwesomeIcon
        icon={faAngleRight}
        className={getClassName('w-4 h-4 absolute transition-opacity duration-300', !collapsed && 'opacity-0')}
      />
    </div>
  );
};

const NavMenu: React.FC = () => {
  const { isFetchingAuthStatus } = useRequireAuthStatus(true);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);
  console.log('NavMenu re-rendered', isFetchingAuthStatus);

  const [collapsed, setCollapsed] = useState(true);
  const contextValue = useMemo(
    () => ({
      collapsed,
      setCollapsed,
    }),
    [collapsed]
  );

  useEffect(() => {
    const item = items.find(({ pattern }) => location.pathname.match(pattern));
    if (item) {
      dispatch(updateTitle(`${item.title} | ${__NAME__}`));
    }
  }, [location]);

  return isFetchingAuthStatus ? (
    <Loading />
  ) : (
    <div className="h-screen flex">
      <NavMenuContext.Provider value={contextValue}>
        <div className="flex-none">
          <div
            className={getClassName(
              'h-screen bg-gray-800 shadow-md select-none flex flex-col transition-all duration-300',
              collapsed ? 'w-16' : 'w-60'
            )}
          >
            <div className="flex-none">
              <LogoItem />
            </div>
            <Scrollbars
              className="flex-1"
              autoHide
              renderThumbVertical={({ props, style }) => (
                <div
                  {...props}
                  style={{ ...style, backgroundColor: '#ffffff', opacity: 0.5, width: 4, borderRadius: 2 }}
                />
              )}
            >
              {items
                .filter(({ allowedRoles }) => allowedRoles.includes(role))
                .map((item, index) => (
                  <MenuItem key={index} {...item} />
                ))}
            </Scrollbars>
            <div className="flex-none">
              <UserProfileItem />
            </div>
            <div className="flex-none">
              <ExpandCollapseItem />
            </div>
          </div>
        </div>
      </NavMenuContext.Provider>

      <Scrollbars className="flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Scrollbars>
    </div>
  );
};

export { NavMenu };
