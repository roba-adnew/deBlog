async function signUp(formData) {
    try {
        const response = await fetch(
            'http://localhost:4000/api/user/signup', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            }
        )
        const data = response.json()
        console.log(data)
        return
    } catch (error) {
        throw error
    }
}