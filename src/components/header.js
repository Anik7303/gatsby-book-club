import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import React, { useContext } from "react"
import styled from "styled-components"

import { FirebaseContext } from "../components/Firebase"

const HeaderWrapper = styled.header`
    background: rebeccapurple;
    margin-bottom: 1.45rem;
`

const HeaderContent = styled.div`
    margin: 0 auto;
    max-width: 960px;
    padding: 1.45rem 1.0875rem;
    display: flex;

    > h1 {
        margin: 0;
        flex-grow: 1;

        > a {
            color: white;
            text-decoration: none;
        }
    }
    > div {
        margin: auto 0;
    }
`

const UserInfo = styled.div`
    text-align: right;
    color: white;
`

const LoginLink = styled.div`
    margin: auto 0;
    > a {
        color: white;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`

const LogoutLink = styled.span`
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`

const AdminLink = styled.span`
    a {
        color: white;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`

const Divider = styled.span`
    margin: 0 8px;
    padding-right: 1px;
    background: #ddd;
`

const Header = ({ siteTitle }) => {
    const { firebase, user, loading } = useContext(FirebaseContext)

    const handleLogoutClick = () => {
        firebase
            .logout()
            .then(() => navigate("/login"))
            .catch(err => console.error({ err }))
    }

    return (
        <HeaderWrapper>
            <HeaderContent>
                <h1>
                    <Link to="/">{siteTitle}</Link>
                </h1>
                {!loading && (
                    <div>
                        {user && user.email && (
                            <UserInfo>
                                Hello, {user.username || user.email}
                                <div>
                                    {user.isAdmin && (
                                        <AdminLink>
                                            <Link to="/add-author">
                                                Add Author
                                            </Link>
                                            <Divider />
                                            <Link to="/add-book">Add Book</Link>
                                            <Divider />
                                        </AdminLink>
                                    )}
                                    <LogoutLink onClick={handleLogoutClick}>
                                        Logout
                                    </LogoutLink>
                                </div>
                            </UserInfo>
                        )}
                        {(!user || !user.email) && (
                            <LoginLink>
                                <Link to="/login">Login</Link>
                                <Divider />
                                <Link to="/register">Register</Link>
                            </LoginLink>
                        )}
                    </div>
                )}
            </HeaderContent>
        </HeaderWrapper>
    )
}

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: ``,
}

export default Header
