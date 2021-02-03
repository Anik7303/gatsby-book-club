import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Link } from "gatsby"

import { Input, Button } from "../common"

const CommentFormWrapper = styled.form`
    margin-top: 32px;
    display: flex;
    align-items: center;

    ${Input} {
        margin: 0;
        margin-right: 8px;
    }
`

const LinkWrapper = styled.div`
    margin-top: 32px;
    padding: 8px;
    width: 100%;
    border: 1px solid rebeccapurple;
    text-align: center;
`

const CommentForm = ({ comment, onInputChange, onSubmit, user }) => {
    if (!user) {
        return (
            <LinkWrapper>
                <Link to="/login">Please Log in to comment</Link>
            </LinkWrapper>
        )
    }
    return (
        <CommentFormWrapper onSubmit={onSubmit}>
            <Input
                type="text"
                placeholder="Enter your comment here...."
                value={comment}
                onChange={onInputChange}
            />
            <Button type="submit">Post Comment</Button>
        </CommentFormWrapper>
    )
}

CommentForm.propTypes = {
    comment: PropTypes.string,
    onInputChange: PropTypes.func,
    onSubmit: PropTypes.func,
}

export default CommentForm
