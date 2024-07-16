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
    const body = { postId, commentId, newContent}
    const token = JSON.parse(localStorage.getItem('token'))
    console.log(body)
    try {

        const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments/edit`, {
            method: 'PUT',
            headers: { 
                'Authorization' : `Bearer ${token}`,
                'Content-type' : 'application/json' 
            },
            body: JSON.stringify(body)
        })
        const data = await response.json();
        return data
    } catch (err) {
        throw err
    }
}

export { getPosts, getComments, editComment };