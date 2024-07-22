import { fetchWithToken } from '../../../shared/utils/authApi'

async function getAuthorPosts() {
    const url = 'http://localhost:4000/api/posts/author'
    try {
        const response = await fetchWithToken(url);
        const data = await response.json();
        console.log('Post API response:', data.posts);
        return data.posts
    } catch (err) {
        throw err
    }
}

async function addPost(post){
    const method = 'POST'
    const url = `http://localhost:4000/api/posts/`
    try {
        const response = await fetchWithToken(url, method, post) 
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

async function editPost(postId, updatedPost) {
    const url = `http://localhost:4000/api/posts/author/${postId}/edit`
    const method = 'PUT'
    const body = updatedPost
    try {
        const response = await fetchWithToken(url, method, body)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
}

export { getAuthorPosts, addPost, editPost };