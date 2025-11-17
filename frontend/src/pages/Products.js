import { useState, useEffect } from 'react';
import CardProduct from '../components/CardProduct';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost/parapharmacie-project/get_products.php');
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setProducts(data.map(item => ({
          id: item.id_article,
          name: item.nom_article,
          description: item.description,
          price: parseFloat(item.prix),
          image: `/images/${item.image}`,
          category: item.id_categorie
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const id_user = parseInt(localStorage.getItem("id_user"), 10);
    if (!id_user) {
      alert("Vous devez être connecté pour ajouter au panier");
      return;
    }

    try {
      const res = await fetch('http://localhost/parapharmacie-project/add_to_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_article: product.id,
          quantity: 1,
          price: product.price,
          id_user: id_user
        })
      });

      const data = await res.json();
      if (data.error) alert("Erreur : " + data.error);
      else alert(data.message || "Produit ajouté !");
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  if (loading) return (
    <Container className="my-5 text-center">
      <Spinner animation="border" />
      <p>Chargement...</p>
    </Container>
  );

  if (error) return (
    <Container className="my-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-success">Nos Produits Bio</h2>
      <Row>
        {products.map(product => (
          <Col key={product.id} md={4} sm={6} xs={12} className="mb-4">
            <CardProduct product={product} onAdd={handleAddToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
