import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { SignUpLink } from '../SignUp'
import { withFirebase } from '../Firebase'
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUTES from '../../Constants/routes'
//import LOGO from '../SignIn/Logo'
import './signIn.css'

const SignInPage = () => (
  <div className='row'>

<div className="split left">
  <div className="centered">
    <h1>meet, form business, recognize and create.</h1>
  </div>
</div>

<div className="split right">
  <div className="centered">
  <div className= "split-right">
 
   
  <h3 className='center' id = "title-landing">Link up!</h3>

  <div className = "logIn-form">

   
   <SignInForm />
   <SignInGoogle />
   
   <SignInFacebook />  
   <div id = "divider"></div>
   <PasswordForgetLink />
   <SignUpLink /></div>
  </div>
   
  </div>
</div>

  




</div>


)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { email, password } = this.state
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)

      .then(() => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      .catch(error => {
        this.setState({ error })
      })
    event.preventDefault()
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

render() {
const { email, password, error } = this.state
const isInvalid = password === '' || email === ''
return (
<form onSubmit={this.onSubmit}>
<input id="email-input"
name="email"
value={email}
onChange={this.onChange}
type="text"
placeholder="Email Address"
/>
<input id = "password-input"
name="password"
value={password}
onChange={this.onChange}
type="password"
placeholder="Password"
/>
<button disabled={isInvalid} type="submit" id = 'login-form-btn' className="btn-small col l12" >
Sign In
</button>
        {error && <p>{error.message}</p>}
      </form>
    )

  }
}


class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" id="google-signIn" className="btn-small col l12">Google</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" id="facebook-signIn" className="btn-small col l12">facebook</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase)
export default SignInPage;

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);


export { SignInForm, SignInGoogle, SignInFacebook } 