import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import ProductFilter from '../components/ProductFilter';
import CardProduct from '../components/CardProduct';
import { Container, Row, Col } from 'react-bootstrap';

const categories = [
  { id: 1, name: 'Visage', image: '/images/solaire.jpg' },
  { id: 2, name: 'Cheveux', image: '/images/cheveux.jpg' },
  { id: 3, name: 'Corps', image: '/images/corps.jpg' },
  { id: 4, name: 'Bébé & Maman', image: '/images/bebe.jpg' },
  { id: 5, name: 'Bio & Naturel', image: '/images/bio.jpg' },
 
];

const products = [
  { id: 1, name: 'Crème hydratante', description: 'Pour peau sèche', price: 25, image: '/images/product1.jpg' },
  { id: 2, name: 'Vitamine C', description: 'Cheveux sensibles', price: 18, image: '/images/product2.jpg' },
  { id: 3, name: 'Gel Nettoyant', description: 'Hygiène quotidienne', price: 12, image: '/images/product3.jpg' },
];

function Home() {
  return (
    <div>
      <HeroSection />
      <Container className="my-5">
        <CategoryList categories={categories} />
        <ProductFilter categories={categories} onFilterChange={() => {}} />
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4}>
              <CardProduct product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
