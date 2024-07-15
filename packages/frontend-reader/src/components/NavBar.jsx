import React from 'react'
import '../Styles/NavBar.css'

function NavBar({ link1, link2 }) {
    function Link({link}) {
        switch(link) {
            case 'home': return <a id='homeLink' href="/">home</a>;
            case 'login': return <a id='loginLink' href="/login">login</a>
            case 'signup': return <a id='signupLink' href="/sign-up">signup</a>
        }
    }


    return (
        <div id='navbar'>
            <Link link={link1} />
            <Link link={link2} />
        </div>
    )
}

export default NavBar;
