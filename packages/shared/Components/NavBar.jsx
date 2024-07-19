import React from 'react'
import { useAuth } from '../Contexts/AuthContext'
import { useLocation, Link } from 'react-router-dom'
import '../Styles/NavBar.css'

function NavBar() {
    const { updateLogout } = useAuth();
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem('user'))
    const loggedIn = !!user;

    if (loggedIn) {return <Link to="/" onClick={updateLogout}>logout</Link>}

    switch (location.pathname) {
        case '/':
            return (
                <div id='navbar'>
                    <Link to="/sign-up">signup</Link>
                    <Link to="/login">login</Link>
                </div>
            )
        case '/login':
            return (
                <div id='navbar'>
                    <Link to="/">home</Link>
                    <Link to="/sign-up">signup</Link>
                </div>
            )
        case '/sign-up':
            return (
                <div id='navbar'>
                    <Link to="/">home</Link>
                    <Link to="/login">login</Link>
                </div>
            )  
    }
}

export default NavBar;
