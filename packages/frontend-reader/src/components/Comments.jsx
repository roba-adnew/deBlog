import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { getComments, editComment as apiEditComment } from '../utils/postApi'

function Comment({ comment, postId, refetch }) {
    const [editing, setEditing] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))
    const userIsCommenter = !!user && (user._id === comment.user._id);

    function CommentDisplay() {
        const date = format(new Date(comment.ts), 'MMM-dd')

        function toggleForm() {setEditing(true)}

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

        function updateContent(e) {setContent(e.target.value)}

        async function handleEditSubmission(e) {
            e.preventDefault()
            try {
                console.log('commencing comment edit')
                const response = 
                    await apiEditComment(postId, comment._id, content)
                console.log('response', response)
                console.log('comment updated')
                refetch(true)
            } catch (err) {
                console.error(err)
                throw err
            } finally {
                setEditing(false)
            }
        }

        return (
            <form onSubmit={handleEditSubmission} method='PUT'>
                <input
                    value={content}
                    name='content'
                    onChange={updateContent}
                />
                <button className='submitEdit'>submit</button>
            </form>
        )
    }

    return (
        <div className='comment'>
            {editing
                ? <CommentEditForm />
                : <CommentDisplay  />
            }
        </div>
    )
}

function CommentSection({ postId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState(null)
    const [refetch, setRefetch] = useState(false)
    const [error, setError] = useState(null)

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
            }
        }
        fetchComments(postId)
    }, [refetch])

    if (!comments || comments.length === 0) return

    function AddCommentForm() {
        const [adding, setAdding] = useState(false)

        function addComment(e) {
            e.preventDefault()
            toggleForm()
        }

        function toggleForm() {setAdding(!adding)}


        return (
            adding 
            ? <form onSubmit={addComment} method='POST'>
                <input 

                />
                <button>add comment</button>
            </form>
            : <button onClick={toggleForm}>add new comment</button>
        )
    }

    return (
        <div className="commentSection">
            <p className='commentTitle'>Comments</p>
            <hr className='commentDivider' />
            {comments.map((comment, i, array) => {
                const isLast = i === array.length - 1;
                return (
                    <>
                        <Comment 
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
            <AddCommentForm />
        </div>
    )
}

Comment.propTypes = { comment: PropTypes.object }
CommentSection.propTypes = { postId: PropTypes.string }

export default CommentSection