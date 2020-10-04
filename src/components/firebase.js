import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDMLzj5TqoFIIDaFoG6Rr8aNfn-jaqiGMs',
  appId: '1:646929563973:web:7f579ed804b6a392b2be2c',
  authDomain: 'auth.monoto.app',
  databaseURL: 'https://monote-app.firebaseio.com',
  projectId: 'monote-app',
  storageBucket: 'monote-app.appspot.com',
  measurementId: 'G-X9FSVCH70W',
  messagingSenderId: '646929563973',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
