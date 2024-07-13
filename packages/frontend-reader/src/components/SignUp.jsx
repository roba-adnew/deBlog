import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './SignUp.css'

function SignUpForm() {
    const [userInfo, setUserInfo] = useState(null)

    const userTemplate = {
        firstName: 'first name',
        lastName: 'last name',
        username: 'username',
        password: 'password'
    }

    return (
        <>
            <a href="/">home</a>
            <div id='signup'>
                <form>
                    <p>sign-up for an account</p>
                    <span>
                        <input placeholder='first name'></input>
                        <input placeholder='last name'></input>
                    </span>
                    <input placeholder='username'></input>
                    <input placeholder='password'></input>
                    <input placeholder='re-enter password'></input>
                    <button>sign-up</button>
                </form>
            </div>
        </>

    )
}

export default SignUpForm