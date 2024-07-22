import React from 'react'
import '../Styles/AuthorFeed.css'

function PostForm({ post, updatePost, toggleForm, handleSubmission }) {
    return (
        <>
            <div className='postForm'>
                <p>New post</p>
                <form onSubmit={handleSubmission} method='POST'>
                    <input
                        name='title'
                        className='title'
                        placeholder='title'
                        value={post.title || ''}
                        onChange={updatePost}
                    />
                    <textarea
                        name='content'
                        className='content'
                        placeholder='content'
                        value={post.content || ''}
                        onChange={updatePost}
                    />
                    <div id='checkbox'>
                        <input
                            name='draft'
                            type='checkbox'
                            onChange={updatePost}
                        />
                        <label htmlFor='draft'>
                            {post.draft
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
    )
}

export default PostForm