import React from 'react'
import {assets} from '../assets/assets'

const Login = () => {

    const [state, setState] = useState('Admin')
    return (
        <form className='min-h-[80vh] flex'>
            <div>
                <p> <span>{state}</span>Login</p>
                <div>
                    <p>Email</p>
                    <input type="email" required />
                </div>
                <div>
                    <p>Password</p>
                    <input type="password"/>
                </div>
                <button>Login</button>
            </div>
        </form>
    )
}

export default Login
