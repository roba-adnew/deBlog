import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    function updateLogin(userData, accessToken) {
        setUser(userData)
        setToken(accessToken)
    }

    function updateLogout() {
        setUser(null)
        setToken(null)
    }

    const contextData = { user, token, updateLogin, updateLogout }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() { return useContext(AuthContext) }

export { AuthProvider, useAuth }