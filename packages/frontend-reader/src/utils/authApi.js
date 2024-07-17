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

async function logout(userId) {
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

export { signUp, login, logout } 