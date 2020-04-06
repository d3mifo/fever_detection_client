import React from 'react';
import { Form, Alert, ProgressBar } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

import LoadingButton from '../components/LoadingButton';
import config from '../config';
import '../styles/UploadProfile.css'
import { S3Upload } from '../libs/awsLib';

const roles = ["STAFF", "STUDENT", "CONTRACTOR", "OTHER"];

export default class UploadProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pPicture: null,
            pFirstName: "",
            pLastName: "",
            pEmail: "",
            pTel: "",
            pDepartment: "",
            pRole: "",
            percent: 0,
            isLoading: "",
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    setPercent = (num) => this.setState({ percent: num });
    validateForm = () => {
        // return (
        //     this.state.pPicture !== null &&
        //     this.state.pFirstName.length > 0 &&
        //     this.state.pLastName.length > 0 &&
        //     this.state.pEmail.length > 0 &&
        //     this.state.pTel.length > 0 &&
        //     this.state.pDepartment.length > 0 &&
        //     this.state.pRole.length > 0
        // )
        return true
    }

    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
    handleFileChange = (event) => this.setState({ pPicture: event.target.files[0] });

    handleSubmit = async (event) => {
        event.preventDefault();

        const f = this.state.pPicture;
        if (f && f.size > config.MAX_ATTACHMENT_SIZE) {
            this.alert(`Please use a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`, "danger");
            return
        }
        this.setState({ isLoading: true });

        try {
            const id = uuidv4();
            const key = await S3Upload(this.state.pPicture, id, this.setPercent);
            console.log(key);
            // await this.createProfile({
            //     id,
            //     profile: {
            //         firstName: this.state.pFirstName,
            //         lastName: this.state.pLastName,
            //         email: this.state.pEmail,
            //         telephone: this.state.pTel,
            //         department: this.state.pDepartment,
            //         role: this.state.pRole,
            //     }
            // });
            this.props.history.push("/");
        }
        catch (e) {
            this.alert(e.message, "danger");
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    createProfile = async (profile) => API.post("participants", "/participants", { body: profile });

    render() {
        return (
            <div className="UploadProfile">
                <h2>Upload New Profile</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="pFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="pLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="pEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="pTel">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="pDepartment">
                        <Form.Label>Department</Form.Label>
                        <Form.Control value={this.state.content} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="pRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control value={this.state.content} as="select" onChange={this.handleChange}>
                            {roles.map((role) => <option key={role}>{role}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control type="file" onChange={this.handleFileChange} />
                    </Form.Group>
                    <LoadingButton className="upload-submit" block type="submit" isLoading={this.state.isLoading} disabled={!this.validateForm()}>Upload</LoadingButton>
                    <ProgressBar className="upload-progress" variant="success" animated now={this.state.percent} />
                </Form>
            </div>
        )
    }
}