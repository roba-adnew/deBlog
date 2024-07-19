import React, { useState } from 'react'
import { login as apiLogin } from '../utils/authApi'
import { useAuth } from '../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../Styles/Login.css'

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        isAuthorLogin: false
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const { updateLogin } = useAuth();

    function updateUserLogin(e) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    async function handleLogin(e) {
        e.preventDefault();
        console.log('started handling')
        try {
            console.log('logging in')
            const response = await apiLogin(credentials)
            console.log('response', response)
            updateLogin(response.user, response.accessToken)
            navigate('/')
        } catch (err) {
            setError(err)
            console.error(err)
        }
    }

    console.log('Render state:', { credentials, error });
    return (
    
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
      

    )
}

export default Login