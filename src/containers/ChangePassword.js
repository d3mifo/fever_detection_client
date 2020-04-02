import React from 'react';
import { Auth } from 'aws-amplify';

import LoadingButton from '../components/LoadingButton';
import '../styles/ChangePassword.css';
import { Form, Alert } from 'react-bootstrap';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            oldPassword: "",
            confirmPassword: "",
            isChanging: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        };
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    validateForm = () => this.state.oldPassword.length > 0 && this.state.password.length > 0 && this.state.password === this.state.confirmPassword;
    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });

    handleConfirm = async (event) => {
        event.preventDefault();
        this.setState({ isChanging: true });
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(currentUser, this.state.oldPassword, this.state.password);
            this.props.history.push("/settings");
        }
        catch (e) {
            this.alert(e.message, "danger");
        }
        finally {
            this.setState({ isChanging: false });
        }
    }

    render() {
        return (
            <div className="ChangePassword">
                <h2>Change Password</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                <Form onSubmit={this.handleConfirm}>
                    <Form.Group controlId="oldPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control autoFocus type="password" value={this.state.oldPassword} onChange={this.handleChange} />
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
                    <LoadingButton block type="submit" isLoading={this.state.isChanging} disabled={!this.validateForm()}>Confirm</LoadingButton>
                </Form>
            </div>
        )
    }
}