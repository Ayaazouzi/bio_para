import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from "react-bootstrap";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [formData, setFormData] = useState({
    nom_article: "",
    description: "",
    prix: "",
    image: "",
    id_categorie: "",
    promo: 0
  });

  const API = "http://localhost/parapharmacie-project";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/getProductsAdmin.php`);
      setProducts(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setProducts([]);
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/getCategoriesAdmin.php`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur catégories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // On convertit les valeurs numériques pour PHP
      const payload = {
        nom_article: formData.nom_article,
        description: formData.description,
        prix: parseFloat(formData.prix),
        image: formData.image || "",
        id_categorie: Number(formData.id_categorie),
        promo: Number(formData.promo) || 0
      };

      if (editProduct) {
        await axios.put(`${API}/updateProductAdmin.php`, { ...payload, id_article: editProduct.id_article }, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        await axios.post(`${API}/addProductAdmin.php`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      setShowModal(false);
      setEditProduct(null);
      setFormData({
        nom_article: "",
        description: "",
        prix: "",
        image: "",
        id_categorie: "",
        promo: 0
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleEdit = product => {
    setEditProduct(product);
    setFormData({
      nom_article: product.nom_article,
      description: product.description,
      prix: product.prix,
      image: product.image,
      id_categorie: product.id_categorie,
      promo: product.promo
    });
    setShowModal(true);
  };

  const handleDelete = async id_article => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.delete(`${API}/deleteProductAdmin.php`, { data: { id_article } });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Chargement...</p>;

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Produits</h4>
              <Button variant="primary" onClick={() => setShowModal(true)}>Ajouter Produit</Button>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Catégorie</th>
                    <th>Promo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map(p => (
                      <tr key={p.id_article}>
                        <td>{p.id_article}</td>
                        <td>{p.nom_article}</td>
                        <td>{p.description}</td>
                        <td>{p.prix}</td>
                        <td>
                          {categories.find(c => String(c.id_categorie) === String(p.id_categorie))?.nom_categorie || "—"}
                        </td>
                        <td>{p.promo}</td>
                        <td>
                          <Button variant="secondary" size="sm" className="me-2" onClick={() => handleEdit(p)}>Modifier</Button>
                          <Button variant="primary" size="sm" onClick={() => handleDelete(p.id_article)}>Supprimer</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center">Aucun produit trouvé</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditProduct(null); }}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editProduct ? "Modifier Produit" : "Ajouter Produit"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control name="nom_article" value={formData.nom_article} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control type="number" step="0.01" name="prix" value={formData.prix} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (URL)</Form.Label>
              <Form.Control name="image" value={formData.image} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Select name="id_categorie" value={formData.id_categorie} onChange={handleChange} required>
                <option value="">Choisir catégorie</option>
                {categories.map(c => <option key={c.id_categorie} value={c.id_categorie}>{c.nom_categorie}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Promo (%)</Form.Label>
              <Form.Control type="number" name="promo" value={formData.promo} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditProduct(null); }}>Annuler</Button>
            <Button type="submit" variant="primary">{editProduct ? "Modifier" : "Ajouter"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ProductsAdmin;
