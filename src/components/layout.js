/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import "./layout.css"
import Header from "./header"
import { useAuth, FirebaseContext } from "./Firebase"

const FooterWrapper = styled.footer`
    margin-top: 2rem;
    padding: 0.5rem;
    text-align: center;
    background-color: rebeccapurple;
    color: white;

    a {
        color: white;
        text-decoration: none;
        font-family: inherit;
        font-weight: bold;
    }

    a:hover {
        text-decoration: underline;
    }
`

const MainWrapper = styled.main`
    margin: 0 auto;
    max-width: 960px;
    padding: 0 1.0875rem 1.45rem;
`

const Layout = ({ children }) => {
    const { user, firebase, loading } = useAuth()
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <FirebaseContext.Provider value={{ user, firebase, loading }}>
            <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
            <MainWrapper>{children}</MainWrapper>
            <FooterWrapper>
                &copy; {new Date().getFullYear()}, Built with{" "}
                <a href="https://www.gatsbyjs.com" rel="noopener noreferrer">
                    Gatsby
                </a>{" "}
                &amp;{" "}
                <a href="https://firebase.google.com" rel="noopener noreferrer">
                    Firebase
                </a>
            </FooterWrapper>
        </FirebaseContext.Provider>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
