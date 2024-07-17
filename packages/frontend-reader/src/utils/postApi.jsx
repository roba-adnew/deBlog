import { refreshToken } from './authApi'

async function getPosts() {
    try {
        const response = await fetch('http://localhost:4000/api/posts');
        const data = await response.json();
        console.log('Post API response:', data);
        return data.posts
    } catch (err) {
        throw err
    }
}

async function getComments(postId) {
    try {
        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
        const data = await response.json();
        console.log('Comment API response:', data);
        return data.comments
    } catch (err) {
        throw err
    }
}

async function editComment(postId, commentId, newContent) {
    const body = { commentId, newContent}
    try {
        const url = `http://localhost:4000/api/posts/${postId}/comments/edit`
        const data = await fetchWithToken(url, 'PUT', body)
        return data
    } catch (err) {
        throw err
    }
}

async function addComment(postId, content){
    const body = { content }
    try {
        const url = `http://localhost:4000/api/posts/${postId}/comments`
        const data = await fetchWithToken(url, 'POST', body) 
        return data
    } catch (err) {
        throw err
    }
}

async function fetchWithToken(url, method, body) {
    let accessToken = JSON.parse(localStorage.getItem('token'))
   
    try {
        if (new Date(accessToken.expiresAt).getTime() < Date.now()){
            await refreshToken()
            accessToken = JSON.parse(localStorage.getItem('token'))
        }
        const options = { method , headers: {}, body: JSON.stringify(body)}
        options.headers['Authorization'] = `Bearer ${accessToken.token}`
        options.headers['Content-type'] = 'application/json'
        const response = await fetch(url, options)
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export { getPosts, getComments, editComment , addComment};