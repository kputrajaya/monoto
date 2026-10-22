import { useEffect } from 'react';
import firebase from '../../components/firebase';
import { HOME_PATH, log, route } from '../../components/utils';

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
