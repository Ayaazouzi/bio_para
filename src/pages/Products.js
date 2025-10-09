import CardProduct from '../components/CardProduct';
import { Container, Row, Col } from 'react-bootstrap';

const products = [
  { id: 1, name: 'Crème hydratante', description: 'Pour peau sèche', price: 25, image: '/images/product1.jpg' },
  { id: 2, name: 'Vitamine C', description: 'Pour cheveux sensibles', price: 18, image: '/images/product2.jpg' },
  { id: 3, name: 'Gel Nettoyant', description: 'Hygiène quotidienne', price: 12, image: '/images/product3.jpg' },
 
];

function Products() {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-success">Nos Produits</h2>
      <Row>
        {products.map(product => (
          <Col key={product.id} md={4} sm={6} xs={12}>
            <CardProduct product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
