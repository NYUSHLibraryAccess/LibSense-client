import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { AppRoutes } from '@/routes';
import { store } from '@/store';

import '@/app.less';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ConfigProvider theme={{ token: { colorPrimary: '#7c3aed' } }}>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ConfigProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
