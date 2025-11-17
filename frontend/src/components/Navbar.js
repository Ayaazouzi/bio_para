import { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap'; // Badge retiré
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Assure-toi que le chemin correspond à ton projet

function MyNavbar() {
  const [scrolled, setScrolled] = useState(false);

  // Détecte le scroll pour ajouter une classe "scrolled"
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      sticky="top" 
      className={`navbar-custom shadow-sm ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/images/logo.png" alt="Biopara" width="140" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/Home">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/products">Produits</Nav.Link>
             <Nav.Link as={Link} to="/login">Deconnexion</Nav.Link>
            
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              <span>Panier</span>
              <img 
                src="/images/cart-icon.png" 
                alt="Panier" 
                width="24" 
                style={{ marginLeft: '5px' }}
              /> 
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
