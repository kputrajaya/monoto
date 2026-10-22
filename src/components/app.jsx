import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Layout from './layout';
import { UserContext, TreeContext } from './context';
import firebase from './firebase';
import { EDIT_PATH, HOME_PATH, log, LOGOUT_PATH, SHORTCUTS_PATH, VIEW_PATH } from './utils';
import Svg from './svgr/svg-loaders-puff';
import Edit from '../routes/edit';
import View from '../routes/view';
import Home from '../routes/home';
import Login from '../routes/login';
import Logout from '../routes/logout';
import NotFound from '../routes/not-found';
import Shortcuts from '../routes/shortcuts';

const AuthenticatedRoute = ({ user, tree, children }) => (
  <UserContext.Provider value={user}>
    <TreeContext.Provider value={tree}>
      <Layout>{children}</Layout>
    </TreeContext.Provider>
  </UserContext.Provider>
);

const App = () => {
  const [user, setUser] = useState();
  const [tree, setTree] = useState();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (newUser) => setUser(newUser),
      (error) => log('Firebase auth state failed', error)
    );

    firebase.auth().getRedirectResult().catch((error) => {
      log('Firebase redirect sign-in failed', error);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    // For unsubscribing
    return firebase
      .firestore()
      .collection('tree')
      .where('userId', '==', user.uid)
      .onSnapshot(
        (qs) => setTree(qs.docs),
        (error) => log('Firestore tree subscription failed', error)
      );
  }, [user]);

  const renderApp = () => {
    switch (user) {
      case undefined:
        return (
          <div id="loading">
            <Svg />
          </div>
        );
      case null:
        return (
          <Routes>
            <Route path={HOME_PATH} element={<Login />} />
            <Route path={`${VIEW_PATH}:id`} element={<View />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        );
      default:
        return (
          <Routes>
            <Route path={`${VIEW_PATH}:id`} element={<View />} />
            <Route path={HOME_PATH} element={<AuthenticatedRoute user={user} tree={tree}><Home /></AuthenticatedRoute>} />
            <Route path={`${EDIT_PATH}:id`} element={<AuthenticatedRoute user={user} tree={tree}><Edit /></AuthenticatedRoute>} />
            <Route path={SHORTCUTS_PATH} element={<AuthenticatedRoute user={user} tree={tree}><Shortcuts /></AuthenticatedRoute>} />
            <Route path={LOGOUT_PATH} element={<AuthenticatedRoute user={user} tree={tree}><Logout /></AuthenticatedRoute>} />
            <Route path="*" element={<AuthenticatedRoute user={user} tree={tree}><NotFound /></AuthenticatedRoute>} />
          </Routes>
        );
    }
  };

  return (
    <div id="app">
      <Helmet defaultTitle="Monoto" titleTemplate="%s - Monoto" />
      <BrowserRouter>{renderApp()}</BrowserRouter>
    </div>
  );
};

export default App;
