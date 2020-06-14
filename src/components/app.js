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
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = firebase.firestore().collection('tree').where('userId', '==', user.uid).onSnapshot((querySnapshot) => {
      setQuery(querySnapshot);
    });
    return unsubscribe;
  }, [user]);

  return (
    <div id="app">
      <Helmet defaultTitle="Monoto" titleTemplate="%s - Monoto">
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <UserContext.Provider value={user}>
        <QueryContext.Provider value={query}>
          {
            user
              ? (
                <Layout>
                  <Router>
                    <Home path="/" />
                    <Edit path="/e/:id" />
                    <Logout path="/logout" />
                  </Router>
                </Layout>
              )
              : (
                <Router>
                  <Login path="/" />
                </Router>
              )
          }
        </QueryContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default App;
