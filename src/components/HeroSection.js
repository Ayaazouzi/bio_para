import { Button } from 'react-bootstrap';

function HeroSection() {
  return (
    <div className="hero-section text-center py-5"   style={{
    backgroundImage: 'url(/images/hero.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '65vh', // 👈 augmente la hauteur ici
  }}>
      <h1 className="display-4 text-white">Bienvenue chez Biopara</h1>
      <p className="lead text-white">Votre parapharmacie en ligne avec les meilleurs produits au meilleur prix</p>
      <Button variant="success" size="lg">Voir nos produits</Button>
    </div>
  );
}

export default HeroSection;
