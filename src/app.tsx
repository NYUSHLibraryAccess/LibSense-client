import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

import { AppRoutes } from '@/routes';
import { store } from '@/store';

import '@/app.less';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
