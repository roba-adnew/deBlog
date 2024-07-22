import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/Contexts/AuthContext';
import { addPost, editPost, getAuthorPosts } from '../utils/postApi'
import PostForm from './PostForm';
import '../Styles/EditFeed.css'

function NewPostButton({ refetch }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false)
    const [postDraft, setPostDraft] = useState({
        user: user._id,
        title: '',
        content: '',
        published: false,
        draft: true,
    })

    function updatePostDraft(e) {
        const updateValue = e.target.name === 'draft' ?
            !postDraft.draft : e.target.value
        setPostDraft({
            ...postDraft,
            [e.target.name]: updateValue
        })
    }

    function toggleForm() { setEditing(!editing) }

    async function handleNewPostSubmission(e) {
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

    return (
        editing
            ? <PostForm
                post={postDraft}
                updatePost={updatePostDraft}
                toggleForm={toggleForm}
                handleSubmission={handleNewPostSubmission}
            />
            : <div id='newPostButton' onClick={toggleForm}>
                + Start on a new post
            </div>
    )
}

function PostPreviewCard({ postDetails, refetch }) {
    const [post, setPost] = useState(postDetails)
    const [editing, setEditing] = useState(false)

    function updatePost(e) {
        const updateValue = e.target.name === 'draft' ?
            !post.draft : e.target.value
        setPost({
            ...post,
            [e.target.name]: updateValue
        })
    }

    function toggleForm() { setEditing(!editing) }
    console.log('post preview has', post)

    async function handleEditSubmission(e) {
        e.preventDefault()
        try {
            console.log('commencing post edit', post)
            const response =
                await editPost(post._id, post)
            console.log('response', response)
            console.log('comment updated')
            refetch(true)
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            toggleForm()
        }
    }

    const postPreviewCard =
        <div className='post' onClick={toggleForm}>
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

    return (
        editing ?
            <PostForm
                post={post}
                updatePost={updatePost}
                toggleForm={toggleForm}
                handleSubmission={handleEditSubmission}
            />
            : postPreviewCard
    )
}

function EditFeed() {
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

    return (
        <div id="feed">
            {posts.map(post => (
                <PostPreviewCard
                    postDetails={post}
                    key={post._id}
                    refetch={setRefetch}
                />
            ))}
            <NewPostButton refetch={setRefetch} />
        </div>
    )
}

export default EditFeed