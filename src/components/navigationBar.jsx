import React from "react";
import { Container, Navbar, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import '../styles/navigationBar.scss';

const NavigationBar = () => {

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Em breve!
        </Tooltip>
    );

    return (
        <Navbar className="navbar" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Climora</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <OverlayTrigger
                        placement="bottom"
                        overlay={renderTooltip}
                    >
                        <Button variant="outline-secondary">Baixe o app</Button>
                    </OverlayTrigger>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;