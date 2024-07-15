import React, { useState, useRef } from 'react'
import { login as apiLogin } from '../utils/authApi'
import NavBar from './NavBar'
import '../Styles/Login.css'

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })
    const [loggingIn, setLoggingIn] = useState(false)
    const [error, setError] = useState(null)

    function updateUserLogin(e) {
        e.preventDefault();
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
    async function login(e) {
        e.preventDefault();
        try {
            setLoggingIn(true)
            console.log('logging in')
            const loggedIn = await apiLogin(credentials)
            if (loggedIn) {
                console.log('logged in')
            }
            else {
                console.log('failed login')
            }

        } catch (err) {
            setError(err)
            console.error(err)
        } finally {
            setLoggingIn(false)
        }
    }

    console.log('Render state:', { credentials, error });
    return (
        <>
            <NavBar link1='home' link2='signup' />
            <div id='login'>
                <form onSubmit={login} method='POST'>
                    <p>login</p>
                    <input
                        text={credentials.username}
                        name='username'
                        placeholder='username'
                        onChange={updateUserLogin}
                    />
                    <input
                        text={credentials.password}
                        type='password'
                        name='password'
                        placeholder='password'
                        onChange={updateUserLogin}
                    />
                    <button type='submit'>login</button>
                </form>
            </div>
        </>

    )
}

export default Login