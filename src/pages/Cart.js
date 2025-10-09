import { Container, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const initialCart = [
  { id: 1, name: 'Crème hydratante', price: 25, quantity: 2, image: '/images/product1.jpg' },
  { id: 2, name: 'Vitamine C', price: 18, quantity: 1, image: '/images/product2.jpg' },
];

function Cart() {
  const [cart, setCart] = useState(initialCart);

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) } 
        : item
    ));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Votre panier est vide</h2>
        <Link to="/products" className="btn btn-primary mt-3">Voir les produits</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2>Mon Panier</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>
                <img src={item.image} alt={item.name} width="50" style={{ marginRight: '10px' }} />
                {item.name}
              </td>
              <td>${item.price}</td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
              </td>
              <td>${item.price * item.quantity}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4 className="text-end">Total : ${totalPrice}</h4>
      <div className="text-end mt-3">
        <Button variant="success">Passer la commande</Button>
      </div>
    </Container>
  );
}

export default Cart;
