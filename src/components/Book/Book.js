import React from "react"
import { graphql } from "gatsby"

import SEO from "../seo"
import BookItem from "./BookItem"
import Comments from "../Comments/Comments"

const Book = props => {
    const {
        data: {
            book: { title, summary, localImage, author },
        },
    } = props

    return (
        <>
            <SEO title={title} />
            <section>
                <BookItem
                    title={title}
                    summary={summary}
                    imageUrl={localImage.childImageSharp.fixed}
                    author={author.name}
                />
                <Comments bookId={props.pageContext.bookId} />
            </section>
        </>
    )
}

export const query = graphql`
    query BookQuery($bookId: String!) {
        book(id: { eq: $bookId }) {
            title
            summary
            author {
                name
            }
            localImage {
                childImageSharp {
                    fixed(width: 200) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
`

export default Book
