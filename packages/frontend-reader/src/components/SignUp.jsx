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

    function updateUserInfo(e) {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    console.log(userInfo)

    return (
        <>
            <a href="/">home</a>
            <div id='signup'>
                <form>
                    <p>sign-up for an account</p>
                    <span>
                        <input
                            text={userInfo.firstName}
                            placeholder='first name'
                            onChange={updateUserInfo}
                        />
                        <input
                            text={userInfo.lastName}
                            placeholder='last name'
                            onChange={updateUserInfo}
                        />
                    </span>
                    <input
                        text={userInfo.username}
                        placeholder='username'
                        onChange={updateUserInfo}
                    />
                    <input
                        text={userInfo.password}
                        placeholder='password'
                        onChange={updateUserInfo}
                    />
                    <input
                        placeholder='re-enter password'
                    />
                    <button>sign-up</button>
                </form>
            </div>
        </>

    )
}

export default SignUpForm