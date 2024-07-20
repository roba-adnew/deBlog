import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getPosts } from '../utils/postApi'
import CommentSection from './Comments'
import '../Styles/Feed.css'

function Post({ post }) {
    return (
        <div className="post" >
            <h3 className='title'>{post.title}</h3>
            <p className='authorDate'>{post.user.username} - {format(new Date(post.ts), 'MMM-dd-yyyy')}</p>
            <p className='content'>{post.content}</p>
            <CommentSection postId={post._id} />
        </div>
    )
}

function Feed({ }) {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState(null)

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
                console.error('Error fetching posts:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    if (isLoading) {
        return (
            <dialog open>
                Just a moment, we&apos;re just getting this post for you...
            </dialog>
        )
    }

    if (!posts || posts.length === 0) {
        console.log('issue with post check')
        return
    }

    return (
        <div id="feed">
            {posts.map(post => (<Post post={post} key={post._id} />))}
        </div>
    )
}

export default Feed