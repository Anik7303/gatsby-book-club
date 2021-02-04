import React, { useState, useContext, useEffect } from "react"

import SEO from "../components/seo"
import {
    Form,
    Input,
    Button,
    ErrorMessage,
    MessageWrapper,
} from "../components/common"
import { FirebaseContext } from "../components/Firebase"

const AddAuthor = () => {
    const [name, setName] = useState("")
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const { firebase } = useContext(FirebaseContext)

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

    const handleSubmit = evt => {
        evt.preventDefault()
        firebase
            .addAuthor({ name })
            .then(result => {
                console.log({ result })
                setName("")
                setMessage("Author added successfully.")
            })
            .catch(err => setError(err.message))
    }

    return (
        <>
            <SEO title={"Add Author"} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {message && <MessageWrapper>{message}</MessageWrapper>}
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="Author Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <Button type="submit" block>
                    Add Author
                </Button>
            </Form>
        </>
    )
}

export default AddAuthor
