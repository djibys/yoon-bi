import { useEffect, useState } from 'react';
import { Card, Button, Badge, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { UserCheck, UserX, Car, FileText, Eye } from 'lucide-react';
import { AdminUsersAPI, type Utilisateur } from '../../services/api';

export function DriversValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [pendingDrivers, setPendingDrivers] = useState<Utilisateur[]>([]);
  const [selected, setSelected] = useState<Utilisateur | null>(null);
  const [show, setShow] = useState(false);

  const fetchPendingDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminUsersAPI.getPendingDrivers();
      setPendingDrivers(res.chauffeurs || []);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des chauffeurs en attente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const handleValidation = async (driverId: string, decision: 'VALIDE' | 'REJETE') => {
    if (!confirm(`Êtes-vous sûr de vouloir ${decision === 'VALIDE' ? 'valider' : 'rejeter'} ce chauffeur ?`)) return;
    try {
      setLoading(true);
      setError('');
      const res = await AdminUsersAPI.validateDriver(driverId, decision);
      setSuccess(res.message || `Chauffeur ${decision === 'VALIDE' ? 'validé' : 'rejeté'} avec succès`);
      setTimeout(() => setSuccess(''), 3000);
      await fetchPendingDrivers();
      setShow(false);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (u: Utilisateur) => {
    setSelected(u);
    setShow(true);
  };

  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="h5 mb-1">Validation des chauffeurs</h2>
        <div className="text-muted small">Valider ou rejeter les demandes d'inscription des chauffeurs</div>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Card>
        <Card.Header>
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-semibold">Chauffeurs en attente de validation</div>
            <Badge bg="warning" text="dark">{pendingDrivers.length}</Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Chauffeur</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Véhicule</th>
                  <th>Permis</th>
                  <th>Date d'inscription</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && pendingDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <Spinner animation="border" size="sm" className="me-2"/>Chargement…
                    </td>
                  </tr>
                ) : pendingDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Aucun chauffeur en attente de validation
                    </td>
                  </tr>
                ) : (
                  pendingDrivers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-circle bg-warning text-white">
                            {`${(u.prenom||'').charAt(0)}${(u.nom||'').charAt(0)}`.toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold small">{u.prenom} {u.nom}</div>
                            <Badge bg="warning" text="dark" className="small">En attente</Badge>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.tel}</td>
                      <td>
                        {u.vehicule ? (
                          <div className="small">
                            <div>{u.vehicule.marque} {u.vehicule.modele}</div>
                            <div className="text-muted">{u.vehicule.immatriculation}</div>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        {u.numPermis ? (
                          <div className="small">
                            <div>{u.numPermis}</div>
                            {u.dateValiditePermis && (
                              <div className="text-muted">
                                Exp: {new Date(u.dateValiditePermis).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : '—'}
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="text-end">
                        <Button size="sm" variant="light" className="me-2" onClick={() => openDetails(u)}>
                          <Eye size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="success" 
                          className="me-2"
                          onClick={() => handleValidation(u._id, 'VALIDE')}
                          disabled={loading}
                        >
                          <UserCheck size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleValidation(u._id, 'REJETE')}
                          disabled={loading}
                        >
                          <UserX size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du chauffeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selected ? null : (
            <>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="avatar-circle bg-warning text-white" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
                  {`${(selected.prenom||'').charAt(0)}${(selected.nom||'').charAt(0)}`.toUpperCase()}
                </div>
                <div>
                  <h5 className="mb-1">{selected.prenom} {selected.nom}</h5>
                  <div className="text-muted">{selected.email}</div>
                  <Badge bg="warning" text="dark" className="mt-1">En attente de validation</Badge>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <h6 className="border-bottom pb-2 mb-3"><FileText size={18} className="me-2"/>Informations personnelles</h6>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Téléphone</div>
                  <div className="fw-semibold">{selected.tel || '—'}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Date d'inscription</div>
                  <div className="fw-semibold">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <h6 className="border-bottom pb-2 mb-3"><FileText size={18} className="me-2"/>Permis de conduire</h6>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Numéro de permis</div>
                  <div className="fw-semibold">{selected.numPermis || '—'}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Date de validité</div>
                  <div className="fw-semibold">
                    {selected.dateValiditePermis 
                      ? new Date(selected.dateValiditePermis).toLocaleDateString()
                      : '—'}
                  </div>
                </div>

                {selected.vehicule && (
                  <>
                    <div className="col-12 mt-4">
                      <h6 className="border-bottom pb-2 mb-3"><Car size={18} className="me-2"/>Véhicule</h6>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Marque & Modèle</div>
                      <div className="fw-semibold">
                        {selected.vehicule.marque} {selected.vehicule.modele}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Immatriculation</div>
                      <div className="fw-semibold">{selected.vehicule.immatriculation || '—'}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small">Type</div>
                      <div className="fw-semibold">{selected.vehicule.typeVehicule || '—'}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small">Couleur</div>
                      <div className="fw-semibold">{selected.vehicule.couleur || '—'}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted small">Nombre de places</div>
                      <div className="fw-semibold">{selected.vehicule.nombrePlaces || '—'}</div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Fermer</Button>
          {selected && (
            <>
              <Button 
                variant="success" 
                onClick={() => handleValidation(selected._id, 'VALIDE')}
                disabled={loading}
              >
                <UserCheck size={16} className="me-2"/>Valider
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleValidation(selected._id, 'REJETE')}
                disabled={loading}
              >
                <UserX size={16} className="me-2"/>Rejeter
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
