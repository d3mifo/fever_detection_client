import React from 'react';
import { Auth } from 'aws-amplify';

import LoadingButton from './LoadingButton';
import '../styles/Signup.css';
import { Form, Alert } from 'react-bootstrap';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            isLoading: false,
            newUser: null,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        };
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    validateForm = () => this.state.email.length > 0 && this.state.password.length > 0 && this.state.password === this.state.confirmPassword;
    validateConfirmForm = () => this.state.confirmationCode.length > 0;
    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            const newUser = await Auth.signUp({ username: this.state.email, password: this.state.password });
            this.setState({ newUser })

        }
        catch(e) {
            this.alert(e.message, "danger");
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    handleConfirm = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch(e) { this.alert(e.message, "danger") }
        finally { this.setState({ isLoading: false })}
    }

    renderConfirmationForm = () => {
        return (
            <Form onSubmit={this.handleConfirm}>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control autoFocus type="tel" value={this.state.confirmationCode} onChange={this.handleChange} />
                    <Form.Text className="text-muted">
                        Please check your email ({this.state.email}) for the confirmation code.
                        </Form.Text>
                </Form.Group>
                <LoadingButton block type="submit" isLoading={this.state.isLoading} disabled={!this.validateConfirmForm()}>Confirm</LoadingButton>
            </Form>
        )
    }

    renderSignupForm = () => {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoFocus type="email" value={this.state.email} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={this.state.password} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" value={this.state.confirmPassword} onChange={this.handleChange} />
                </Form.Group>
                <LoadingButton block type="submit" isLoading={this.state.isLoading} disabled={!this.validateForm()}>Submit</LoadingButton>
            </Form>
        )
    }

    render() {
        return (
            <div className="Signup">
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                { this.state.newUser === null ? this.renderSignupForm() : this.renderConfirmationForm()}
            </div>
        )
    }
}