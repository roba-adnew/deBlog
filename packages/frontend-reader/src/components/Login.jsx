import React, { useState, useRef } from 'react'
import { login as apiLogin } from '../utils/authApi'
import { useAuth } from '../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import '../Styles/Login.css'

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })
    const [loggingIn, setLoggingIn] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const { updateLogin } = useAuth();

    function updateUserLogin(e) {
        e.preventDefault();
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
    async function handleLogin(e) {
        e.preventDefault();
        try {
            setLoggingIn(true)
            console.log('logging in')
            const response = await apiLogin(credentials)
            if (response.ok) console.log('logged in')
            console.log('response', response)
            updateLogin(response.user, response.accessToken)
            navigate('/')

        } catch (err) {
            setError(err)
            console.error(err)
        } finally {
            setLoggingIn(false)
        }
    }

    console.log('Render state:', { credentials, error, loggingIn });
    return (
        <>
            <div id='login'>
                <form onSubmit={handleLogin} method='POST'>
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