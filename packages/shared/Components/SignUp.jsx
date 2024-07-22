import React, { useState, useEffect, useRef } from 'react'
import { signUp } from '../utils/authApi'
import NavBar from './NavBar';
import '../Styles/SignUp.css'

function CreationStatusModal({ creatingFlag, successFlag }) {
    const dialogRef = useRef(null);
    const showModal = creatingFlag || successFlag

    useEffect(() => {
        if (!dialogRef.current) {
            console.log('dialogRef currently null')
            return
        }
        if (showModal) dialogRef.current.showModal();
        if (!showModal) {
            console.log('closing')
            dialogRef.current.close();
        }
    }, [showModal])

    if (!showModal) return null

    return (
        <>
            <dialog ref={dialogRef}>
                {creatingFlag && <p>Creating your account</p>}
                {successFlag && <p>Account created</p>}
                <button id='modalButton'><a href="/login">login</a></button>
            </dialog>
        </>
    )
}

function SignUpForm({ requester }) {
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

    console.log('Render state:', { userInfo, error, pwdsMatch, pwdConfExists });

    return (
        <>
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
                    {requester === 'reader'
                        ? <div id='authorCheck'>
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
                        : userInfo.author = true}
                    {
                        pwdConfExists && !pwdsMatch
                        && <p id='pwValidator'>passwords dont match</p>
                    }
                    <button id='submit' type='submit'>sign-up</button>
                </form>
            </div>
            <CreationStatusModal
                creatingFlag={creatingAccount}
                successFlag={accountCreated}
            />
        </>
    )
}

export default SignUpForm