import React from 'react';
import { Auth, API } from 'aws-amplify';
import { LinkContainer } from "react-router-bootstrap";

import { Button } from 'react-bootstrap';

import '../../styles/Participants.css';

class Participants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: []
        }
    }
    componentDidMount = async () => {
        const participants = await this.getParticipants();
        console.log(participants);
        this.setState({ participants }, () => console.log(this.state));
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    getParticipants = async () => API.get("participants", "/", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    render() {
        return <div className="Participants">
            <LinkContainer to="/participants/new">
                <Button />
            </LinkContainer>
        </div>
    }

}

export default Participants;