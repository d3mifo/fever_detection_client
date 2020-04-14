import React from 'react';
import { Auth, API } from 'aws-amplify';
import { Form, ProgressBar, Alert, Card, Spinner } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

import { S3Upload } from '../../libs/awsLib';
import { v4 as uuidv4 } from 'uuid';

import LoadingButton from '../../components/LoadingButton';
import config from '../../config';

import '../../styles/Display.css';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            purpose: "",
            id: "",
            picture: null,
            display_title: "",
            first_name: "",
            last_name: "",
            email: "",
            telephone: "",
            department: "",
            role: "",
            percent: 0,
            fetched: false,
            isLoading: false,
            edit_toggle: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level });
    setPercent = (num) => this.setState({ percent: num });
    reset = async () => {
        this.setState({ fetched: false })
        let participant = {};
        let display_title = "Upload a New Profile";
        if (this.props.match.params.id === "new") {
            this.setState({ purpose: "NEW", edit_toggle: true });
        } else {
            participant = await this.fetchProfile(this.props.match.params.id);
            display_title = `${participant.first_name} ${participant.last_name}`;
            this.setState({ ...participant, purpose: "EDIT" });
        }
        this.setState({ fetched: true, display_title}, () => console.log(this.state));
    }

    componentDidMount = async () => {
        this.reset();
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchProfile = async (id) => API.get("participants", `/participants/${id}`, { headers: { Authorization: `Bearer ${(await this.getToken())}` } });
    submitProfile = async (profile) => API.post("participants", "/participants", { body: profile, headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
    handleFileChange = (event) => this.setState({ picture: event.target.files[0] });
    validateForm = () => { return true }

    handleSubmit = async (event) => {
        event.preventDefault();

        const f = this.state.picture;
        if (f && f.size > config.MAX_ATTACHMENT_SIZE) {
            this.alert(`Please use a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`, "danger");
            return
        }
        this.setState({ isLoading: true });

        try {
            const id = this.state.purpose === "NEW" ? uuidv4() : this.state.id;
            let suffix = uuidv4();
            const key = `${id}/${suffix}`;
            const s3_keys = this.state.purpose === "NEW" ? [ key ] : [ ...this.state.s3_keys, key ];

            await S3Upload(this.state.picture, id, this.setPercent);
            const profile = {
                id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                telephone: this.state.telephone,
                department: this.state.department,
                role: this.state.role,
                s3_keys: s3_keys
            };
            await this.submitProfile(profile);
            this.setState({ isLoading: false, percent: 0});
            this.props.history.push(`/participants/${id}`);
        }
        catch (e) {
            this.alert(e.message, "danger");
            this.setState({ isLoading: false, percent: 0 });
        }
    }

    handleEdit = () => {
        if (this.state.purpose !== "NEW") {
            this.setState((state) => state.edit_toggle = !state.edit_toggle);
        }
    }

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