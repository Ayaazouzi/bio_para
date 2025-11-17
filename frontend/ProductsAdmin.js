// src/pages/ProductsAdmin.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id_article: "", nom_article: "", description: "", prix: "", image: "", id_categorie: "", promo: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios.get(`http://localhost/parapharmacie-project/getProductsAdmin.php?token=${encodeURIComponent(token)}`)
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    axios.post("http://localhost/parapharmacie-project/deleteProductAdmin.php", { id_article: id, token })
      .then(() => fetchProducts())
      .catch(err => setError(err.message));
  };

  const handleSubmit = () => {
    const url = form.id_article ? "updateProductAdmin.php" : "addProductAdmin.php";
    axios.post(`http://localhost/parapharmacie-project/${url}`, { ...form, token })
      .then(() => {
        fetchProducts();
        setShowModal(false);
        setForm({ id_article: "", nom_article: "", description: "", prix: "", image: "", id_categorie: "", promo: 0 });
      })
      .catch(err => setError(err.message));
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3 text-end">
        <Button onClick={() => setShowModal(true)}>Ajouter Produit</Button>
      </div>

      {loading ? <p>Chargement...</p> :
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Description</th><th>Prix</th><th>Promo</th><th>Catégorie</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id_article}>
              <td>{p.id_article}</td>
              <td>{p.nom_article}</td>
              <td>{p.description}</td>
              <td>{p.prix}</td>
              <td>{p.promo}</td>
              <td>{categories.find(c => c.id_categorie == p.id_categorie)?.nom_categorie || p.id_categorie}</td>

              <td>
                <Button size="sm" onClick={() => { setForm(p); setShowModal(true); }}>Modifier</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id_article)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id_article ? "Modifier Produit" : "Ajouter Produit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["nom_article","description","prix","image","id_categorie","promo"].map(f => (
              <Form.Group className="mb-3" key={f}>
                <Form.Label>{f.replace("_"," ")}</Form.Label>
                <Form.Control
                  type={f==="prix"||f==="promo"?"number":"text"}
                  value={form[f]}
                  onChange={e => setForm({...form, [f]: e.target.value})}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{form.id_article ? "Modifier" : "Ajouter"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductsAdmin;
