import { h } from 'preact';

import firebase from '../../components/firebase';
import Svg from '../../components/svgr/icon8-google';
import style from './style';

const Login = () => {
  const actionSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  return (
    <div class={style.login}>
      <h1 class={style.title}>Monoto</h1>
      <h2 class={style.subtitle}>Monospace note and writing app</h2>
      <ul class={style.features}>
        <li>
          <h3>Cloud Sync</h3>
          Access from anywhere
        </li>
        <li>
          <h3>Responsive</h3>
          Works across devices
        </li>
        <li>
          <h3>Shareable</h3>
          Links for your friends
        </li>
        <li>
          <h3>Lightweight</h3>
          Built to load fast
        </li>
      </ul>
      <button class={style.button} onClick={actionSignIn}>
        <Svg class={style.buttonIcon} />
        Login with Google
      </button>
    </div>
  );
};

export default Login;
