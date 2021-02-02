import React, { useContext, useState } from "react"
import styled from "styled-components"

import { FirebaseContext } from "../Firebase"
import { Button, Input } from "../common"
import { useComments } from "../../hooks"

const CommentForm = styled.form`
    margin-top: 32px;
    display: flex;
    align-items: center;

    ${Input} {
        margin: 0;
        margin-right: 8px;
    }
`

const SingleComment = styled.div`
    border-bottom: 1px solid #ddd;
    padding: 4px 0;

    > strong {
        font-size: 80%;
        color: #666;
    }
`

const Comments = props => {
    const { bookId } = props

    const [formComment, setFormComment] = useState("")
    const { firebase } = useContext(FirebaseContext)
    const { comments, error } = useComments({ firebase, bookId })

    if (error) {
        console.error(error)
    }

    const handleSubmit = evt => {
        evt.preventDefault()

        // clear comment box
        setFormComment("")
    }

    const renderComments = () =>
        comments.map(({ id, user, content }) => (
            <SingleComment key={id}>
                <strong>{user}</strong>
                <div>{content}</div>
            </SingleComment>
        ))

    return (
        <section>
            <CommentForm onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Enter your comment here...."
                    value={formComment}
                    onChange={e => setFormComment(e.target.value)}
                />
                <Button type="submit">Post Comment</Button>
            </CommentForm>
            {renderComments()}
        </section>
    )
}

export default Comments
