import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Auth } from 'aws-amplify'

import '../styles/Login.css'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "" }
    }

    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
        } catch(e) {
            alert(e.message)
        }
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control autoFocus type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </Form.Group>
                    <Button block size="large" disabled={!this.validateForm()} type="submit">Login</Button>
                </Form>
            </div>
        )
    }
}