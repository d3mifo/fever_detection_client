import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import LoadingButton from '../../components/LoadingButton';
import '../../styles/Settings.css';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="Settings">
                <h2>Settings</h2>
                <LinkContainer to="/settings/email">
                    <LoadingButton block>Change Email</LoadingButton>
                </LinkContainer>
                <LinkContainer to="/settings/password">
                    <LoadingButton block>Change Password</LoadingButton>
                </LinkContainer>
            </div>
        )
    }
}