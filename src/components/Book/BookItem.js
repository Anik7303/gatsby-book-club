import React from "react"
import styled from "styled-components"
import Img from "gatsby-image"

const BookItemWrapper = styled.section`
    background: white;
    border: 1px solid #ddd;
    padding: 8px;
    margin-bottom: 8px;
    display: flex;

    h2 {
        small {
            font-weight: normal;
            font-size: 14px;
            padding-left: 8px;
        }
    }
`

const BookItemCoverWrapper = styled.div`
    max-width: 200px;

    img {
        max-width: 200px;
        object-fit: cover;
        display: block;
    }
`

const BookItemContentWrapper = styled.div`
    flex-grow: 1;
    padding-left: 8px;
`

const BookItem = props => {
    const { title, summary, author, imageUrl } = props
    return (
        <BookItemWrapper>
            <BookItemCoverWrapper>
                <Img fixed={imageUrl} />
            </BookItemCoverWrapper>
            <BookItemContentWrapper>
                <h2>
                    {title} <small>{author}</small>
                </h2>
                <p>{summary}</p>
                <div>{props.children}</div>
            </BookItemContentWrapper>
        </BookItemWrapper>
    )
}

export default BookItem
