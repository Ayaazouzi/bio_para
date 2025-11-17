import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection'; 
import CategoryList from '../components/CategoryList';
import CardProduct from '../components/CardProduct';
import { Container, Row, Col } from 'react-bootstrap';

const categories = [
  { id: 1, name: 'Visage', image: '/images/solaire.jpg' },
  { id: 2, name: 'Cheveux', image: '/images/cheveux.jpg' },
  { id: 3, name: 'Corps', image: '/images/corps.jpg' },
  { id: 4, name: 'Bébé & Maman', image: '/images/bebe.jpg' },
  { id: 5, name: 'Bio & Naturel', image: '/images/bio.jpg' },
];

function Home() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('http://localhost/parapharmacie-project/get_promotions.php');
        const data = await res.json();
        setPromotions(data.promotions || []);
      } catch (err) {
        console.error('Erreur lors du chargement des promotions :', err);
      }
    };
    fetchPromotions();
  }, []);

  // ✅ ENVOI VERS add_to_cart.php
  const addToCart = async (product) => {
    const id_user = localStorage.getItem('id_user');
    if (!id_user) return alert("Vous devez être connecté.");

    try {
      const res = await fetch('http://localhost/parapharmacie-project/add_to_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user,
          id_article: product.id_article,
          quantity: 1,
          price: product.price
        })
      });
      const data = await res.json();

      if (data.error) alert("Erreur : " + data.error);
      else alert(data.message || "Produit ajouté au panier");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur PHP");
    }
  };

  return (
    <div>
      <HeroSection />
      <Container className="my-5">
        <CategoryList categories={categories} />
        {promotions.length > 0 && (
          <>
            <h2 className="mt-5 mb-4">Produits en promotion</h2>
            <Row>
              {promotions.map(product => (
                <Col key={product.id_article} md={3} className="mb-4">
                  <CardProduct
                    product={{
                      id_article: product.id_article,
                      name: product.nom_article,
                      description: product.description,
                      price: product.prix,
                      image: `/images/${product.image}`,
                    }}
                    onAdd={addToCart}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
