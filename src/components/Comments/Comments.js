import React, { useContext, useState } from "react"
import PropTypes from "prop-types"

import { FirebaseContext } from "../Firebase"
import { useComments } from "../../hooks"
import CommentForm from "./CommentForm"
import SingleComment from "./SingleComment"

const Comments = ({ bookId }) => {
    const [formComment, setFormComment] = useState("")
    const { firebase, user } = useContext(FirebaseContext)
    const { comments, error } = useComments({ firebase, bookId })

    if (error) {
        console.error(error)
    }

    const handleFormSubmit = evt => {
        evt.preventDefault()
        firebase
            .postComment({
                userId: user.uid,
                bookId,
                comment: formComment,
            })
            .catch(err => console.error({ err }))
        // clear comment box
        setFormComment("")
    }

    const handleInputChange = evt => {
        evt.persist()
        setFormComment(evt.target.value)
    }

    const renderComments = () =>
        comments.map(comment => (
            <SingleComment key={comment.id} comment={comment} />
        ))

    return (
        <section>
            <CommentForm
                user={user}
                comment={formComment}
                onInputChange={handleInputChange}
                onSubmit={handleFormSubmit}
            />
            {renderComments()}
        </section>
    )
}

Comments.propTypes = {
    bookId: PropTypes.string,
}

export default Comments
