import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/Contexts/AuthContext';
import { addPost, getAuthorPosts } from '../utils/postApi'
import '../Styles/EditFeed.css'

function PostForm({ inEditPost = {}, refetch }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false)
    const [postDraft, setPostDraft] = useState({
        user: user._id,
        title: inEditPost.title,
        content: inEditPost.content,
        published: inEditPost.published || false,
        draft: true,
    })

    function toggleForm() { setEditing(!editing) }

    async function handlePostSubmission(e) {
        e.preventDefault();
        try {
            console.log('commencing submitting post')
            const response = await addPost(postDraft)
            console.log('post submission response:', response)
            console.log('post submitted')
            refetch(true)
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            toggleForm()
        }
    }

    function updatePostDraft(e) {
        const updateValue = e.target.name === 'draft' ?
            !postDraft.draft : e.target.value
        setPostDraft({
            ...postDraft,
            [e.target.name]: updateValue
        })
    }

    const newPostButton =
        <div id='newPostButton' onClick={toggleForm}>
            + Start on a new post
        </div>

    const newPostForm =
        <>
            <div className='postForm'>
            <p>New post</p>
                <form onSubmit={handlePostSubmission} method='POST'>
                    <input
                        name='title'
                        className='title'
                        placeholder='title'
                        value={postDraft.title || ''}
                        onChange={updatePostDraft}
                    />
                    <textarea
                        name='content'
                        className='content'
                        placeholder='content'
                        value={postDraft.content || ''}
                        onChange={updatePostDraft}
                    />
                    <div id='checkbox'>
                        <input
                            name='draft'
                            type='checkbox'
                            onChange={updatePostDraft}
                            />
                        <label for='draft'>
                            {postDraft.draft 
                                ? 'in draft' 
                                : 'completed'
                            }

                        </label>
                    </div>
                    
                    <div className='formBtnsDiv'>
                        <button className='addBtn'>submit post&nbsp;</button>
                        <button className='cancelBtn' onClick={toggleForm}>
                            cancel
                        </button>
                    </div>
                </form>
            </div>
        </>

    console.log(postDraft)
    return (
        editing ? newPostForm : newPostButton
    )
}

function PostPreviewCard({ post }) {
    return (
        <div className='post' >
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
    const [refetch, setRefetch] = useState(false)

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
                setRefetch(false)
            }
        }
        fetchPosts()
    }, [refetch])

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
            {posts.map(post => (
                <PostPreviewCard post={post} key={post._id} />
            ))}
            <PostForm refetch={setRefetch} />
        </div>
    )
}

export default EditFeed