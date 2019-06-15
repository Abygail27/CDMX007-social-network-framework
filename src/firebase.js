    
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBWEuHMKTKqSkSASuS_-PTTNS6X94mdTSc",
  authDomain: "geekreact-4fa91.firebaseapp.com",
  databaseURL: "https://geekreact-4fa91.firebaseio.com",
  projectId: "geekreact-4fa91",
  storageBucket: "geekreact-4fa91.appspot.com",
  messagingSenderId: "1013336248010",
  appId: "1:1013336248010:web:fcb54789619d5b13"
};

const fire = firebase.initializeApp(firebaseConfig);
export default fire;