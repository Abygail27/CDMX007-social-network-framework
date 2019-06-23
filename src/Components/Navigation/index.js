import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../Constants/routes';
import './navigation.css'
// import * as ROLES from '../../Constants/roles';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <nav> 
    <div className="nav-wrapper">
      
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to={ROUTES.HOME}>Home</Link></li>
        <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
        <li className = "sign-out-li">
      <SignOutButton />
    </li>
      </ul>
    </div>
  </nav>
  
);

const NavigationNonAuth = () => (
  // <ul>
  //   <li>
  //     <Link to={ROUTES.LANDING}>Landing</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  //   </li>
  // </ul>
  <h3 className="center-align color-nav">Link Up!</h3>
  
);

export default Navigation;