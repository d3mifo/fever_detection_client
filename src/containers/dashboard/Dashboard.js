import React from 'react';
import { Auth, Storage, PubSub, API } from 'aws-amplify';
import { Alert, Button, Accordion, Card } from 'react-bootstrap';

import config from '../../config';
import '../../styles/Dashboard.css';
import userIcon from '../../images/users.svg';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            alertVisible: false,
            alertLevel: "",
            alertContent: ""
        }
    }

    componentDidMount = async () => {
        const stored = await this.fetchResults();
        if (stored !== []) {
            let results = [];
            for (let item of stored) {
                results = await this.manageResults(results, item)
            }
            this.setState({ results: this.sortArray(results) });
        }
        PubSub.subscribe(config.iot.TOPIC).subscribe({
            next: this.handleIoTMessage,
            error: this.handleIoTError,
            close: this.handleIoTClose
        });
    }

    alert = (e, level) => this.setState({ alertVisible: true, alertContent: e, alertLevel: level });
    sortArray = (arr) => {
        const sorted = arr.sort((a, b) => {
            if (a.latest.createdAt < b.latest.createdAt) return 1
            else if (a.latest.createdAt > b.latest.createdAt) return -1
            else return 0
        })
        return sorted;
    }

    manageResults = async (results, message) => {
        if (message.hasOwnProperty("rekognition")) {        // valid message from step functions workflow
            if (message.rekognition.status === "KNOWN") {   // known participant
                const key = `${message.participant.id}/${message.participant.s3_keys[0]}`;
                const picture = await this.fetchPictureURL(key);
                let response = await fetch(picture);
                if (response.status === 200) {
                    message.status = "VALID";
                    message.participant.picture = picture;
                }
                else {
                    message.status = "ANONYMOUS";
                    message.participant = {}
                    message.participant.picture = userIcon;
                }
            } else {
                message.status = "ANONYMOUS"
                message.participant = {}
                message.participant.picture = userIcon;
            }
            results.push(message);
        }
        return results;
    }

    handleIoTMessage = async (data) => {
        console.log(data.value.message);
        let results = this.state.results;
        let message = data.value.message;
        const mResults = await this.manageResults(results, message);
        this.setState({ results: this.sortArray(mResults) });
    }
    handleIoTError = async (error) => this.alert(error.message, "danger");
    handleIoTClose = async () => console.log("done")

    getToken = async () => (await Auth.currentSession()).getIdToken().getJwtToken();
    fetchPictureURL = async (key) => Storage.get(key, { customPrefix: { public: '' }, headers: { Authorization: `Bearer ${(await this.getToken())}` } })
    fetchResults = async () => API.get("results", "/results", { headers: { Authorization: `Bearer ${(await this.getToken())}` } });

    renderDataDiv = (title, data) => (
        <div>
            <table><tbody><tr>
                <td className="title"><strong>{title}:</strong></td>
                <td>{data}</td>
            </tr></tbody></table>
        </div>
    )

    renderListItem = (title, items) => {
        return (
            <div className={`${title} nested`}>
                <h6 className="title">{title}</h6>
                <ol className="name-value">
                    {items.map((item, index) => 
                        <li key={index}>
                            <label htmlFor={item.Key}>{item.Key}</label>
                            <span id={item.Key}>{item.Value}</span>
                        </li>
                    )}
                </ol>
            </div>
        )
    }

    renderAccordionHeader = (result, index) => {
        const classExtra = result.participant.picture.charAt(0) === "/" ? "icon" : "";
        return (
            <Accordion.Toggle className="acc-header" as={Card.Header} eventKey={index.toString()}>
                <div className="priority">
                    <Button
                        variant={
                            result.risk.level === "LOW" ? "info" :
                            result.risk.level === "MEDIUM" ? "warning" :
                            result.risk.level === "HIGH" ? "danger" : "dark"
                        }
                        disabled={true}
                    >
                        {result.risk.level === undefined ? "?" : result.risk.level}
                    </Button>
                </div>
                <div className="profile">
                    <img className={`profile-img ${classExtra}`} alt="profile" src={result.participant.picture} />
                </div>
                <div className="data">
                    {this.renderDataDiv("Timestamp", new Date(result.latest.createdAt * 1000).toGMTString())}
                    {this.renderDataDiv("Temperature", result.latest.temperature)}
                    {this.renderDataDiv("Participant", result.participant.id)}
                    {this.renderDataDiv("Sensor", result.latest.sensor_id)}
                </div>
            </Accordion.Toggle>
        )
    }

    renderAccordion = () => {
        return (
            <Accordion>
                {this.state.results.map((result, index) => 
                    <Card key={index}>
                        {this.renderAccordionHeader(result, index)}
                        {result.status === "ANONYMOUS" ? null :
                            <Accordion.Collapse eventKey={index.toString()}>
                                <Card.Body className="content">
                                    {this.renderListItem("Participant", [
                                        { Key: "First Name", Value: result.participant.first_name },
                                        { Key: "Last Name", Value: result.participant.last_name },
                                        { Key: "Email", Value: result.participant.email },
                                        { Key: "Telephone", Value: result.participant.telephone },
                                        { Key: "Department", Value: result.participant.department },
                                        { Key: "Role", Value: result.participant.role }
                                    ])}
                                    {this.renderListItem("Rekognition", [
                                        { Key: "Status", Value: result.rekognition.status },
                                        { Key: "Similarity", Value: result.rekognition.similarity },
                                        { Key: "Face Id", Value: result.rekognition.faceId },
                                        { Key: "Image Id", Value: result.rekognition.imageId }
                                    ])}
                                    {this.renderListItem("Detection", [
                                        { Key: "Message", Value: result.risk.message },
                                        { Key: "Average", Value: result.risk.average },
                                        { Key: "Std Dev", Value: result.risk.standardDeviation },
                                        { Key: "History", Value: result.risk.totalItems }
                                    ])}
                                </Card.Body>
                            </Accordion.Collapse>
                        }
                    </Card>
                )}
            </Accordion>
        )
    }

    render() {
        return (
            <div className="Dashboard">
                <div className="lander">
                    <h1>Dashboard</h1>
                    {
                        this.state.alertVisible
                            ? <Alert dismissible variant={this.state.alertLevel} onClose={() => this.setState({ alertVisible: false })}>
                                {this.state.alertContent}
                            </Alert>
                            : null
                    }
                    {this.renderAccordion()}
                </div>
            </div>

        );
    }
}

export default Dashboard;