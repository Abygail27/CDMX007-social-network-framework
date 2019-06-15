import React from 'react'
import Navigation from '../Navigation';
import { withAuthorization } from '../../Components/Session'

const HomePage = () => (
<div>
<Navigation/>
<h1>Home Page</h1>
<p>The Home Page is accessible by every signed in user.</p>
</div>
)
const condition = authUser => !!authUser
export default withAuthorization(condition)(HomePage)
