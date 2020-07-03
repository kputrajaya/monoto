import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import firebase from '../../components/firebase';
import { HOME_PATH } from '../../components/utils';

const Logout = () => {
  useEffect(() => {
    firebase.auth().signOut().then(() => {
      route(HOME_PATH, true);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
};

export default Logout;
