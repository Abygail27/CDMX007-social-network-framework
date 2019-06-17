import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCFWlL69Xzafh2RNID3DTs2xtV8tUBIQ2Q",
  authDomain: "geekreact-4fa91.firebaseapp.com",
  databaseURL: "https://geekreact-4fa91.firebaseio.com",
  projectId: "geekreact-4fa91",
  storageBucket: "geekreact-4fa91.appspot.com",
  messagingSenderId: "1013336248010",
  appId: "1:1013336248010:web:fcb54789619d5b13"
};




class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth();

    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }


  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

    doSignInWithGoogle = () =>
     this.auth.signInWithPopup(this.googleProvider);

     doSignInWithFacebook= () =>
   this.auth.signInWithPopup(this.facebookProvider);

    doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users')
  }



export default Firebase 