import React from 'react'
import { Link } from 'react-router-dom'
import SignOutButton from '../SignOut'
import * as ROUTES from '../../Constants/routes'
import { AuthUserContext } from '../Session'

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = () => (
  <nav>
      <ul>

      {/* <li><Link to={ROUTES.SIGN_UP}>Registrarse</Link></li>
        <li><Link to={ROUTES.SIGN_IN}>Entrar</Link></li> */}
        {/*g <li> <Link to={ROUTES.LANDING}>Foro</Link></li> */}
        <li> <Link to={ROUTES.HOME}>Home</Link></li>
        <li><Link to={ROUTES.ADMIN}>Mi Perfil</Link></li>
        <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
        <li><SignOutButton /></li>
        </ul>
  </nav>
)
const NavigationNonAuth = () => (
  <nav>
    <div >
      <ul>
        {/* <li><Link to={ROUTES.LANDING}>Landing</Link> </li> */}
        <p>GeekIt</p>
        <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>
      </ul>
    </div>
  </nav>
)
export default Navigation;