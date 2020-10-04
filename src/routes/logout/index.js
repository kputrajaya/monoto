import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import firebase from '../../components/firebase';
import { HOME_PATH, userAlert } from '../../components/utils';

const Logout = () => {
  useEffect(() => {
    firebase.auth().signOut().then(() => {
      route(HOME_PATH, true);
    }).catch((error) => {
      userAlert(`Error: ${error}`);
    });
  }, []);
};

export default Logout;
