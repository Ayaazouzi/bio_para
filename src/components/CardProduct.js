import { Card, Button } from 'react-bootstrap';

function CardProduct({ product }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Img variant="top" src={product.image} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text className="fw-bold">{product.price} TND</Card.Text>
        <Button variant="success" className="w-100">Ajouter au panier</Button>
      </Card.Body>
    </Card>
  );
}

export default CardProduct;
