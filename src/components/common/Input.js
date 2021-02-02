import styled from "styled-components"

const Input = styled.input`
    display: block;
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: none;

    &:not(:last-child) {
        margin-bottom: 8px;
    }

    &:focus,
    &:active {
        outline: none;
        border: 1px solid rebeccapurple;
    }
`

export default Input
