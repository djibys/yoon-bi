import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Form, InputGroup, Badge, Table, Modal, Tabs, Tab, Pagination, Spinner } from 'react-bootstrap';
import { Search, Eye, Ban, CheckCircle, Star } from 'lucide-react';
import { AdminUsersAPI, type Utilisateur } from '../../services/api';

export function Drivers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [drivers, setDrivers] = useState<Utilisateur[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<Utilisateur | null>(null);
  const [show, setShow] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminUsersAPI.list(page, limit, search || undefined, 'CHAUFFEUR');
      setDrivers(res.items || []);
      setTotalPages(res.totalPages || 1);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des chauffeurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openDetails = (u: Utilisateur) => {
    setSelected(u);
    setShow(true);
  };

  const handleBlockToggle = async (u: Utilisateur) => {
    try {
      setLoading(true);
      if (u.actif) await AdminUsersAPI.block(u._id);
      else await AdminUsersAPI.unblock(u._id);
      await fetchDrivers();
    } catch (e: any) {
      setError(e?.message || 'Action impossible');
    } finally {
      setLoading(false);
    }
  };

  const paginationItems = useMemo(() => (
    Array.from({ length: totalPages }, (_, i) => i + 1)
  ), [totalPages]);

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="h5 mb-1">Gestion des chauffeurs</h2>
          <div className="text-muted small">Gérer tous les chauffeurs de la plateforme</div>
        </div>
        <form onSubmit={onSearchSubmit} className="d-inline-block">
          <InputGroup>
            <InputGroup.Text><Search size={16} /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher (nom, prénom, email, téléphone, immatriculation)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" variant="primary">Rechercher</Button>
          </InputGroup>
        </form>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <Card>
        <Card.Header>
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-semibold">Liste des chauffeurs</div>
            <div className="text-muted small">{loading ? 'Chargement…' : `${drivers.length} élément(s)`}</div>
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
                  <th>Statut</th>
                  <th>Créé le</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && drivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4"><Spinner animation="border" size="sm" className="me-2"/>Chargement…</td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">Aucun chauffeur</td>
                  </tr>
                ) : (
                  drivers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-circle bg-success text-white">{`${(u.prenom||'').charAt(0)}${(u.nom||'').charAt(0)}`.toUpperCase()}</div>
                          <div>
                            <div className="fw-semibold small">{u.prenom} {u.nom}</div>
                            <div className="text-muted small">{u._id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.tel}</td>
                      <td>{u.actif ? <Badge bg="success">Actif</Badge> : <Badge bg="secondary">Bloqué</Badge>}</td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="text-end">
                        <Button size="sm" variant="light" className="me-2" onClick={() => openDetails(u)}>
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant={u.actif ? 'outline-danger' : 'outline-success'}
                          onClick={() => handleBlockToggle(u)}
                          disabled={loading}
                        >
                          {u.actif ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        {totalPages > 1 && (
          <Card.Footer className="d-flex justify-content-center">
            <Pagination className="mb-0">
              <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
              {paginationItems.map((p) => (
                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Profil du chauffeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selected ? null : (
            <>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar-circle bg-success text-white" style={{ width: 56, height: 56 }}>
                  {`${(selected.prenom||'').charAt(0)}${(selected.nom||'').charAt(0)}`.toUpperCase()}
                </div>
                <div>
                  <div className="fw-semibold">{selected.prenom} {selected.nom}</div>
                  <div className="text-muted small">{selected.email}</div>
                </div>
              </div>
              <Tabs defaultActiveKey="info" id="driver-tabs" justify>
                <Tab eventKey="info" title="Informations">
                  <div className="row g-3 pt-3">
                    <div className="col-md-6">
                      <div className="text-muted small">Téléphone</div>
                      <div>{selected.tel || '—'}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Statut</div>
                      <div>{selected.actif ? <Badge bg="success">Actif</Badge> : <Badge bg="secondary">Bloqué</Badge>}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-muted small">Créé le</div>
                      <div>{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="trips" title="Trajets">
                  <div className="pt-3 text-muted small">Historique des trajets à venir (à intégrer)</div>
                </Tab>
                <Tab eventKey="reviews" title="Évaluations">
                  <div className="pt-3 d-flex align-items-center gap-2 text-warning">
                    <Star size={16} fill="#f5c518" color="#f5c518" />
                    <span className="text-muted small">Aucune donnée — intégration future</span>
                  </div>
                </Tab>
              </Tabs>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
