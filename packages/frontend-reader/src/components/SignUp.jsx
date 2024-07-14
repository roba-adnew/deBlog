import React, { useState, useRef } from 'react'
import { signUp } from '../utils/authApi'
import './SignUp.css'

function CreationStatusModal({ creatingFlag, successFlag }) {
    const dialogRef = useRef(null)
    const showModal = creatingFlag || successFlag;

    return (
        <>
            <dialog ref={dialogRef}>
                {creatingFlag && 'Creating your account'}
                {successFlag && 'Account created' }
                <button>Update to redirect to login</button>
            </dialog>
            {showModal && dialogRef.current.showModal()}
        </>
    )
}

function SignUpForm() {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        author: false
    })

    const [pwdsMatch, setPwdsMatch] = useState(false)
    const [pwdConfExists, setPwdConfExists] = useState(false)
    const [creatingAccount, setCreatingAccount] = useState(false)
    const [accountCreated, setAccountCreated] = useState(false)
    const [error, setError] = useState(null)

    function updateUserInfo(e) {
        const updateValue = e.target.name === 'author' ?
            e.target.checked : e.target.value
        setUserInfo({
            ...userInfo,
            [e.target.name]: updateValue
        })
    }

    function checkPwdConf(e) {
        const pwdConfField = e.target
        if (pwdConfField.name !== 'pwdConf') return

        if (pwdConfField.value.length === 0) { setPwdConfExists(false) }
        else { setPwdConfExists(true) }

        if (userInfo.password !== pwdConfField.value) { setPwdsMatch(false) }
        else { setPwdsMatch(true) }
    }

    async function createNewAccount(e) {
        e.preventDefault();
        try {
            setCreatingAccount(true)
            console.log('Attempting account creation')
            const accountCreated = await signUp(userInfo);
            if (accountCreated) {
                console.log('Account successfully created')
                setAccountCreated(true)
            }
            else {
                console.log('Account not created')
            }
        } catch (err) {
            setError(err)
            console.error('Issue creating account:', err)
        } finally {
            setCreatingAccount(false)
        }
    }

    console.log('Render state:', { userInfo, error, pwdsMatch, pwdConfExists});

    return (
        <>
            <a href="/">home</a>
            <div id='signup'>
                <form onSubmit={createNewAccount} method='POST'>
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
                        name='pwdConf'
                        placeholder='re-enter password'
                        onBlur={checkPwdConf}
                    />
                    <div id='authorCheck'>
                        <input
                            name='author'
                            type='checkbox'
                            onChange={updateUserInfo}
                        />

                        <label htmlFor='author'>
                            {userInfo.author ?
                                'i want to write posts' :
                                'i just want to read and comment'
                            }
                        </label>
                    </div>
                    {
                        pwdConfExists && !pwdsMatch
                        && <p id='pwValidator'>passwords dont match</p>
                    }
                    <button type='submit'>sign-up</button>
                </form>
                <CreationStatusModal 
                    creatingFlag={creatingAccount}
                    successFlag={accountCreated} 
                />
            </div>
        </>
    )
}

export default SignUpForm