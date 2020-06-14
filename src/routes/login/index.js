import { h } from 'preact';
import { Helmet } from 'react-helmet';

import firebase from '../../components/firebase';
import style from './style';

const Login = () => {
  const actionSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div class={style.login}>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <h2>Login</h2>
      <p>This is the Login component.</p>
      <button onClick={actionSignIn}>Sign in</button>
    </div>
  );
};

export default Login;
