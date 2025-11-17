import AuthNavbar from "../components/AuthNavbar";
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
      const response = await axios.post(
        "http://localhost/parapharmacie-project/login_user.php",
        { email, mot_de_passe: password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("id_user", user.id); // <-- important

      if (user.role === "admin") navigate("/dashboard");
      else navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Email ou mot de passe incorrect !");
    }
  };

  return (
    <>
      <AuthNavbar />
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
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100 py-2 rounded-pill">
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
    </>
  );
}

export default Login;
