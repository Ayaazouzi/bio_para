import { Card, Button } from 'react-bootstrap';

function CardProduct({ product, onAdd }) {
  return (
    <Card className="shadow-sm mb-4" style={{ height: '100%' }}>
      <Card.Img
        variant="top"
        src={product.image}
        style={{ objectFit: 'cover', height: '300px' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="flex-grow-1">{product.description}</Card.Text>
        <Card.Text className="fw-bold">{product.price} TND</Card.Text>
        <Button className="w-100 mt-auto" onClick={() => onAdd(product)}>
          Ajouter au panier
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardProduct;
