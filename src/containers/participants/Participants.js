import React from 'react';
import { Auth, API } from 'aws-amplify';
import { Card, CardDeck, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import profile from '../../images/profile.jpeg'
import '../../styles/Participants.css';
import { LinkContainer } from 'react-router-bootstrap';

class Participants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            isLoading: false
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const participants = await this.fetchParticipants();
        this.setState({ participants, isLoading: false });
    }

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchParticipants = async () => API.get("participants", "/participants", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    renderCards() {
        return (
            this.state.participants.map((p) =>
                <LinkContainer key={p.id} to={`/participants/${p.id}`}>
                    <Card>
                        <Card.Img variant="top" src={profile} />
                        <Card.Body>
                            <Card.Title className="name">{`${p.first_name} ${p.last_name}`}</Card.Title>
                            <Card.Subtitle>{`${p.role}`}</Card.Subtitle>
                        </Card.Body>
                    </Card>
                </LinkContainer>
            )
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
        return <div className="Participants">
            <CardDeck className="deck">
                <LinkContainer to="/participants/new" purpose="new">
                    <Card className="add">
                        <div className="placeholder">
                            <FaPlus />
                        </div>
                    </Card>
                </LinkContainer>
                {this.state.isLoading ? this.renderLoading() : this.renderCards()}
            </CardDeck >
        </div>
    }

}

export default Participants;