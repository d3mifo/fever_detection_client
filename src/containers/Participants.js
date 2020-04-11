import React from 'react';
import { Auth, API } from 'aws-amplify';

class Participants extends React.Component {
    componentDidMount = async () => {
        const participants = await this.getParticipants();
        console.log(participants);
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    getParticipants = async () => API.get("participants", "/", { headers: { Authorization: `Bearer ${(await this.getToken())}` }});

    render() {
        return <div className="Participants">
            
        </div>
    }

}

export default Participants;