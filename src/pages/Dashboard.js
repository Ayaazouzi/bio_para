import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Badge, Button } from "react-bootstrap";
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
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName") || "Administrateur";
    setUserName(storedName);
    
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
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Accès refusé - Vous devez être admin");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(`Erreur: ${err.message}`);
        }
        setLoading(false);
      });
  }, [navigate]);

  const StatCard = ({ icon, title, value, subtitle, bgColor, iconColor }) => (
    <Card className="border-0 shadow-lg h-100" style={{ 
      background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}25 100%)`,
      borderLeft: `4px solid ${bgColor}`
    }}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="p-3 rounded-circle" style={{ backgroundColor: `${bgColor}20` }}>
              {icon}
            </div>
            <div className="ms-3">
              <h6 className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{title}</h6>
              <h2 className="fw-bold mb-0 mt-1" style={{ color: bgColor }}>{value}</h2>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.85rem' }}>
          <FaChartLine className="me-2" />
          <span>{subtitle}</span>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Chargement des données...</p>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-4 d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold mb-1" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🛡️ Tableau de Bord Admin - BioPara
              </h1>
              <p className="text-muted mb-0">Gestion des utilisateurs et statistiques</p>
            </div>
            <div className="text-end">
              <Badge bg="success" className="px-3 py-2">
                <FaCheckCircle className="me-2" />
                Système Actif
              </Badge>
              <p className="text-muted mb-0 mt-2">Connecté: <strong>{userName}</strong></p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {error && (
          <Alert variant="danger" className="shadow-sm border-0 mb-4" dismissible>
            <Alert.Heading>❌ Erreur</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {/* Statistiques principales */}
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUsers size={24} style={{ color: '#3b82f6' }} />}
              title="Total Utilisateurs"
              value={stats.nb_users ?? "0"}
              subtitle="Tous les utilisateurs"
              bgColor="#3b82f6"
              iconColor="#3b82f6"
            />
          </Col>

          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUserShield size={24} style={{ color: '#8b5cf6' }} />}
              title="Administrateurs"
              value={stats.nb_admins ?? "0"}
              subtitle="Accès complet"
              bgColor="#8b5cf6"
              iconColor="#8b5cf6"
            />
          </Col>

          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUsers size={24} style={{ color: '#10b981' }} />}
              title="Clients"
              value={stats.nb_clients ?? "0"}
              subtitle="Utilisateurs actifs"
              bgColor="#10b981"
              iconColor="#10b981"
            />
          </Col>

          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCheckCircle size={24} style={{ color: '#06b6d4' }} />}
              title="Statut Système"
              value="✓"
              subtitle="Tout fonctionne"
              bgColor="#06b6d4"
              iconColor="#06b6d4"
            />
          </Col>
        </Row>

        {/* Statistiques secondaires */}
        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 shadow-lg h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' }}>
                      <FaTags size={28} className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h5 className="fw-bold mb-0">Catégories</h5>
                      <small className="text-muted">Produits organisés</small>
                    </div>
                  </div>
                  <h1 className="display-4 fw-bold mb-0" style={{ 
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.nb_categories ?? "0"}
                  </h1>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ background: 'linear-gradient(90deg, #fb923c 0%, #f97316 100%)', width: '75%' }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-lg h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
                      <FaShoppingBag size={28} className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h5 className="fw-bold mb-0">Articles</h5>
                      <small className="text-muted">Produits en stock</small>
                    </div>
                  </div>
                  <h1 className="display-4 fw-bold mb-0" style={{ 
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stats.nb_articles ?? "0"}
                  </h1>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ background: 'linear-gradient(90deg, #ec4899 0%, #db2777 100%)', width: '85%' }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions rapides */}
        <Card className="border-0 shadow-lg">
          <Card.Body className="p-4">
            <h4 className="fw-bold mb-4 d-flex align-items-center">
              <span className="bg-primary rounded me-2" style={{ width: '4px', height: '24px' }}></span>
              Actions Rapides
            </h4>
            <Row className="g-3">
              <Col md={6} lg={3}>
                <Button 
                  variant="outline-primary" 
                  className="w-100 py-3 border-2 fw-semibold"
                  style={{ transition: 'all 0.3s' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaShoppingBag className="me-2" />
                  Produits
                </Button>
              </Col>
              <Col md={6} lg={3}>
                <Button 
                  variant="outline-warning" 
                  className="w-100 py-3 border-2 fw-semibold"
                  style={{ transition: 'all 0.3s' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(251, 146, 60, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaTags className="me-2" />
                  Catégories
                </Button>
              </Col>
              <Col md={6} lg={3}>
                <Button 
                  variant="outline-success" 
                  className="w-100 py-3 border-2 fw-semibold"
                  style={{ transition: 'all 0.3s' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaUsers className="me-2" />
                  Clients
                </Button>
              </Col>
              <Col md={6} lg={3}>
                <Button 
                  variant="outline-info" 
                  className="w-100 py-3 border-2 fw-semibold"
                  style={{ transition: 'all 0.3s' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaChartLine className="me-2" />
                  Commandes
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