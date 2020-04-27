import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Dashboard from './containers/Dashboard';
import Login from './containers/auth/Login';
import ResetPassword from './containers/auth/ResetPassword';
import Settings from './containers/settings/Settings'
import NotFound from './components/NotFound';
import ChangePassword from './containers/settings/ChangePassword';
import ChangeEmail from './containers/settings/ChangeEmail';
import Signup from './containers/auth/Signup';
import Participants from './containers/participants/Participants';
import Display from './containers/participants/Display';
import UploadTable from './containers/participants/UploadTable';

export default ({ childProps }) =>
    <Switch>
        <AuthenticatedRoute path="/" exact component={Dashboard} props={childProps} />
        <AuthenticatedRoute path="/settings" exact component={Settings} props={childProps} />
        <AuthenticatedRoute path="/settings/password" exact component={ChangePassword} props={childProps} />
        <AuthenticatedRoute path="/settings/email" exact component={ChangeEmail} props={childProps} />
        <AuthenticatedRoute path="/participants" exact component={Participants} props={childProps} />
        <AuthenticatedRoute path="/participants/upload" exact component={UploadTable} props={childProps} />
        <AuthenticatedRoute path="/participants/:id" exact component={Display} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <Route component={NotFound} />
    </Switch>