import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import '../styles/NotFound.css'

export default function NotFound() {
    return (
        <div className="NotFound">
            <Jumbotron>
                <h3>Sorry, page <strong>not</strong> found!</h3>
            </Jumbotron>
        </div>
    )
}