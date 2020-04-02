import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import '../styles/App.css';

class App extends React.Component {
    render() {
        return (
            // <div className="App container">
            <Container>
                <Navbar fixed="top" bg="light" expand="lg">
                    <Navbar.Brand>
                        <Link to="/">Dashboard</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse title="Dropdown"></Navbar.Collapse>
                </Navbar>
            {/* </div> */}
            </Container>
        );
    }
}

export default App;
