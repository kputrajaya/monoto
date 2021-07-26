import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import firebase from '../../components/firebase';
import { HOME_PATH, log } from '../../components/utils';

const Logout = () => {
  useEffect(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        route(HOME_PATH, true);
      })
      .catch((error) => {
        log(`Firebase sign out failed: ${error}`);
      });
  }, []);
};

export default Logout;
