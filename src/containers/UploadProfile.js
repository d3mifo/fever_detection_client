import React from 'react';
import { Form, Alert } from 'react-bootstrap';

import LoadingButton from '../components/LoadingButton';
import config from '../config';
import '../styles/UploadProfile.css'

export default class UploadProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            content: "",
            isLoading: "",
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    validateForm = () => this.state.content.length > 0;
    
    handleFileChange = (event) => this.setState({ file: event.target.files[0]});
    handleSubmit = async (event) => {
        event.preventDefault();

        const f = this.state.file;
        if ( f && f.size > config.MAX_ATTACHMENT_SIZE) {
            this.alert(`Please a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB`, "danger");
            return
        }
        this.setState({ isLoading: true });
    }


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
                <Form.Group controlId="content">
                        <Form.Control value={this.state.content} componentClass="textarea" onChange={e => this.setState({ content: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Attachment</Form.Label>
                        <Form.Control type="file" onChange={this.handleFileChange} />
                    </Form.Group>
                    <LoadingButton block type="submit" isLoading={this.state.isLoading} disabled={!this.validateForm()}>Upload</LoadingButton>
                </Form>
            </div>
        )
    }
}