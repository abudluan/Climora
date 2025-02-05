import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import '../styles/navigationBar.scss';
import { FaGithub } from "react-icons/fa";

const NavigationBar = () => {

    return (
        <Navbar className="navbar" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Climora</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    <Button href="https://github.com/abudluan/Climora" target="_blank" variant="dark"><FaGithub className="icon" size='20' /> GitHub</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;