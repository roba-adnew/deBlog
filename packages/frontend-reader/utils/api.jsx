import debug from 'debug'

async function getPosts() {
    try {
        const rawResponse = await fetch('http://localhost:4000/posts');
        const data = await rawResponse.json();
        console.log('API response:', data);
        return data.posts
    } catch (err) {
        throw err
    }
}

export default getPosts;