import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Router } from 'preact-router';
import { Helmet } from 'react-helmet';

import Layout from './layout';
import { UserContext, QueryContext } from './context';
import firebase from './firebase';
import Loading from '../routes/loading';
import Edit from '../routes/edit';
import Home from '../routes/home';
import Login from '../routes/login';
import Logout from '../routes/logout';
import NotFound from '../routes/not-found';
import Shortcuts from '../routes/shortcuts';

const App = () => {
  const [user, setUser] = useState();
  const [query, setQuery] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = firebase.firestore().collection('tree').where('userId', '==', user.uid).onSnapshot((querySnapshot) => {
      setQuery(querySnapshot);
    });
    return unsubscribe;
  }, [user]);

  const renderApp = () => {
    switch (user) {
      case undefined:
        return <Loading />;
      case null:
        return (
          <Router>
            <Login path="/" />
            <NotFound default />
          </Router>
        );
      default:
        return (
          <Layout>
            <Router>
              <Home path="/" />
              <Edit path="/e/:id" />
              <Shortcuts path="/shortcuts" />
              <Logout path="/logout" />
              <NotFound default />
            </Router>
          </Layout>
        )
    }
  };

  return (
    <div id="app">
      <Helmet defaultTitle="Monoto" titleTemplate="%s - Monoto">
        <meta name="robots" content="index, follow" />
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>

      <UserContext.Provider value={user}>
        <QueryContext.Provider value={query}>
          {renderApp()}
        </QueryContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
