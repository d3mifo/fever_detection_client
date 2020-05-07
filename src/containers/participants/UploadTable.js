import React from 'react';
import { Alert, Table, Form, ProgressBar } from 'react-bootstrap';
import { Auth, API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

import '../../styles/UploadTable.css'
import LoadingButton from '../../components/LoadingButton';
import config from '../../config';
import { S3Upload } from '../../libs/awsLib';


export default class UploadTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            isLoading: false,
            isFetching: false,
            percent: 0,
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    componentDidMount = async () => {
        this.setState({ isFetching: true });
        const users = await this.fetchUsers();
        const participants = await this.fetchParticipants();
        let profiles = [];
        for (let user of users) {
            const attr = user.Attributes;
            profiles.push({
                id: user.Username,
                first_name: this.getVal(attr, "given_name"),
                last_name: this.getVal(attr, "family_name"),
                email: this.getVal(attr, "email"),
                telephone: this.getVal(attr, "phone_number"),
                department: this.getVal(attr, "custom:department"),
                role: this.getVal(attr, "custom:role"),
                status: participants.some((p) => p.id === user.Username)
            })
        }
        this.setState({ profiles, isFetching: false });
    }

    getVal = (arr, name) => arr.find(obj => obj.Name === name).Value
    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level })
    setPercent = (percent) => this.setState({ percent });

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchUsers = async () => API.get("participants", "/users", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });
    fetchParticipants = async () => API.get("participants", "/participants", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });    
    submitProfile = async (profile) => API.post("participants", "/participants", { body: profile, headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    checkDisabled = () => this.state.profiles.filter((profile) => "picture" in profile).length === 0;

    handleChange = (event) => this.setState({ [event.target.id]: event.target.value });
    handleFileChange = (id, file) => {
        // create temp holder for this.state.profiles
        let profiles = this.state.profiles;
        // find selected profile in array
        let p = profiles.find((profile) => profile.id === id);
        p.picture = file;
        // remove profile from profiles array
        profiles = profiles.filter((profile) => profile.id !== id);
        // add updated profile back to array
        profiles.push(p);
        this.setState({ profiles });
    }
    handleSubmit = async (event) => {
        event.preventDefault();

        // Filter submissions to only those with pictures uploaded
        const profiles = this.state.profiles.filter((p) => p.picture);
        if (profiles.length === 0) return
        // Check that all picture sizes are below the cutoff
        const oversize = profiles.filter((p) => p.picture.size > config.MAX_ATTACHMENT_SIZE)
        if (oversize === []) {
            this.alert(`Files must be smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB`, "danger");
            return
        }

        try {
            for (let profile of profiles) {
                const key = uuidv4();
                profile.s3_keys = [ key ];
                await S3Upload(profile.picture, `${profile.id}/${key}`, this.setPercent)
                delete profile.picture
                await this.submitProfile(profile)
            }

            this.props.history.push('/participants')
        }
        catch (e) {
            this.alert(e.message, "danger");
            console.log(e);
            this.setState({ isLoading: false, percent: 0 });
        }
    }

    renderTable = () => {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Table bordered responsive size="sm">
                    <thead><tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Upload</th>
                    </tr></thead>
                    <tbody>
                        {this.state.profiles.map((p) =>
                            <tr key={p.id} className={p.status ? "known" : null}>
                                <td>{p.id}</td>
                                <td>{p.first_name}</td>
                                <td>{p.last_name}</td>
                                <td>{p.department}</td>
                                <td>{p.role}</td>
                                <td>
                                    <Form.Control disabled={p.status} type="file" onChange={(e) => { this.handleFileChange(p.id, e.target.files[0]) }} />
                                </td>
                            </tr>
                        )}
                    </tbody>

                </Table>
                <LoadingButton className="upload-submit" block type="submit" isLoading={this.state.isLoading} disabled={this.checkDisabled()}>Submit</LoadingButton>
                <ProgressBar className="upload-progress" variant="success" animated now={this.state.percent} />
            </Form>
        )
    }

    render() {
        return (
            <div className="UploadTable">
                <h2>Add Participants</h2>
                {
                    this.state.alertVisible
                        ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                            {this.state.alertContent}
                        </Alert>
                        : null
                }
                {this.renderTable()}
            </div>
        )
    }
}