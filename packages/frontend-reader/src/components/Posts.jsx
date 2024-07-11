import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import getPosts from '../utils/api'

function Post({ post }) {
    return (

        <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {/* comments section component */}
        </div>
    )
}

function PostFeed({ }) {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState(null)
    const [error, setError] = useState(null)

    // usestate for comments 
    //  usestate if using id 

    useEffect(() => {
        async function fetchPosts() {
            try {
                setIsLoading(true)
                const fetchedPosts = await getPosts();
                console.log('Fetched posts:', fetchedPosts);
                if (!fetchedPosts || fetchedPosts.length === 0) {
                    throw new Error('failed to load posts')
                }
                setPosts(fetchedPosts)
            } catch (err) {
                setError(error)
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    if (isLoading) {
        return (
            <div>
                Just a moment, we&apos;re just getting this post for you...
            </div>
        )
    }

    console.log('Render state:', { isLoading, posts, error });

    if (!posts) console.log('issue with post check')

    return (
        <div id="allPosts">
            {posts.map(post => (<Post post={post} />))}
        </div>
    )
}


Post.propTypes = { post: PropTypes.object }

export default PostFeed