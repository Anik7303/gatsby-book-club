import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"

import SEO from "../components/seo"
import {
    Form,
    Button,
    Input,
    ErrorMessage,
    MessageWrapper,
} from "../components/common"
import { FirebaseContext } from "../components/Firebase"

const FormField = styled.div`
    margin: 8px auto;

    label {
        font-size: 90%;
        font-weight: bold;
    }
`

const fileReader = new FileReader()

const AddBook = props => {
    const { firebase } = useContext(FirebaseContext)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [authors, setAuthors] = useState([])
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [authorId, setAuthorId] = useState("")
    const [bookCover, setBookCover] = useState("")

    useEffect(() => {
        fileReader.addEventListener("load", () => {
            setBookCover(fileReader.result)
        })
    }, [])

    useEffect(() => {
        if (firebase) {
            firebase
                .getAuthors()
                .then(snapshot => {
                    const temp = []
                    snapshot.forEach(doc => {
                        temp.push({
                            id: doc.id,
                            name: doc.data().name,
                        })
                    })
                    setAuthors(temp)
                    setAuthorId(temp[0].id)
                })
                .catch(err => setError(err.message))
        }
    }, [firebase])

    useEffect(() => {
        let timerId
        if (error) {
            timerId = setTimeout(() => {
                setError(null)
            }, 2000)
        }
        return () => {
            clearTimeout(timerId)
        }
    }, [error])

    useEffect(() => {
        let timerId
        if (message) {
            timerId = setTimeout(() => {
                setMessage(null)
            }, 2000)
        }
        return () => {
            clearTimeout(timerId)
        }
    }, [message])

    const clearFormInputs = () => {
        setTitle("")
        setSummary("")
        setAuthorId("")
        setBookCover("")
    }

    const handleInputChange = evt => {
        evt.persist()
        const { name, value, files } = evt.target
        switch (name) {
            case "title":
                setTitle(value)
                break
            case "summary":
                setSummary(value)
                break
            case "authorId":
                setAuthorId(value)
                break
            case "bookCover":
                fileReader.readAsDataURL(files[0])
                break
            default:
                throw new Error()
        }
    }

    const handleSubmit = evt => {
        evt.preventDefault()
        // This uses firebase functions, but functions are not available in free tier
        // Thus this portion is commented out
        // firebase
        //     .createBook({ title, summary, authorId, bookCover })
        //     .then(() => {
        //         setMessage("Book Added.")
        //         clearFormInputs()
        //     })
        //     .catch(err => setError(err.message))
    }

    return (
        <>
            <SEO title="Add Book" />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {message && <MessageWrapper>{message}</MessageWrapper>}
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    placeholder="Summary"
                    name="summary"
                    value={summary}
                    onChange={handleInputChange}
                    required
                />
                <FormField>
                    <label htmlFor="authorName">Author</label>
                    <div>
                        <select
                            id="authorName"
                            name="authorId"
                            value={authorId}
                            onChange={handleInputChange}
                            required
                        >
                            {authors.map(({ name, id }) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </FormField>
                <FormField>
                    <label htmlFor="bookCover">Book Cover</label>
                    <Input
                        id="bookCover"
                        name="bookCover"
                        type="file"
                        onChange={handleInputChange}
                        required
                    />
                </FormField>
                <Button type="submit" block>
                    Add Book
                </Button>
            </Form>
        </>
    )
}

export default AddBook
