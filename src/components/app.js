import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Router } from 'preact-router';
import { Helmet } from 'react-helmet';

import Layout from './layout';
import { UserContext, QueryContext } from './context';
import firebase from './firebase';
import Edit from '../routes/edit';
import Home from '../routes/home';
import Login from '../routes/login';
import Logout from '../routes/logout';

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
        return (
          <div>Loading...</div>
        );
      case null:
        return (
          <Router>
            <Login path="/" />
          </Router>
        );
      default:
        return (
          <Layout>
            <Router>
              <Home path="/" />
              <Edit path="/e/:id" />
              <Logout path="/logout" />
            </Router>
          </Layout>
        )
    }
  };

  return (
    <div id="app">
      <Helmet defaultTitle="Monoto" titleTemplate="%s - Monoto">
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
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
