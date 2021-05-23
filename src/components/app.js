import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Router } from 'preact-router';
import { Helmet } from 'react-helmet';

import Layout from './layout';
import { UserContext, TreeContext } from './context';
import firebase from './firebase';
import {
  EDIT_PATH,
  HOME_PATH,
  LOGOUT_PATH,
  SHORTCUTS_PATH,
  VIEW_PATH,
} from './utils';
import Svg from './svgr/svg-loaders-puff';
import Edit from '../routes/edit';
import View from '../routes/view';
import Home from '../routes/home';
import Login from '../routes/login';
import Logout from '../routes/logout';
import NotFound from '../routes/not-found';
import Shortcuts from '../routes/shortcuts';

const App = () => {
  const [user, setUser] = useState();
  const [tree, setTree] = useState();

  useEffect(() => {
    firebase.auth().getRedirectResult().then((result) => {
      setUser(result.user);
    });
    firebase.auth().onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return null;
    const unsubscribe = firebase.firestore().collection('tree').where('userId', '==', user.uid).onSnapshot((qs) => {
      setTree(qs.docs);
    });
    return unsubscribe;
  }, [user]);

  const renderApp = () => {
    switch (user) {
      case undefined:
        return <div id="loading"><Svg /></div>;
      case null:
        return (
          <Router>
            <Login path={HOME_PATH} />
            <View path={`${VIEW_PATH}:id`} />
            <NotFound default />
          </Router>
        );
      default:
        return (
          <Router>
            <View path={`${VIEW_PATH}:id`} />
            <UserContext.Provider value={user} default>
              <TreeContext.Provider value={tree}>
                <Layout>
                  <Router>
                    <Home path={HOME_PATH} />
                    <Edit path={`${EDIT_PATH}:id`} />
                    <Shortcuts path={SHORTCUTS_PATH} />
                    <Logout path={LOGOUT_PATH} />
                    <NotFound default />
                  </Router>
                </Layout>
              </TreeContext.Provider>
            </UserContext.Provider>
          </Router>
        )
    }
  };

  return (
    <div id="app">
      <Helmet defaultTitle="Monoto" titleTemplate="%s - Monoto" />
      {renderApp()}
    </div>
  );
};

export default App;
