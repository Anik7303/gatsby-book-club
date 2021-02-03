import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import moment from "moment"

const SingleCommentWrapper = styled.div`
    border-bottom: 1px solid #ddd;
    padding: 4px 0;

    > strong {
        font-size: 80%;
        color: #666;

        > small {
            font-size: 90%;
            font-weight: normal;
            color: #333;
        }
    }
`

const SingleComment = props => {
    const { user, content, created } = props.comment
    return (
        <SingleCommentWrapper>
            <strong>
                {user} &#8211;{" "}
                <small>
                    {moment(created.toDate()).format("Do MMM YYYY HH:mm")}
                </small>
            </strong>
            <div>{content}</div>
        </SingleCommentWrapper>
    )
}

SingleComment.propTypes = {
    user: PropTypes.string,
    content: PropTypes.string,
}

export default SingleComment
