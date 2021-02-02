import React, { useState, useContext } from "react"
import { navigate } from "gatsby"

import { Form, Input, Button, ErrorMessage } from "../components/common"
import { FirebaseContext } from "../components/Firebase"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const { firebase } = useContext(FirebaseContext)

    const clearState = () => {
        setEmail("")
        setPassword("")
        setError(null)
    }

    const handleInputChange = evt => {
        evt.persist()
        if (error) {
            setError(null)
        }
        const { name, value } = evt.target
        switch (name) {
            case "email":
                setEmail(value)
                break
            case "password":
                setPassword(value)
                break
            default:
                setError("Wrong input name used")
        }
    }

    const handleSubmit = evt => {
        evt.preventDefault()
        firebase
            .login({ email, password })
            .then(() => {
                clearState()
                navigate("/")
            })
            .catch(err => setError(err.message))
    }

    return (
        <section>
            <Form onSubmit={handleSubmit}>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange}
                    minLength={8}
                    required
                />
                <Button type="submit" block>
                    Login
                </Button>
            </Form>
        </section>
    )
}

export default Login
