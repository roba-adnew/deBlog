import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const navigate = useNavigate();
    function updateLogin(userData, accessToken) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', JSON.stringify(accessToken))
    }

    function updateLogout() {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/')
    }

    const contextData = { updateLogin, updateLogout }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() { return useContext(AuthContext) }

export { AuthProvider, useAuth }