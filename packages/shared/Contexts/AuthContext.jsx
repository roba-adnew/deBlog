import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRefreshToken } from '../utils/authApi'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const navigate = useNavigate();

    function updateLogin(userData, accessToken) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', JSON.stringify(accessToken))
    }

    async function updateLogout() {
        const user = JSON.parse(localStorage.getItem('user'))
        try {
            console.log('starting logout process')
            const result = await deleteRefreshToken(user._id)
            console.log('logout result:', result)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            navigate('/')
        } 
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const contextData = { updateLogin, updateLogout, user }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() { return useContext(AuthContext) }

export { AuthProvider, useAuth }