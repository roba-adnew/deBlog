async function signUp(formData) {
    const url = 'http://localhost:4000/api/user/signup'
    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    }
    try {

        console.log('new account form data', formData)
        const response = await fetch(url, options)
        console.log('signup response')
        return response.ok
    } catch (err) {
        throw err
    }
}

async function login(credentials) {
    const url = 'http://localhost:4000/api/user/login'
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(credentials)
    }
    try {
        console.log('logging in for', credentials)
        const response = await fetch(url, options)
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deleteRefreshToken(userId) {
    const body = { userId }
    try {
        console.log('making refresh token delete request')
        const url = 'http://localhost:4000/api/user/logout'
        const response = await fetchWithToken(url, 'DELETE', body)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function getNewAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    const url = 'http://localhost:4000/api/user/refresh-token'
    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ user })
    }
    try {
        console.log('starting to get new access token')
        const response = await fetch(url, options)
        const data = await response.json()
        console.log('refresh results', data)
        localStorage.setItem('token', JSON.stringify(data))
        return data
    } catch (err) {
        console.error(err)
    }
}

async function fetchWithToken(url, method = 'GET', body) {
    let accessTokenJSON = localStorage.getItem('token')

    try {
        if (!accessTokenJSON) await getNewAccessToken();
        let accessToken = JSON.parse(localStorage.getItem('token'))

        const options = {
            method,
            headers: {'Authorization': `Bearer ${accessToken.token}`}
        }
        if (body) {
            options.headers['Content-type'] = 'application/json'
            options.body = JSON.stringify(body)
        }

        const tokenExpired = 
            new Date(accessToken.expiresAt).getTime() < Date.now()

        if (tokenExpired) {
            await getNewAccessToken()
            accessToken = JSON.parse(localStorage.getItem('token'))
            options.headers['Authorization'] = `Bearer ${accessToken.token}`
        }
        const response = await fetch(url, options)
        return response
    } catch (err) {
        console.error(err)
        throw err
    }
}

export { signUp, login, deleteRefreshToken, fetchWithToken } 