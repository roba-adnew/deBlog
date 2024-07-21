import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getAuthorPosts } from '../utils/postApi'
import '../Styles/EditFeed.css'

function PostPreviewCard({ post }) {
    {console.log(post)}
    
    return (
        <div className="post" >
            <div className='title'>
                {post.title.length > 24  
                    ? post.title.slice(0,24).trimEnd().concat('...')
                    : post.title
                }
            </div>
            <div className='flags'>
                   <div className={post.draft ? 'inDraft' : 'completed'}>
                in draft
            </div>
            <div className={post.published ? 'published' : 'unPublished'}>
                {post.published ? 'published' : 'not published'}
            </div>
            </div>
         
        </div>
    )
}

function EditFeed({ }) {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        async function fetchPosts() {
            try {
                setIsLoading(true)
                const fetchedPosts = await getAuthorPosts();
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
            <dialog>
                Just a moment, we&apos;re just getting this stuff for you...
            </dialog>
        )
    }

    if (!posts || posts.length === 0) {
        console.log('issue with post check')
        return
    }

    return (
        <>
            <div id="feed">
                {console.log('trying to load the feed')}
                {posts.map(post => (<PostPreviewCard post={post} key={post._id}/>))}
            </div>
        </>
    )
}

export default EditFeed