import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { getPosts } from '../utils/api'
import CommentSection from './Comments'

function Post({ post }) {
    return (
        <div key={post._id} className="post" >
            <h3 className='title'>{post.title}</h3>
            <p className='author'>{post.user.username}</p>
            <p className='date'>{format(new Date(post.ts), 'MMM-dd-yyyy')}</p>
            <p className='content'>{post.content}</p>
            <CommentSection postId={post._id} />
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

    if (!posts || posts.length === 0) {
        console.log('issue with post check')
        return
    }

    return (
        <div id="feed">
            {posts.map(post => (<Post post={post} />))}
        </div>
    )
}


Post.propTypes = { post: PropTypes.object }

export default PostFeed