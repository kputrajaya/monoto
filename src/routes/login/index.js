import { h } from 'preact';

import firebase from '../../components/firebase';
import { log } from '../../components/utils';
import Svg from '../../components/svgr/icon8-google';
import style from './style';

const Login = () => {
  const actionSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch((error) => {
      log(`Firebase sign in failed: ${error}`);
    });
  }

  return (
    <div class={style.login}>
      <h1 class={style.title}>Monoto</h1>
      <h2 class={style.subtitle}>Note taking app, text editor feel</h2>
      <ul class={style.features}>
        <li>
          <h3>Cloud-based</h3>
          Notes are synced to all devices
        </li>
        <li>
          <h3>Lightweight</h3>
          Built to achieve fast load times
        </li>
        <li>
          <h3>Mobile-friendly</h3>
          Responsive for desktops and phones
        </li>
        <li>
          <h3>Organizable</h3>
          Folders (and nested folders) supported
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
