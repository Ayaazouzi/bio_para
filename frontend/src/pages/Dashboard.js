// src/pages/Dashboard.js
import { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { 
  FaUsers, 
  FaUserShield, 
  FaShoppingBag, 
  FaTags, 
  FaChartLine,
  FaCheckCircle 
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost/parapharmacie-project/get_dashboard_data.php?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setStats(res.data);
          setError(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Accès refusé - Vous devez être admin");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Erreur : " + err.message);
        }
        setLoading(false);
      });
  }, [navigate]);

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Card className="border-0 shadow-lg h-100">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="p-3 rounded-circle me-3" style={{ backgroundColor: color + "22" }}>
            {icon}
          </div>
          <div>
            <h6 className="text-muted m-0">{title}</h6>
            <h2 className="fw-bold m-0" style={{ color }}>{value}</h2>
          </div>
        </div>
        <div className="d-flex align-items-center text-muted">
          <FaChartLine className="me-2" />
          <small>{subtitle}</small>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="mt-3">Chargement...</p>
      </Container>
    );
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh" }}>
      <Container className="py-5">

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <h2 className="fw-bold mb-4">Tableau de bord Admin</h2>

        {/* 📊 Statistiques */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <StatCard 
              icon={<FaUsers size={26} style={{ color: "#3b82f6" }} />} 
              title="Utilisateurs"
              value={stats.nb_users ?? "0"}
              subtitle="Comptes totaux"
              color="#3b82f6"
            />
          </Col>

          <Col md={3}>
            <StatCard 
              icon={<FaUserShield size={26} style={{ color: "#8b5cf6" }} />} 
              title="Admins"
              value={stats.nb_admins ?? "0"}
              subtitle="Accès complet"
              color="#8b5cf6"
            />
          </Col>

          <Col md={3}>
            <StatCard 
              icon={<FaUsers size={26} style={{ color: "#10b981" }} />} 
              title="Clients"
              value={stats.nb_clients ?? "0"}
              subtitle="Clients actifs"
              color="#10b981"
            />
          </Col>

          <Col md={3}>
            <StatCard 
              icon={<FaCheckCircle size={26} style={{ color: "#06b6d4" }} />} 
              title="Système"
              value="✓"
              subtitle="En ligne"
              color="#06b6d4"
            />
          </Col>
        </Row>

        {/* 📦 Articles & catégories */}
        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 shadow-lg">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3 bg-warning">
                      <FaTags size={25} className="text-white" />
                    </div>
                    <div>
                      <h5 className="fw-bold m-0">Catégories</h5>
                      <small className="text-muted">Organisation produits</small>
                    </div>
                  </div>
                  <h1 className="fw-bold">{stats.nb_categories ?? "0"}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-lg">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3 bg-danger">
                      <FaShoppingBag size={25} className="text-white" />
                    </div>
                    <div>
                      <h5 className="fw-bold m-0">Articles</h5>
                      <small className="text-muted">Stock total</small>
                    </div>
                  </div>
                  <h1 className="fw-bold">{stats.nb_articles ?? "0"}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ⚡ Actions rapides */}
        <Card className="border-0 shadow-lg">
          <Card.Body>
            <h4 className="fw-bold mb-3">Actions rapides</h4>

            <Row className="g-3">
              <Col md={3}>
                <Button 
                  className="w-100 py-3 fw-semibold" 
                  variant="outline-primary"
                  onClick={() => navigate("/admin/products")}
                >
                  <FaShoppingBag className="me-2" /> Gérer Produits
                </Button>
              </Col>
              <Col md={3}>
                <Button className="w-100 py-3 fw-semibold" variant="outline-warning">
                  <FaTags className="me-2" /> Catégories
                </Button>
              </Col>
              <Col md={3}>
                <Button className="w-100 py-3 fw-semibold" variant="outline-success">
                  <FaUsers className="me-2" /> Clients
                </Button>
              </Col>
              <Col md={3}>
                <Button className="w-100 py-3 fw-semibold" variant="outline-info">
                  <FaChartLine className="me-2" /> Commandes
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
}

export default Dashboard;
