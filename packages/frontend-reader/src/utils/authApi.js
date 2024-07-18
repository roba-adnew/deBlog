async function signUp(formData) {
    try {
        const url = 'http://localhost:4000/api/user/signup'
        console.log('new account form data', {formData})
        const response = await fetchWithToken(url, 'POST', formData)
        console.log('signup response')
        return response.ok
    } catch (err) {
        throw err
    }
}

async function login(credentials) {
    try {
        console.log('logging in for', credentials)
        const url = 'http://localhost:4000/api/user/login'
        const response = await fetchWithToken(url, 'POST', credentials)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function deleteRefreshToken(userId) {
    const body = { userId }
    try {
        console.log('making refresh token delete request')
        const url = 'http://localhost:4000/api/user/logout'
        const response = fetchWithToken(url, 'DELETE', body)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function getNewAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    const body = { user }
    try {
        console.log('starting to get new access token')
        const url  = 'http://localhost:4000/api/user/refresh-token'
        const response = await fetchWithToken(url, 'POST', body)
        const data = response.json()
        console.log('refresh results', data)
        localStorage.setItem('token', data.accessToken)
        return data
    } catch (err) {
        console.error(err)
    }
}

async function fetchWithToken(url, method, body) {
    let accessToken = JSON.parse(localStorage.getItem('token'))
   
    try {
        if (new Date(accessToken.expiresAt).getTime() < Date.now()){
            await getNewAccessToken()
            accessToken = JSON.parse(localStorage.getItem('token'))
        }
        const options = { method , headers: {}, body: JSON.stringify(body)}
        options.headers['Authorization'] = `Bearer ${accessToken.token}`
        options.headers['Content-type'] = 'application/json'
        const response = await fetch(url, options)
        return response
    } catch (err) {
        console.error(err)
        throw err
    }
}

export { signUp, login, deleteRefreshToken, fetchWithToken } 