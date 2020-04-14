import React from 'react';
import '../styles/Dashboard.css';

import { Auth, API } from 'aws-amplify';

class Dashboard extends React.Component {

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    getParticipants = async () => API.get("participants", "/", { headers: { Authorization: `Bearer ${(await this.getToken())}` }});

    render() {
        return (
            <div className="Dashboard">
                <div className="lander">
                    <h1>Dashboard</h1>

                </div>
            </div>

        );
    }
}

export default Dashboard;