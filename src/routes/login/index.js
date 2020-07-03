import { h } from 'preact';
import { Helmet } from 'react-helmet';

import firebase from '../../components/firebase';
import Svg from '../../components/svgr/icon8-google';
import style from './style';

const Login = () => {
  const actionSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div class={style.login}>
      <Helmet titleTemplate={null}>
        <title>Welcome to Monoto</title>
        <meta name="description" content="Monoto is a note taking app with text editor feel. It's cloud-based, lightweight, mobile-friendly, and organizable." />
      </Helmet>

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
