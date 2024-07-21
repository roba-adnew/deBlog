import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/Contexts/AuthContext';
import { getAuthorPosts } from '../utils/postApi'
import '../Styles/EditFeed.css'

function PostForm({ inEditPost = {} }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false)
    const [postDraft, setPostDraft] = useState({
        user: user._id,
        title: inEditPost.title,
        content: inEditPost.content,
        published: inEditPost.published || false,
        draft: true,
    })

    function toggleForm() { 
        setEditing(!editing) 
    }

    function handleSubmission() {}

    function updatePostDraft(e) {
        setPostDraft({
            ...postDraft,
            [e.target.name]: e.target.value
        })
    }

    const newPostButton =
        <div id='newPostButton' onClick={toggleForm}>
            + Start on a new post
        </div>

    const newPostForm =
        <div class='postForm'>
            <form onSubmit={handleSubmission} method='POST'>
                <label for='title'>title</label>
                <input
                    name='title'
                    value={postDraft.title}
                    onChange={updatePostDraft}
                />
                <label for='content'>content</label>
                <input
                    name='content'
                    value={postDraft.content}
                    onChange={updatePostDraft}
                />
                <div className='formBtnsDiv'>
                    <button className='addBtn'>Add Post&nbsp;</button>
                    <button className='cancelBtn' onClick={toggleForm}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    return (
        editing ? newPostForm : newPostButton
    )
}

function PostPreviewCard({ post }) {
    { console.log(post) }

    return (
        <div className="post" >
            <div className='title'>
                {post.title.length > 24
                    ? post.title.slice(0, 24).trimEnd().concat('...')
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
        <div id="feed">
            {console.log('trying to load the feed')}
            {posts.map(post => (<PostPreviewCard post={post} key={post._id} />))}
            <PostForm />
        </div>
    )
}

export default EditFeed