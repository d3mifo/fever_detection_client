import React from 'react';
import { Auth, API, Storage } from 'aws-amplify';
import { Card, CardDeck, Spinner } from 'react-bootstrap';
import { FaPlus, FaRegAddressBook } from 'react-icons/fa';

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
        for (let p of participants) {
            const key = `${p.id}/${p.s3_keys[0]}`;
            try { p.picture = await this.fetchPictureURL(key); }
            catch (e) { p.picture = null }
        }

        this.setState({ participants, isLoading: false });
    }

    handleRemove = async (id) => {
        let participants = this.state.participants;
        const profile = participants.find((p) => p.id === id);
        delete profile.picture
        participants = participants.filter((p) => p.id !== id);
        this.setState({ participants });
        await this.deleteParticipant(profile);
    }

    fetchPictureURL = async (key) => Storage.get(key, { customPrefix: { public: '' }, headers: { Authorization: `Bearer ${(await this.getToken())}` } })

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchParticipants = async () => API.get("participants", "/participants", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });
    deleteParticipant = async (profile) => API.del("participants", `/participants/${profile.id}`, { body: { ...profile }, headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    renderCards() {
        return (
            this.state.participants.map((p) =>
                <div key={p.id} className="profile-holder">
                    <LinkContainer to={`/participants/${p.id}`}>
                        <Card>
                            <Card.Img variant="top" src={p.picture} />
                            <Card.Body>
                                <Card.Title className="name">{`${p.first_name} ${p.last_name}`}</Card.Title>
                                <Card.Subtitle>{`${p.role}`}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </LinkContainer>
                    <button className="delete" onClick={() => this.handleRemove(p.id)}><span>&#10008;</span></button>
                </div>
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
                <LinkContainer to="/participants/upload" purpose="new">
                    <Card className="add">
                        <div className="placeholder">
                            <FaRegAddressBook />
                        </div>
                    </Card>
                </LinkContainer>
                {this.state.isLoading ? this.renderLoading() : this.renderCards()}
            </CardDeck >
        </div>
    }

}

export default Participants;