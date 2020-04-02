import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Home from './components/Home';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import Settings from './components/Settings'
import NotFound from './components/NotFound';
import ChangePassword from './components/ChangePassword';
import ChangeEmail from './components/ChangeEmail';
import Signup from './components/Signup';

export default ({ childProps }) =>
    <Switch>
        <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
        <AuthenticatedRoute path="/settings" exact component={Settings} props={childProps} />
        <AuthenticatedRoute path="/settings/password" exact component={ChangePassword} props={childProps} />
        <AuthenticatedRoute path="/settings/email" exact component={ChangeEmail} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <Route component={NotFound} />
    </Switch>