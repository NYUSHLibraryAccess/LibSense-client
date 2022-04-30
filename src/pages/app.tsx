import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { HeaderBar } from '@/components/HeaderBar';
import { NavigationMenu } from '@/components/NavigationMenu';
import { OrderTable } from '@/components/OrderTable';
import { OrderModal } from '@/components/OrderModal';
import { FileUploader } from '@/components/FileUploader';
import { PageNotFound } from '@/components/PageNotFound';
import { store } from '@/utils/store';
import style from './app.module.less';
import Favicon from '@/images/books.png';

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <link rel="icon" href={Favicon} />
      </Helmet>
      <Layout>
        <Layout.Header className={style.pageHeader}>
          <HeaderBar />
        </Layout.Header>
        <Layout className={style.pageBody}>
          <Layout.Sider width={240} className={style.menu}>
            <NavigationMenu />
          </Layout.Sider>
          <Layout.Content>
            <div className={style.content}>
              <Switch>
                <Route path="/Orders">
                  <Route path="/Orders" component={OrderTable} />
                  <Route path="/Orders/Detail/:orderId" component={OrderModal} />
                </Route>
                <Route path="/Upload" component={FileUploader} />
                <Route path="*" component={PageNotFound} />
              </Switch>
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

/* debug:start */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (module.hot) module.hot.accept();
/* debug:end */
