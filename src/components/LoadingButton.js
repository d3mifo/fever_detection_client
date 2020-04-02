import React from 'react';
import { Button } from 'react-bootstrap';
import { FiRefreshCw } from 'react-icons/fi';
import '../styles/LoadingButton.css'

export default function LoadingButton({ isLoading, className = "", disabled = false, ...props }) {
    return (
        <Button className={`LoadingButton ${className}`} disabled={disabled || isLoading} {...props}>
            {isLoading && <FiRefreshCw className="spinning" />}
            {props.children}
        </Button>
    )
}