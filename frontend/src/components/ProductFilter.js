import { useState, useEffect } from 'react';
import ProductFilter from '../components/ProductFilter';
import CardProduct from '../components/CardProduct';
import { Container, Row, Col } from 'react-bootstrap';

const categories = [
  { id: 1, name: 'Visage' },
  { id: 2, name: 'Cheveux' },
  { id: 3, name: 'Corps' },
  { id: 4, name: 'Bébé & Maman' },
  { id: 5, name: 'Bio & Naturel' },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');

  useEffect(() => {
    // Exemple : fetch tous les produits depuis backend
    const fetchProducts = async () => {
      const res = await fetch('http://localhost/parapharmacie-project/get_products.php');
      const data = await res.json();
      setProducts(data.products || []);
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (categoryId) => {
    setFilteredCategory(categoryId);
  };

  const filteredProducts = filteredCategory
    ? products.filter(p => p.category_id === Number(filteredCategory))
    : products;

  return (
    <Container className="my-5">
      <ProductFilter categories={categories} onFilterChange={handleFilterChange} />
      <Row className="mt-4">
        {filteredProducts.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <CardProduct product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
