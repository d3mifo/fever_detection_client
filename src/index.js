import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

import './styles/index.css';
import App from './containers/App';
import config from './config';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: config.s3.REGION,
        bucket: config.s3.BUCKET,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: "participants",
                endpoint: config.apiGateway.participants.URL,
                region: config.apiGateway.participants.REGION
            },
            {
                name: "results",
                endpoint: config.apiGateway.results.URL,
                region: config.apiGateway.results.REGION
            }
        ]
    }
})

Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: config.iot.REGION,
        aws_pubsub_endpoint: config.iot.ENDPOINT
    })
)

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();