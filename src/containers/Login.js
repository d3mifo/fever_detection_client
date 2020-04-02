import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import { Auth } from 'aws-amplify'
import { Link } from 'react-router-dom';

import '../styles/Login.css'
import LoadingButton from '../components/LoadingButton';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoading: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e.message, alertLevel: level })

    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });
        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            this.props.history.push("/")
        } catch (e) {
            this.alert(e, "danger")
        } finally {
            this.setState({ isLoading: false })
        }
    }

    render() {
        return (
            <div className="Login">
                <h2>Login</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control autoFocus type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </Form.Group>
                    <Link to="login/reset">Forgot Password</Link>
                    <LoadingButton block size="large" type="submit" isLoading={this.state.isLoading} disabled={!this.validateForm()}>Login</LoadingButton>
                </Form>
            </div>
        )
    }
}