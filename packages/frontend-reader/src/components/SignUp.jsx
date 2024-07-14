import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './SignUp.css'

function SignUpForm() {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    })
    const [passwordsMatch, setPasswordsMatch] = useState(false)
    const [passwordConfExists, setPasswordConfExists] = useState(false)
    const [validationMsg, setValidationMsg] = useState('')

    function updateUserInfo(e) {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    function checkPasswordConf(e) {
            const passwordConfField = e.target
            if (passwordConfField.name !== 'passwordConf') return

            if (passwordConfField.value.length === 0) {
                setPasswordConfExists(false)
            }
            else {
                setPasswordConfExists(true)
            }
    
            if (userInfo.password !== passwordConfField.value) {
                setPasswordsMatch(false)
            } 
            else {
                setPasswordsMatch(true)
            }
    }


    console.log(`${passwordsMatch}, ${passwordConfExists}`)
    return (
        <>
            <a href="/">home</a>
            <div id='signup'>
                <form>
                    <p>sign-up for an account</p>
                    <span>
                        <input
                            text={userInfo.firstName}
                            name='firstName'
                            placeholder='first name'
                            onChange={updateUserInfo}
                        />
                        <input
                            text={userInfo.lastName}
                            name='lastName'
                            placeholder='last name'
                            onChange={updateUserInfo}
                        />
                    </span>
                    <input
                        text={userInfo.username}
                        name='username'
                        placeholder='username'
                        onChange={updateUserInfo}
                    />
                    <input
                        text={userInfo.password}
                        name='password'
                        placeholder='password'
                        onChange={updateUserInfo}
                    />
                    <input
                        name='passwordConf'
                        placeholder='re-enter password'
                        onBlur={checkPasswordConf}
                    />
                    {passwordConfExists && !passwordsMatch && 
                    <p id='pwValidator'>passwords dont match</p>}
                    <button>sign-up</button>
                </form>
            </div>
        </>
    )
}

export default SignUpForm