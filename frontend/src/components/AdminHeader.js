// src/components/AdminHeader.js
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminHeader() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard">
          🛒 Admin Panel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">

            {/* Accueil Dashboard */}
            <Nav.Link as={Link} to="/admin/dashboard">
              Dashboard
            </Nav.Link>

            {/* Produits Admin */}
            <Nav.Link as={Link} to="/admin/products">
              Produits
            </Nav.Link>

            {/* Tu pourras ajouter d'autres pages ici */}
            {/* <Nav.Link as={Link} to="/admin/categories">Catégories</Nav.Link> */}

          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/">
              Retour au site
            </Nav.Link>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminHeader;
