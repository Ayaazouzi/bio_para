// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Alert } from "react-bootstrap";
import { FaUsers, FaUserShield, FaShoppingBag, FaTags, FaChartLine, FaCheckCircle } from "react-icons/fa";

function DashboardAdmin() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserName(localStorage.getItem("userName") || "Administrateur");
    if (!token) return navigate("/login");

    axios.get(`http://localhost/parapharmacie-project/getDashboardDataAdmin.php?token=${encodeURIComponent(token)}`)
      .then(res => {
        if(res.data.error) setError(res.data.error);
        else setStats(res.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const StatCard = ({ icon, title, value, subtitle, bgColor }) => (
    <Card className="border-0 shadow-lg h-100" style={{ borderLeft: `4px solid ${bgColor}` }}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="p-3 rounded-circle" style={{ backgroundColor: `${bgColor}20` }}>{icon}</div>
          <div className="ms-3">
            <h6 className="text-muted mb-0">{title}</h6>
            <h2 className="fw-bold mb-0" style={{ color: bgColor }}>{value}</h2>
          </div>
        </div>
        <small className="text-muted">{subtitle}</small>
      </Card.Body>
    </Card>
  );

  if (loading) return <Container className="mt-5 text-center"><p>Chargement...</p></Container>;

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4 mb-5">
        <Col md={3}><StatCard icon={<FaUsers />} title="Utilisateurs" value={stats.nb_users} subtitle="Tous" bgColor="#3b82f6" /></Col>
        <Col md={3}><StatCard icon={<FaUserShield />} title="Admins" value={stats.nb_admins} subtitle="Accès complet" bgColor="#8b5cf6" /></Col>
        <Col md={3}><StatCard icon={<FaUsers />} title="Clients" value={stats.nb_clients} subtitle="Actifs" bgColor="#10b981" /></Col>
        <Col md={3}><StatCard icon={<FaCheckCircle />} title="Système" value="✓" subtitle="Tout fonctionne" bgColor="#06b6d4" /></Col>
      </Row>
    </Container>
  );
}

export default DashboardAdmin;
