import { useEffect, useState } from 'react';
import { Container, Button, Table, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const id_user = localStorage.getItem('id_user');

  // Charger le panier depuis le backend
  useEffect(() => {
    if (!id_user) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost/parapharmacie-project/get_cart.php?id_user=${id_user}`);
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          setCart([]);
        } else {
          const uniqueCart = [];
          const seen = new Set();
          data.cart.forEach(item => {
            if (!seen.has(item.id_panier)) {
              seen.add(item.id_panier);
              uniqueCart.push({
                id: item.id_panier,
                id_article: item.id_article, // nécessaire pour passer la commande
                name: item.nom_article,
                image: item.image.startsWith('http')
                  ? item.image
                  : `http://localhost/parapharmacie-project/${item.image}`,
                quantity: Number(item.quantite),
                price: Number(item.prix_unitaire),
                total: Number(item.total)
              });
            }
          });
          setCart(uniqueCart);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement du panier");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id_user]);

  // Supprimer un article du panier
  const handleRemove = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const res = await fetch('http://localhost/parapharmacie-project/remove_from_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_article: id })
      });

      const data = await res.json();

      if (data.status === 'success') {
        setCart(cart.filter(item => item.id !== id));
      } else {
        alert('Impossible de supprimer le produit : ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du produit.');
    }
  };

  // Total du panier
  const totalPrice = cart.reduce((total, item) => total + item.total, 0);

  // Passer la commande
  const handlePlaceOrder = async () => {
    if (!cart.length) return alert("Votre panier est vide");

    const formattedCart = cart.map(item => ({
      id_article: item.id_article,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    try {
      const res = await fetch('http://localhost/parapharmacie-project/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user, cart: formattedCart })
      });

      const data = await res.json();

      if (data.error) {
        alert("Erreur : " + data.error);
      } else {
        alert(`Commande passée avec succès ! ID commande : ${data.order_id}`);
        setCart([]); // vider le panier après commande
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la commande. Vérifiez que votre serveur PHP est lancé et que CORS est configuré.");
    }
  };

  if (loading) return <p className="text-center mt-5">Chargement du panier...</p>;

  if (!cart.length) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
        <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', padding: '60px 40px', maxWidth: '500px', margin: '0 auto', background: 'white' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ color: '#6c757d', marginBottom: '20px', fontWeight: '600' }}>Votre panier est vide</h2>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Découvrez notre sélection de produits BioPara</p>
            <Link to="/products">
              <Button style={{ padding: '14px 40px', borderRadius: '50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontSize: '1.1rem', fontWeight: '600' }}>
                🛍️ Découvrir nos produits
              </Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', paddingBottom: '3rem' }}>
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-4 d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h3 fw-bold mb-1" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🛒 Mon Panier
              </h1>
              <p className="text-muted mb-0">Gérez vos achats</p>
            </div>
            <Badge bg="primary" pill style={{ fontSize: '1rem', padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
              {cart.length} article{cart.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Card style={{ border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem' }}>
          <Table responsive className="mb-0">
            <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <tr>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Produit</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Prix (DT)</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Quantité</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Total (DT)</th>
                <th style={{ padding: '20px', fontWeight: '600', border: 'none' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {cart.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: index < cart.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <td style={{ padding: '20px', verticalAlign: 'middle' }}>{item.name}</td>
                  <td style={{ padding: '20px', verticalAlign: 'middle', fontWeight: '600' }}>{item.price} DT</td>
                  <td style={{ padding: '20px', verticalAlign: 'middle', fontWeight: '600' }}>{item.quantity}</td>
                  <td style={{ padding: '20px', verticalAlign: 'middle', fontWeight: '700' }}>{item.total} DT</td>
                  <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

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
              <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#2d2d2d' }}>Total</span>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {totalPrice} DT
              </span>
            </div>
            <Button size="lg" onClick={handlePlaceOrder} style={{ width: '100%', padding: '16px', borderRadius: '50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontSize: '1.2rem', fontWeight: '700' }}>
              Passer la commande
            </Button>
            <p className="text-center mt-3 mb-0" style={{ color: '#6c757d', fontSize: '0.9rem' }}>🔒 Paiement sécurisé</p>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Cart;
