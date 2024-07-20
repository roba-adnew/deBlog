import { fetchWithToken } from '../../../shared/utils/authApi'

async function getAuthorPosts() {
    const url = 'http://localhost:4000/api/posts'
    try {
        const response = await fetchWithToken(url);
        const data = await response.json();
        console.log('Post API response:', data.posts);

        return data.posts
    } catch (err) {
        throw err
    }
}

// async function getComments(postId) {
//     try {
//         const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
//         const data = await response.json();
//         console.log('Comment API response:', data);
//         return data.comments
//     } catch (err) {
//         throw err
//     }
// }

// async function editComment(postId, commentId, newContent) {
//     const url = `http://localhost:4000/api/posts/${postId}/comments/edit`
//     const method = 'POST'
//     const body = { commentId, newContent}
//     try {
//         const response = await fetchWithToken(url, method, body)
//         const data = await response.json()
//         return data
//     } catch (err) {
//         throw err
//     }
// }

// async function addComment(postId, content){
//     const body = { content }
//     const method = 'POST'
//     const url = `http://localhost:4000/api/posts/${postId}/comments`
//     try {
//         const response = await fetchWithToken(url, method, body) 
//         const data = await response.json()
//         return data
//     } catch (err) {
//         throw err
//     }
// }

export { getAuthorPosts };