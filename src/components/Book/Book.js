import React from "react"
import { graphql } from "gatsby"

import BookItem from "./BookItem"

const Book = props => {
    const {
        data: {
            book: { title, summary, localImage, author },
        },
    } = props

    return (
        <section>
            <BookItem
                title={title}
                summary={summary}
                imageUrl={localImage.childImageSharp.fixed}
                author={author.name}
            />
        </section>
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
