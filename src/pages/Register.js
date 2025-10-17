import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Envoi des données au fichier PHP
      const response = await axios.post(
        "http://localhost/parapharmacie-project/register_user.php",
        {
          name,
          email,
          password,
          phone,
        }
      );

      if (response.data.message) {
        alert(response.data.message);
        // Rediriger vers la page login si inscription réussie
        if (response.data.message === "Inscription réussie !") {
          navigate("/login");
        }
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Erreur lors de l'inscription !");
      }
    }
  };

  return (
    <div className="auth-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-card shadow-lg p-4 rounded-4">
          <h2 className="text-center mb-4 text-success fw-bold">Inscription</h2>

          <Form onSubmit={handleSubmit}>
            {/* Nom complet */}
            <Form.Group className="mb-3">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Mot de passe */}
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Téléphone */}
            <Form.Group className="mb-4">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 py-2 rounded-pill"
            >
              S'inscrire
            </Button>
          </Form>

          <p className="text-center mt-3 text-muted">
            Déjà un compte ?{" "}
            <span
              className="text-success fw-semibold link-hover"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Connectez-vous
            </span>
          </p>
        </Card>
      </Container>
    </div>
  );
}

export default Register;
