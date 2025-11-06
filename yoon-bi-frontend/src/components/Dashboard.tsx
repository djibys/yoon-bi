import { useEffect, useState } from 'react';
import { Card, Row, Col, ListGroup, Pagination, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Users, Car, Ticket, DollarSign, UserCheck, UserX, Eye } from 'lucide-react';
import { TableauDeBordAPI, AdminUsersAPI, type ResumeTableauDeBord, type StatistiqueTableauDeBord, type Activite, type Utilisateur } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [pageCourante, setPageCourante] = useState(1);
  const taillePage = 3;

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string>('');
  const [succes, setSucces] = useState<string>('');
  const [resume, setResume] = useState<ResumeTableauDeBord | null>(null);
  const [statistiques, setStatistiques] = useState<StatistiqueTableauDeBord[] | null>(null);
  const [activites, setActivites] = useState<Activite[]>([]);
  const [totalPagesActivites, setTotalPagesActivites] = useState<number>(1);
  const [pendingDrivers, setPendingDrivers] = useState<Utilisateur[]>([]);
  const [validatingDriver, setValidatingDriver] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setChargement(true);
    setErreur('');
    Promise.all([
      TableauDeBordAPI.resume(), 
      TableauDeBordAPI.statistiques(),
      AdminUsersAPI.getPendingDrivers()
    ])
      .then(([s, st, drivers]) => {
        if (!mounted) return;
        setResume(s);
        setStatistiques(st);
        setPendingDrivers(drivers.chauffeurs || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setErreur('Erreur lors du chargement du tableau de bord');
        console.error(e);
      })
      .finally(() => {
        if (!mounted) return;
        setChargement(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    AdminUsersAPI.list(pageCourante, taillePage)
      .then((res) => {
        if (!mounted) return;
        const mapped: Activite[] = (res.items || []).map((u: Utilisateur) => ({
          type: 'user',
          title: 'Nouveau client inscrit',
          name: `${u.prenom} ${u.nom}`.trim(),
          time: u.createdAt ? new Date(u.createdAt).toLocaleString() : ''
        }));
        setActivites(mapped);
        setTotalPagesActivites(res.totalPages || 1);
      })
      .catch((e) => {
        if (!mounted) return;
        setErreur((prev) => prev || 'Erreur lors du chargement des activités');
        console.error(e);
      });
    return () => { mounted = false; };
  }, [pageCourante]);

  const donneesKpi = [
    { title: 'Utilisateurs totaux', value: resume?.utilisateursTotaux ?? '—', color: '#0d6efd', trend: resume?.tendanceUtilisateurs ?? '+0%', icon: Users },
    { title: 'Trajets publiés', value: resume?.trajetsPublies ?? '—', color: '#00853F', trend: resume?.tendanceTrajets ?? '+0%', icon: Car },
    { title: 'Réservations', value: resume?.reservations ?? '—', color: '#6f42c1', trend: resume?.tendanceReservations ?? '+0%', icon: Ticket },
    { title: 'Commission collectée', value: resume?.commissionCollectee ?? '—', color: '#E31B23', trend: resume?.tendanceCommission ?? '+0%', icon: DollarSign },
  ];

  const statsDetaillees = (statistiques && statistiques.length > 0)
    ? statistiques
    : [
        { libelle: 'Nombre de clients', valeur: '—' },
        { libelle: 'Nombre de chauffeurs', valeur: '—' },
        { libelle: 'Trajets actifs', valeur: '—' },
        { libelle: 'Revenus ce mois', valeur: '—' },
      ];

  const handleValidateDriver = async (driverId: string, decision: 'VALIDE' | 'REJETE') => {
    if (!confirm(`Êtes-vous sûr de vouloir ${decision === 'VALIDE' ? 'valider' : 'rejeter'} ce chauffeur ?`)) return;
    try {
      setValidatingDriver(driverId);
      setErreur('');
      const res = await AdminUsersAPI.validateDriver(driverId, decision);
      setSucces(res.message || `Chauffeur ${decision === 'VALIDE' ? 'validé' : 'rejeté'} avec succès`);
      setTimeout(() => setSucces(''), 3000);
      // Recharger les chauffeurs en attente
      const drivers = await AdminUsersAPI.getPendingDrivers();
      setPendingDrivers(drivers.chauffeurs || []);
    } catch (e: any) {
      setErreur(e?.message || 'Erreur lors de la validation');
    } finally {
      setValidatingDriver(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Tableau de bord</h1>
        <div className="text-muted">Vue d'ensemble de la plateforme Yoon-Bi</div>
      </div>

      {erreur && (
        <Alert variant="danger" dismissible onClose={() => setErreur('')}>{erreur}</Alert>
      )}
      {succes && (
        <Alert variant="success" dismissible onClose={() => setSucces('')}>{succes}</Alert>
      )}

      <Row className="g-3 mb-4">
        {donneesKpi.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Col key={idx} xs={12} md={6} lg={3}>
              <Card className="h-100 kpi-card">
                <Card.Body>
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <div className="text-muted small">{kpi.title}</div>
                      <div className="h4 mt-2 mb-1">{chargement ? '…' : kpi.value}</div>
                      {/* <div className="kpi-trend">{kpi.trend} ce mois</div> */}
                    </div>
                    <div className="kpi-icon" style={{ backgroundColor: kpi.color }}>
                      <Icon size={20} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Chauffeurs en attente de validation */}
      {pendingDrivers.length > 0 && (
        <Card className="mb-4 shadow-sm border-warning">
          <Card.Header className="bg-warning bg-opacity-10">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <Card.Title as="h2" className="h6 mb-0">
                  <UserCheck size={18} className="me-2" />
                  Chauffeurs en attente de validation
                </Card.Title>
              </div>
              <Badge bg="warning" text="dark">{pendingDrivers.length}</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {pendingDrivers.slice(0, 5).map((driver) => (
                <ListGroup.Item key={driver._id} className="d-flex align-items-center gap-3">
                  <div className="avatar-circle bg-warning text-white" style={{ width: 40, height: 40, fontSize: '0.875rem' }}>
                    {`${(driver.prenom||'').charAt(0)}${(driver.nom||'').charAt(0)}`.toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold small">{driver.prenom} {driver.nom}</div>
                    <div className="text-muted small">{driver.email}</div>
                    {driver.vehicule && (
                      <div className="text-muted small">
                        {driver.vehicule.marque} {driver.vehicule.modele} - {driver.vehicule.immatriculation}
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      onClick={() => navigate('/drivers-validation')}
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="success"
                      onClick={() => handleValidateDriver(driver._id, 'VALIDE')}
                      disabled={validatingDriver === driver._id}
                      title="Valider"
                    >
                      {validatingDriver === driver._id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <UserCheck size={16} />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleValidateDriver(driver._id, 'REJETE')}
                      disabled={validatingDriver === driver._id}
                      title="Rejeter"
                    >
                      {validatingDriver === driver._id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <UserX size={16} />
                      )}
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {pendingDrivers.length > 5 && (
              <Card.Footer className="text-center">
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigate('/drivers-validation')}
                >
                  Voir tous les chauffeurs en attente ({pendingDrivers.length})
                </Button>
              </Card.Footer>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Detailed Stats */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <Card.Title as="h2" className="h6 mb-0">Statistiques détaillées</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {statsDetaillees.map((stat, idx) => (
              <Col key={idx} xs={6} md={3}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Body className="text-center">
                    <div className="text-muted small">{stat.libelle}</div>
                    <div className="fw-semibold mt-1">{chargement && !statistiques ? '…' : stat.valeur}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header>
          <Card.Title as="h2" className="h6 mb-0">Activité récente</Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {(activites.length === 0 && chargement) ? (
              <ListGroup.Item className="text-muted">Chargement…</ListGroup.Item>
            ) : (
              activites.map((activity, idx) => (
              <ListGroup.Item key={idx} className="d-flex align-items-center gap-3 activity-item">
                <div
                  className="activity-avatar"
                  style={{
                    backgroundColor:
                      activity.type === 'user' ? '#0d6efd' :
                      activity.type === 'driver' ? '#00853F' :
                      activity.type === 'trip' ? '#6f42c1' :
                      activity.type === 'reservation' ? '#fd7e14' :
                      '#E31B23'
                  }}
                >
                  {activity.type === 'payment' ? '💰' : (activity.name || '').slice(0,2).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold small">{activity.title}</div>
                  <div className="text-muted small">{activity.name}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </ListGroup.Item>
              ))
            )}
          </ListGroup>

          {/* Pagination */}
          {totalPagesActivites > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => setPageCourante(Math.max(1, pageCourante - 1))}
                  disabled={pageCourante === 1}
                />
                {Array.from({ length: totalPagesActivites }, (_, i) => i + 1).map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === pageCourante}
                    onClick={() => setPageCourante(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setPageCourante(Math.min(totalPagesActivites, pageCourante + 1))}
                  disabled={pageCourante === totalPagesActivites}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
