import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';

export default ({ childProps }) =>
    <Switch>
        <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <Route component={NotFound} />
    </Switch>