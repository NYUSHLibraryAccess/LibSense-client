import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { lazily } from 'react-lazily';

import { MetaTag } from '@/components/MetaTag';
import { Loading } from '@/routes/Loading';
import { useAppSelector } from '@/store';

const { Login } = lazily(() => import('./Login'));
const { NavMenu } = lazily(() => import('./NavMenu'));
const { Dashboard } = lazily(() => import('./Dashboard'));
const { OrderTable } = lazily(() => import('./OrderTable'));
const { OrderEditor } = lazily(() => import('./OrderEditor'));
const { UploadData } = lazily(() => import('./UploadData'));
const { ExportReport } = lazily(() => import('./ExportReport'));
const { Settings } = lazily(() => import('./Settings'));
const { Users } = lazily(() => import('./Settings/Users'));
const { Vendors } = lazily(() => import('./Settings/Vendors'));
const { CdlVendorDate } = lazily(() => import('./Settings/CdlVendorDate'));
const { SensitiveData } = lazily(() => import('./Settings/SensitiveData'));
const { About } = lazily(() => import('./Settings/About'));
const { NotFound } = lazily(() => import('./NotFound'));

const AppRoutes: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  return (
    <>
      <MetaTag />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<NavMenu />}>
            <Route index element={<Dashboard />} />
            <Route path="manageOrders" element={<OrderTable />}>
              <Route index element={<OrderEditor />} />
            </Route>
            {role === 'System Admin' && <Route path="uploadData" element={<UploadData />} />}
            <Route path="exportReport" element={<ExportReport />} />
            <Route path="settings" element={<Settings />}>
              <Route path="users" element={<Users />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="cdlVendorDate" element={<CdlVendorDate />} />
              <Route path="sensitiveData" element={<SensitiveData />} />
              <Route path="about" element={<About />} />
            </Route>
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export { AppRoutes };
