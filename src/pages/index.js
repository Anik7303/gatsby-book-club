import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import SEO from "../components/seo"
import BookItem from "../components/Book/BookItem"

const LinkButton = styled.div`
    text-align: right;

    a {
        padding: 8px;
        background: rebeccapurple;
        color: white;
        border-radius: 8px;
        text-decoration: none;
    }

    a:hover {
        background: indigo;
    }
`

const IndexPage = props => {
    const { data } = props
    return (
        <section>
            <SEO title="Home" />
            {data.allBook.nodes.map(
                ({ id, title, summary, localImage, author }) => (
                    <BookItem
                        key={id}
                        title={title}
                        summary={summary}
                        imageUrl={localImage.childImageSharp.fixed}
                        author={author.name}
                    >
                        <LinkButton>
                            <Link to={`/book/${id}`}>Join Conversation</Link>
                        </LinkButton>
                    </BookItem>
                )
            )}
        </section>
    )
}

export const query = graphql`
    {
        allBook {
            nodes {
                id
                title
                summary
                localImage {
                    childImageSharp {
                        fixed(width: 200) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
                author {
                    name
                }
            }
        }
    }
`

export default IndexPage
