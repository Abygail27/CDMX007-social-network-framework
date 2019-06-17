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
    this.serverValue = app.database.ServerValue;
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

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)
    // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
  this.auth.onAuthStateChanged(authUser => {
    if (authUser) {
      this.user(authUser.uid)
        .once('value')
        .then(snapshot => {
          const dbUser = snapshot.val();

          // default empty roles
          // if (!dbUser.roles) {
          //   dbUser.roles = {};
          // }

          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser,
          };

          next(authUser);
        });
    } else {
      fallback();
    }
  });
  // *** User API ***

    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users')
      // *** Message API ***

  message = uid => this.db.ref(`messages/${uid}`);

  messages = () => this.db.ref('messages');
  }



export default Firebase 