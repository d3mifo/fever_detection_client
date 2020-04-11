import React from 'react';
import '../styles/Home.css';

import { Auth, API } from 'aws-amplify';

class Home extends React.Component {

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    getParticipants = async () => API.get("participants", "/", { headers: { Authorization: `Bearer ${(await this.getToken())}` }});

    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Dashboard</h1>
                </div>
            </div>

        );
    }
}

export default Home;