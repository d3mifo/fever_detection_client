import React from 'react';
import { Auth, API } from 'aws-amplify';
import { Form, ProgressBar, Alert, Card, Spinner } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

import LoadingButton from '../../components/LoadingButton';
import config from '../../config';

import '../../styles/Display.css';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pPicture: null,
            display_title: "",
            first_name: "",
            last_name: "",
            email: "",
            telephone: "",
            department: "",
            role: "",
            fetched: false,
            edit_toggle: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })

    componentDidMount = async () => {
        this.setState({ fetched: false })
        const id = this.props.match.params.id;
        let participant = {};
        let display_title = "";
        if (id === "new") {
            display_title = "Upload a New Profile";
            this.setState({ edit_toggle: true });
        }
        else {
            participant = await this.fetchProfile(this.props.match.params.id);
            display_title = `${participant.first_name} ${participant.last_name}`;
            this.setState({ ...participant });
        }
        this.setState({ fetched: true, display_title}, () => console.log(this.state));
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchProfile = async (id) => API.get("participants", `/participants/${id}`, { headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    handleSubmit = () => { }
    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
    handleEdit = () => this.setState((state) => state.edit_toggle = !state.edit_toggle);
    validateForm = () => { return true }

    renderProfile = () => {
        return (
            <div className="profile">
                <h2>
                    {this.state.display_title}
                    <FaEdit className="edit-icon" onClick={this.handleEdit} />
                </h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="first_name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.first_name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="last_name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.last_name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} type="email" value={this.state.email} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="telephone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.telephone} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="department">
                        <Form.Label>Department</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.department} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.role} as="select" onChange={this.handleChange}>
                            {config.roles.map((role) => <option key={role}>{role}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} type="file" onChange={this.handleFileChange} />
                    </Form.Group>
                    <LoadingButton className="upload-submit" block type="submit" isLoading={this.state.isLoading} disabled={!this.validateForm()}>Submit</LoadingButton>
                    <ProgressBar className="upload-progress" variant="success" animated now={this.state.percent} />
                </Form>
            </div>
        )
    }

    renderLoading = () => {
        return (
            <Card className="add">
                <div className="placeholder">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            </Card>
        )
    }

    render() {
        return (
            <div className="Display">
                {!this.state.fetched ? this.renderLoading() : this.renderProfile()}
            </div>
        )
    }

}

export default Display;