import { navigate } from "gatsby"
import React, { useState, useContext } from "react"

import SEO from "../components/seo"
import { Form, Input, Button, ErrorMessage } from "../components/common"
import { FirebaseContext } from "../components/Firebase"

const INITIAL_FORM_STATE = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const Register = () => {
    const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)
    const [error, setError] = useState(null)
    const { firebase } = useContext(FirebaseContext)

    const handleSubmit = evt => {
        evt.preventDefault()

        if (formValues.password !== formValues.confirmPassword) {
            return setError("Password and Confirm Password fiels must match")
        }

        firebase
            .register(formValues)
            .then(() => {
                navigate("/")
            })
            .catch(err => setError(err.message))
    }

    const handleInputChange = evt => {
        evt.persist()
        setFormValues(currentValues => ({
            ...currentValues,
            [evt.target.name]: evt.target.value,
        }))
    }

    return (
        <>
            <SEO title="Register" />
            <section>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formValues.username}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formValues.email}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                    />
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formValues.confirmPassword}
                        onChange={handleInputChange}
                        minLength={8}
                    />
                    <Button type="submit" block>
                        Register
                    </Button>
                </Form>
            </section>
        </>
    )
}

export default Register
