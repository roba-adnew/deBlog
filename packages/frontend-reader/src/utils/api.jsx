import debug from 'debug'

async function getPosts() {
    try {
        const rawResponse = await fetch('http://localhost:4000/api/posts');
        const data = await rawResponse.json();
        console.log('Post API response:', data);
        return data.posts
    } catch (err) {
        throw err
    }
}

async function getComments(postId) {
    try {
        const rawResponse = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
        const data = await rawResponse.json();
        console.log('Comment API response:', data);
        return data.comments
    } catch (err) {
        throw err
    }
}

export { getPosts, getComments };