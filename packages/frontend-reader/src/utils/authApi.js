async function signUp(formData) {
    try {
        console.log('new account form data', {formData})
        const response = await fetch(
            'http://localhost:4000/api/user/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            }
        )
        return response.ok
    } catch (err) {
        throw err
    }
}

async function login(credentials) {
    try {
        console.log('logging in for', credentials)
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        })
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function deleteRefreshToken(userId) {
    const body = { userId }
    try {
        console.log('making logout post request')
        const response = await fetch('http://localhost:4000/api/user/logout', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function refreshToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    const body = { user }
    try {
        console.log('starting token refresh process')
        const deleteResponse = await deleteRefreshToken(user._id)
        const deleteData = await deleteResponse.json()
        console.log('token refresh pt1, delete:', deleteData)
        const response = await fetch('http://localhost:4000/api/user/refresh-token', {
            method: 'POST',
            headers: { 'Content-type' : 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        console.log('refresh results', data)
        localStorage.setItem('token', data.accessToken)
        return data
    } catch (err) {
        console.err()
    }
}

export { signUp, login, deleteRefreshToken, refreshToken } 