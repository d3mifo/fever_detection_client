import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import Routes from '../Routes';


import '../styles/App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isAuthenticated: false }
    }

    userHasAuthenticated = (bool) => {
        this.setState({ isAuthenticated: bool })
    }

    handleLogout = () => {
        this.userHasAuthenticated(false);
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        }
        return (
            <div className="App container">
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="light" variant="light">
                    <Navbar.Brand><Link to="/">React-Bootstrap</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#features">X</Nav.Link>
                            <Nav.Link href="#pricing">Y</Nav.Link>
                            <NavDropdown title="zDrop" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        {
                            this.state.isAuthenticated
                                ? <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                                : <Nav>
                                    <LinkContainer to="/signup">
                                        <Nav.Link>Signup</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Login</Nav.Link>
                                    </LinkContainer>
                                </Nav>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default App;
