import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className="auth-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-card shadow-lg p-4 rounded-4">
          <h2 className="text-center mb-4 text-success fw-bold">Connexion</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              className="w-100 py-2 rounded-pill"
            >
              Se connecter
            </Button>
          </Form>
          <p className="text-center mt-3 text-muted">
            Pas encore de compte ?{" "}
            <span
              className="text-success fw-semibold link-hover"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Inscrivez-vous
            </span>
          </p>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
