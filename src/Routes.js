import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Home from './containers/Home';
import Login from './containers/Login';
import ResetPassword from './containers/ResetPassword';
import Settings from './containers/Settings'
import NotFound from './components/NotFound';
import ChangePassword from './containers/ChangePassword';
import ChangeEmail from './containers/ChangeEmail';
import Signup from './containers/Signup';
import UploadProfile from './containers/UploadProfile';

export default ({ childProps }) =>
    <Switch>
        <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
        <AuthenticatedRoute path="/settings" exact component={Settings} props={childProps} />
        <AuthenticatedRoute path="/settings/password" exact component={ChangePassword} props={childProps} />
        <AuthenticatedRoute path="/settings/email" exact component={ChangeEmail} props={childProps} />
        <AuthenticatedRoute path="/upload" exact component={UploadProfile} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <Route component={NotFound} />
    </Switch>