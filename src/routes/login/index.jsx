
import firebase from '../../components/firebase';
import Svg from '../../components/svgr/icon8-google';
import style from './style.module.scss';

const Login = () => {
  const actionSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  return (
    <div className={style.login}>
      <h1 className={style.title}>Monoto</h1>
      <h2 className={style.subtitle}>Monospace note and writing app</h2>
      <ul className={style.features}>
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
      <button className={style.button} onClick={actionSignIn}>
        <Svg className={style.buttonIcon} />
        Login with Google
      </button>
    </div>
  );
};

export default Login;
