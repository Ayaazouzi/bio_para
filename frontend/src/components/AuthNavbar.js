import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function AuthNavbar() {
  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/images/logo.png" alt="Biopara" width="140" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="auth-nav" />
        <Navbar.Collapse id="auth-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
            <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
