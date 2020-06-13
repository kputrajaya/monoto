import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import firebase from '../../components/firebase';

const Logout = () => {
  useEffect(() => {
    firebase.auth().signOut().then(() => {
      route('/', true);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
};

export default Logout;
