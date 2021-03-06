import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, useDispatch } from 'react-redux';
import { HashRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import { HeaderBar } from '@/components/HeaderBar';
import { NavigationMenu } from '@/components/NavigationMenu';
import { Login } from '@/components/Login';
import { Home } from '@/components/Home';
import { OrderTable } from '@/components/OrderTable';
import { FileUploader } from '@/components/FileUploader';
import { ExportToEmail } from '@/components/ExportToEmail';
import { UserManagement } from '@/components/UserManagement';
import { PageNotFound } from '@/components/PageNotFound';
import { IAppDispatch, store } from '@/utils/store';
import { setRole, setUsername } from '@/slices/auth';
import { whoAmI } from '@/api/whoAmI';
import style from './app.module.less';
import Favicon from '@/images/books.png';

const App: React.FC = () => {
  const dispatch = useDispatch<IAppDispatch>();

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    whoAmI()
      .then(({ data }) => {
        if (data !== undefined) {
          dispatch(setUsername(data.username));
          dispatch(setRole(data.role));
          if (location.pathname === '/Login') {
            history.push('/');
          }
        }
      })
      .catch(() => {
        // TODO: implement it with axios interceptors
        if (location.pathname !== '/Login') {
          history.push('/Login');
        }
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>LibSense</title>
        <link rel="icon" href={Favicon} />
      </Helmet>
      <Layout>
        <Layout.Header className={style.pageHeader}>
          <HeaderBar />
        </Layout.Header>
        <Layout className={style.pageBody}>
          <Switch>
            <Route path="/Login" />
            <Route>
              <Layout.Sider width={240} className={style.menu}>
                <NavigationMenu />
              </Layout.Sider>
            </Route>
          </Switch>
          <Layout.Content>
            <div className={style.content}>
              <Switch>
                <Route path="/Login" component={Login} />
                <Route path="/" exact component={Home} />
                <Route path="/Orders" component={OrderTable} />
                <Route path="/Settings/Upload" component={FileUploader} />
                <Route path="/Settings/Export" component={ExportToEmail} />
                <Route path="/Settings/UserManagement" component={UserManagement} />
                <Route component={PageNotFound} />
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
if (module.hot) module.hot.accept();
/* debug:end */
