import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Router } from 'preact-router';
import { Helmet } from 'react-helmet';

import Layout from './layout';
import { UserContext, TreeContext } from './context';
import firebase from './firebase';
import Svg from './svgr/svg-loaders-puff';
import Edit from '../routes/edit';
import Home from '../routes/home';
import Login from '../routes/login';
import Logout from '../routes/logout';
import NotFound from '../routes/not-found';
import Shortcuts from '../routes/shortcuts';

const App = () => {
  const [user, setUser] = useState();
  const [tree, setTree] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return null;
    const unsubscribe = firebase.firestore().collection('tree').where('userId', '==', user.uid).onSnapshot((docs) => {
      setTree(docs);
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
            <Login path="/" />
            <NotFound default />
          </Router>
        );
      default:
        return (
          <UserContext.Provider value={user}>
            <TreeContext.Provider value={tree}>
              <Layout>
                <Router>
                  <Home path="/" />
                  <Edit path="/e/:id" />
                  <Shortcuts path="/shortcuts" />
                  <Logout path="/logout" />
                  <NotFound default />
                </Router>
              </Layout>
            </TreeContext.Provider>
          </UserContext.Provider>
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
