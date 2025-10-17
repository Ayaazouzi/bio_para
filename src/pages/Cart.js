import { Container, Button, Table, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const initialCart = [
  { id: 1, name: 'Crème hydratante', price: 25, quantity: 2, image: '/images/product1.jpg' },
  { id: 2, name: 'Vitamine C', price: 18, quantity: 1, image: '/images/product2.jpg' },
];

function Cart() {
  const [cart, setCart] = useState(initialCart);

  const handleRemove = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setCart(cart.filter(item => item.id !== id));
    }
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
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}>
        <div className="bg-white shadow-sm">
          <Container>
            <div className="py-4">
              <h1 className="h3 fw-bold" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🛒 Mon Panier
              </h1>
              <p className="text-muted mb-0">Gérez vos achats</p>
            </div>
          </Container>
        </div>

        <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            padding: '60px 40px',
            maxWidth: '500px',
            margin: '0 auto',
            background: 'white'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ color: '#6c757d', marginBottom: '20px', fontWeight: '600' }}>
              Votre panier est vide
            </h2>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>
              Découvrez notre sélection de produits BioPara
            </p>
            <Link to="/products">
              <Button 
                size="lg"
                style={{
                  padding: '14px 40px',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                }}
              >
                🛍️ Découvrir nos produits
              </Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      paddingBottom: '3rem'
    }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-4 d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h3 fw-bold mb-1" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🛒 Mon Panier
              </h1>
              <p className="text-muted mb-0">Gérez vos achats</p>
            </div>
            <Badge 
              bg="primary" 
              pill 
              style={{ 
                fontSize: '1rem', 
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              {cart.length} article{cart.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Table des produits */}
        <Card style={{ 
          border: 'none', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)', 
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <Table responsive className="mb-0">
            <thead style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <tr>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Produit</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Prix</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Quantité</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Total</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {cart.map((item, index) => (
                <tr key={item.id} style={{ 
                  borderBottom: index < cart.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                    <div className="d-flex align-items-center">
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '15px',
                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        overflow: 'hidden',
                        border: '2px solid #f0f0f0'
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/70'}
                        />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'middle', fontWeight: '600', fontSize: '1.1rem' }}>
                    ${item.price}
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                    <div className="d-flex align-items-center">
                      <Button 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                          border: '1px solid #667eea40',
                          color: '#667eea',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        −
                      </Button>
                      <span style={{
                        margin: '0 20px',
                        fontWeight: '700',
                        minWidth: '35px',
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        color: '#667eea'
                      }}>
                        {item.quantity}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '20px', 
                    verticalAlign: 'middle', 
                    fontWeight: '700', 
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ${item.price * item.quantity}
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        backgroundColor: '#7f7d7dff',
                        border: 'none',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = '#7f7d7dff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#7f7d7dff';
                      }}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Carte Total et Commande */}
        <div className="d-flex justify-content-end">
          <Card style={{
            border: 'none',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: '20px',
            padding: '35px',
            minWidth: '400px',
            background: 'white'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#2d2d2d' }}>
                Total
              </span>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ${totalPrice}
              </span>
            </div>
            
            <div style={{
              padding: '15px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
              marginBottom: '20px'
            }}>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#6c757d' }}>Sous-total</span>
                <span style={{ fontWeight: '600' }}>${totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#6c757d' }}>Livraison</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>Gratuite</span>
              </div>
              <hr style={{ margin: '10px 0' }} />
              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total</span>
                <span style={{ 
                  fontWeight: '700', 
                  fontSize: '1.3rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ${totalPrice}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: '700',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              Passer la commande
            </Button>

            <p className="text-center mt-3 mb-0" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              🔒 Paiement sécurisé
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Cart;