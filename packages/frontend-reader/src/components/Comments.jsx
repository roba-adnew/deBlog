import React, { useState, useEffect } from 'react'
import PropTypes, { array } from 'prop-types'
import { format } from 'date-fns'
import { getComments } from '../utils/api'

function Comment({ comment }) {
    return (
        <div className='comment'>
            <p className='authorDate'>{comment.user.username} - {format(new Date(comment.ts), 'MMM-dd')}</p>
            <p className='content'>{comment.content}</p>
        </div>
    )
}

function CommentSection({ postId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchComments(postId) {
            try {
                setIsLoading(true)
                const fetchedComments = await getComments(postId);
                console.log('Fetched comments:', fetchedComments);
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
    }, [])

    if (isLoading) {
        return (
            <div>
                Just a moment, we&apos;re just getting this post for you...
            </div>
        )
    }

    console.log('Render state:', { isLoading, comments, error });

    if (!comments || comments.length === 0) {
        console.log('There are no comments')
        return
    }

    return (
        <div className="commentSection">
            <p className='commentTitle'>Comments</p>
            <hr class='commentDivider'/>
            {comments.map((comment, i, array) => {
                const isLast = i === array.length - 1;
                return (
                    <>
                        <Comment key={comment.id} comment={comment} />
                        {!isLast && <hr class='commentDivider'/>}
                    </>
                )
            })}
        </div>
    )
}

Comment.propTypes = { comment: PropTypes.object }
CommentSection.propTypes = { postId: PropTypes.string }


export default CommentSection

// funtion commentform({ optional comment id form }) 
// usestate loading and error 
// define setloading and error
// guard clauses for loading and error  
// return 
// form 
// submit button 