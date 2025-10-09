import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row className="mb-3">
          <Col md={4}>
            <h5>Biopara</h5>
            <p>Produits pharmaceutiques et parapharmaceutiques de qualité.</p>
          </Col>
          <Col md={4}>
            <h5>Liens rapides</h5>
            <ul className="list-unstyled">
              <li>Accueil</li>
              <li>Produits</li>
              <li>Contact</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>Email: contact@biopara.tn</p>
            <p>Téléphone: +216 12345678</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            © 2025 Biopara. Tous droits réservés.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
