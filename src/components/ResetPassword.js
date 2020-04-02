import React from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';

import LoadingButton from './LoadingButton';
import '../styles/ResetPassword.css';
import { Form, Alert } from 'react-bootstrap';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            email: "",
            codeSent: false,
            confirmed: false,
            confirmPassword: "",
            password: "",
            isConfirming: false,
            isSendingCode: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        };
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })

    validateCodeForm = () => this.state.email.length > 0;
    validateResetForm = () => this.state.code.length > 0 && this.state.password.length > 0 && this.state.password === this.state.confirmPassword;

    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });

    handleSendCode = async (event) => {
        event.preventDefault();
        this.setState({ isSendingCode: true });

        try {
            await Auth.forgotPassword(this.state.email);
            this.setState({ codeSent: true });
        }
        catch (e) {
            this.alert(e.message, "danger")
        }
        finally {this.setState({ isSendingCode: false })}
    }

    handleConfirm = async (event) => {
        event.preventDefault();
        this.setState({ isConfirming: true });
        try {
            await Auth.forgotPasswordSubmit(this.state.email, this.state.code, this.state.password);
            this.setState({ confirmed: true });
        }
        catch (e) {
            this.alert(e.message, "danger");
        }
        finally {
            this.setState({ isConfirming: false });
        }
    }

    renderRequestCodeForm() {
        return (
            <Form onSubmit={this.handleSendCode}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoFocus type="email" value={this.state.email} onChange={this.handleChange} />
                </Form.Group>
                <LoadingButton block type="submit" isLoading={this.state.isSendingCode} disabled={!this.validateCodeForm()}>Send Confirmation</LoadingButton>
            </Form>
        )
    }

    renderConfirmationForm() {
        return (
            <Form onSubmit={this.handleConfirm}>
                <Form.Group controlId="code">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control autoFocus type="tel" value={this.state.code} onChange={this.handleChange} />
                    <Form.Text className="text-muted">Please check your email ({this.state.email}) for the confirmation code</Form.Text>
                </Form.Group>
                <hr />
                <Form.Group controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={this.state.password} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" value={this.state.confirmPassword} onChange={this.handleChange} />
                </Form.Group>
                <LoadingButton block type="submit" size="lg" isLoading={this.state.isConfirming} disabled={!this.validateResetForm()}>Confirm</LoadingButton>
            </Form>
        )
    }

    renderSuccessMessage() {
        return (
            <div className="success">
                <FaThumbsUp />
                <p>Your password has been reset</p>
                <p>
                    <Link to="/login">
                        Click here to login with your new credentials.
                    </Link>
                </p>

            </div>
        )
    }

    render() {
        return (
            <div className="ResetPassword">
                <h2>Reset Password</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                {!this.state.codeSent
                    ? this.renderRequestCodeForm()
                    : !this.state.confirmed
                        ? this.renderConfirmationForm()
                        : this.renderSuccessMessage()
                }
            </div>
        )
    }
}