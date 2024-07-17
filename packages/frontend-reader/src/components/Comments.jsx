import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { getComments, editComment, addComment } from '../utils/postApi'

function Comment({ user, comment, postId, refetch }) {
    const [editing, setEditing] = useState(false)
    const loggedIn = !!user
    const userIsCommenter = loggedIn && (user._id === comment.user._id);

    function toggleForm() { setEditing(!editing) }


    function CommentDisplay() {
        const date = format(new Date(comment.ts), 'MMM-dd')

        return (
            <>
                <p className='authorDate'>{comment.user.username} - {date}</p>
                <p className='content' name='content'>{comment.content}</p>
                {userIsCommenter &&
                    <div className="editDelete">
                        <button
                            onClick={toggleForm}
                            className='editBtn'>
                            Edit -&nbsp;
                        </button>
                        <button className='deleteBtn'> Delete</button>
                    </div>
                }
            </>
        )
    }

    function CommentEditForm() {
        const [content, setContent] = useState(comment.content)

        function updateContent(e) { setContent(e.target.value) }

        async function handleEditSubmission(e) {
            e.preventDefault()
            try {
                console.log('commencing comment edit')
                const response =
                    await editComment(postId, comment._id, content)
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

        return (
            <form
                className='addCommentForm'
                onSubmit={handleEditSubmission}
                method='PUT'
            >
                <input
                    value={content}
                    name='content'
                    onChange={updateContent}
                />
                <div className='formBtnsDiv'>
                    <button className='addBtn'>Submit -&nbsp;</button>
                    <button className='cancelBtn' onClick={toggleForm}>
                        Cancel
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className='comment'>
            {editing
                ? <CommentEditForm />
                : <CommentDisplay />
            }
        </div>
    )
}

function CommentSection({ postId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [refetch, setRefetch] = useState(false)
    const [error, setError] = useState(null)

    const user = JSON.parse(localStorage.getItem('user'))
    const loggedIn = !!user

    useEffect(() => {
        async function fetchComments(postId) {
            try {
                setIsLoading(true)
                const fetchedComments = await getComments(postId);
                // console.log('Fetched comments:', fetchedComments);
                if (!fetchedComments || fetchedComments.length === 0) {
                    throw new Error('failed to load comments')
                }
                setComments(fetchedComments)
            } catch (err) {
                setError(error)
                console.error(err)
            } finally {
                setIsLoading(false)
                setRefetch(false)
            }
        }
        fetchComments(postId)
    }, [refetch])


    function AddCommentForm() {
        const [content, setContent] = useState('')
        const [adding, setAdding] = useState(false)

        async function handleSubmission(e) {
            e.preventDefault()
            try {
                console.log('commencing comment edit')
                const response =
                    await addComment(postId, content)
                console.log('response', response)
                console.log('comment added')
                setRefetch(true)
            } catch (err) {
                console.error(err)
                throw err
            } finally {
                toggleForm()
            }

        }

        function updateContent(e) { setContent(e.target.value) }

        function toggleForm() { setAdding(!adding) }

        return (
            adding
                ? <div className='addCommentDiv'>
                    <form class='addCommentForm' onSubmit={handleSubmission} method='POST'>
                        <input
                            value={content}
                            onChange={updateContent}
                        />
                        <div className='formBtnsDiv'>
                            <button className='addBtn'>Add Comment -&nbsp;</button>
                            <button className='cancelBtn' onClick={toggleForm}>
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
                : <div className='addCommentButton' onClick={toggleForm}>
                    + add new comment
                </div>
        )
    }

    return (
        <>
            {comments.length > 0 &&
                <div className="commentSection">
                    <p className='commentTitle'>Comments</p>
                    <hr className='commentDivider' />
                    {comments.map((comment, i, array) => {
                        const isLast = i === array.length - 1;
                        return (
                            <>
                                <Comment
                                    user={user}
                                    key={comment._id}
                                    postId={postId}
                                    comment={comment}
                                    refetch={setRefetch}
                                />
                                {!isLast &&
                                    <hr key={comment._id} className='commentDivider' />
                                }
                            </>
                        )
                    })}
                </div>
            }
            {loggedIn && <AddCommentForm />}
        </>

    )
}

Comment.propTypes = { comment: PropTypes.object }
CommentSection.propTypes = { postId: PropTypes.string }

export default CommentSection