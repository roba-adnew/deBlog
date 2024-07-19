import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import { format } from 'date-fns'
// import { getPosts } from '../utils/postApi'
// import CommentSection from './Comments'
// import '../Styles/Feed.css'

function Post({ post }) {
    return (
        <div className="post" >
            <h3 className='title'>{post.title}</h3>
            <p className='authorDate'>{post.user.username} - {format(new Date(post.ts), 'MMM-dd-yyyy')}</p>
            <p className='content'>{post.content}</p>
            {/* <CommentSection postId={post._id} /> */}
        </div>
    )
}

function EditFeed({ }) {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([
        {
            _id: 'ID',
            title: 'test ya know',
            user: {
                user: {
                    username: 'nah'
                }
            },
            ts: new Date.now(),
            content: 'ya feel'
        }
    ])

    // useEffect(() => {
    //     async function fetchPosts() {
    //         try {
    //             setIsLoading(true)
    //             const fetchedPosts = await getPosts();
    //             console.log('Fetched posts:', fetchedPosts);
    //             if (!fetchedPosts || fetchedPosts.length === 0) {
    //                 throw new Error('failed to load posts')
    //             }
    //             setPosts(fetchedPosts)
    //         } catch (err) {
    //             console.error('Error fetching posts:', err)
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    //     fetchPosts()
    // }, [])

    if (isLoading) {
        return (
            <div>
                Just a moment, we&apos;re just getting this post for you...
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        console.log('issue with post check')
        return
    }

    return (
        <>
            <div id="feed">
                {posts.map(post => (<Post post={post} key={post._id}/>))}
            </div>
        </>
    )
}

// Post.propTypes = { post: PropTypes.object }

export default EditFeed