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
    } catch (error) {
        throw error
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
        return response
    } catch (error) {
        throw error
    }
}

export { signUp, login } 