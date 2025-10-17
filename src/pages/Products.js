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
        const response = await fetch('http://localhost/parapharmacie-project/get_products.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Vérifier si c'est une erreur
        if (data.error) {
          throw new Error(data.error);
        }

        // Formater les données
        const formatted = data.map(item => ({
          id: item.id_article,
          name: item.nom_article,
          description: item.description,
          price: parseFloat(item.prix),
          image: `/images/${item.image}`,
          category: item.id_categorie
        }));

        setProducts(formatted);
        setLoading(false);

      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Chargement des produits...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>❌ Erreur de chargement</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="mb-0">
            <p><strong>Vérifications à faire :</strong></p>
            <ol>
              <li>WAMP est démarré (icône verte)</li>
              <li>Le fichier existe : <code>C:\wamp64\www\parapharmacie-project\get_products.php</code></li>
              <li>Testez dans le navigateur : <a href="http://localhost/parapharmacie-project/get_products.php" target="_blank" rel="noopener noreferrer">http://localhost/parapharmacie-project/get_products.php</a></li>
              <li>La base de données "Bio_Para" existe dans phpMyAdmin</li>
            </ol>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-success">Nos Produits Bio</h2>
      
      {products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <Alert.Heading>📦 Aucun produit</Alert.Heading>
          <p>Aucun produit disponible pour le moment.</p>
        </Alert>
      ) : (
        <>
          <p className="text-center text-muted mb-4">
            {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
          </p>
          <Row>
            {products.map(product => (
              <Col key={product.id} md={4} sm={6} xs={12} className="mb-4">
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Products;