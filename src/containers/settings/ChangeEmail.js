import React from 'react';
import { Auth } from 'aws-amplify';

import LoadingButton from '../../components/LoadingButton';
import '../../styles/ChangeEmail.css';
import { Form, Alert } from 'react-bootstrap';

export default class ChangeEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            email: "",
            codeSent: false,
            isConfirming: false,
            isSendingCode: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        };
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    validateEmailForm = () => this.state.email.length > 0;
    validateConfirmForm = () => this.state.code.length > 0;
    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });

    handleUpdate = async (event) => {
        event.preventDefault();
        this.setState({ isSendingCode: true });
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentUser, { email: this.state.email });
            this.setState({ codeSent: true });
        }
        catch (e) {
            this.alert(e.message, "danger");
        }
        finally {
            this.setState({ isSendingCode: false });
        }
    }

    handleConfirm = async (event) => {
        event.preventDefault();
        this.setState({ isConfirming: true });
        try {
            await Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);
            this.props.history.push("/settings");
        }
        catch (e) {
            this.alert(e.message, "danger");
            this.setState({ isConfirming: false });
        }
    }

    rednerUpdateForm() {
        return (
            <Form onSubmit={this.handleUpdate}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoFocus type="email" value={this.state.email} onChange={this.handleChange} />
                </Form.Group>
                <LoadingButton block type="submit" isLoading={this.state.isSendingCode} disabled={!this.validateEmailForm()}>Update Email</LoadingButton>
            </Form>
        )
    }

    renderConfirmationForm() {
        return (
            <Form onSubmit={this.handleConfirm}>
                    <Form.Group controlId="code">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control autoFocus type="tel" value={this.state.code} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Please check your email ({this.state.email}) for the confirmation code.
                        </Form.Text>
                    </Form.Group>
                    <LoadingButton block type="submit" isLoading={this.state.isConfirming} disabled={!this.validateConfirmForm()}>Confirm</LoadingButton>
                </Form>
        )
    }

    render() {
        return (
            <div className="ChangeEmail">
                <h2>Change User Email</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                {
                    !this.state.codeSent
                        ? this.rednerUpdateForm()
                        : this.renderConfirmationForm()
                }

            </div>
        )
    }
}