import React from 'react';
import { Auth, API } from 'aws-amplify';
import { Form, ProgressBar, Alert, Card, Spinner } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

import { S3Upload } from '../../libs/awsLib';
import LoadingButton from '../../components/LoadingButton';
import config from '../../config';

import '../../styles/Display.css';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            participant: {},
            picture: null,
            fetched: false,
            isLoading: false,
            edit_toggle: false,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level });
    setPercent = (percent) => this.setState({ percent });
    reset = async () => {
        this.setState({ fetched: false, percent: 0 })
        let display_title = "Upload a New Profile";

        if (this.props.match.params.id === "new") {
            this.setState({ purpose: "NEW", edit_toggle: true });
        } else {
            const participant = await this.fetchProfile(this.props.match.params.id);
            display_title = `${participant.first_name} ${participant.last_name}`;
            this.setState({ participant, purpose: "EDIT" }, () => console.log(this.state));
        }
        this.setState({ fetched: true, display_title} );
    }

    componentDidMount = async () => {
        this.reset();
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchProfile = async (id) => API.get("participants", `/participants/${id}`, { headers: { Authorization: `Bearer ${(await this.getToken())}` } });
    submitProfile = async (profile) => API.post("participants", "/participants", { body: profile, headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    handleChange = (event) => {
        const id = event.target.id;
        const val = event.target.value;
        this.setState((state) => ({ participant: { ...state.participant, [id]: val }}))
    }
    handleFileChange = (event) => this.setState({ picture: event.target.files[0] });
    handleEdit = () => {
        if (this.state.purpose !== "NEW") {
            this.setState((state) => state.edit_toggle = !state.edit_toggle);
        }
    }

    validateForm = () => { return true }

    handleSubmit = async (event) => {
        event.preventDefault();

        const f = this.state.picture;
        if (f === null) return
        if (f && f.size > config.MAX_ATTACHMENT_SIZE) {
            this.alert(`Please use a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`, "danger");
            return
        }
        this.setState({ isLoading: true });

        let profile = { ...this.state.participant }

        try {
            // generate participant id if new
            if (this.state.purpose === "NEW") profile.id = uuidv4();

            // generate key for s3
            const key = uuidv4();
            profile.s3_keys = this.state.purpose === "NEW" ? [ key ] : [ ...profile.s3_keys, key ];

            console.log(profile)

            // encode image and submit
            await S3Upload(this.state.picture, `${profile.id}/${key}`, this.setPercent)
            await this.submitProfile(profile)

            this.setState({ isLoading: false }, console.log("complete"));
            this.props.history.push(`/participants/${profile.id}`);
            this.reset();
        }
        catch (e) {
            this.alert(e.message, "danger");
            console.log(e);
            this.setState({ isLoading: false, percent: 0 });
        }
    }

    toBase64 = async (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.replace(/^data:.+;base64,/, ''));
        reader.onerror = error => reject(error)
    })

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
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.participant.first_name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="last_name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.participant.last_name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} type="email" value={this.state.participant.email} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="telephone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.participant.telephone} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="department">
                        <Form.Label>Department</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.participant.department} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control disabled={!this.state.edit_toggle} value={this.state.participant.role} as="select" onChange={this.handleChange}>
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