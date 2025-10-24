import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { AdminUsersAPI, type Utilisateur } from '../services/api';

export function Users() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminUsersAPI.list(page, limit, search || undefined);
      setUsers(res.items || []);
      setTotalPages(res.totalPages || 1);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleBlockToggle = async (u: Utilisateur) => {
    try {
      setLoading(true);
      if (u.actif) await AdminUsersAPI.block(u._id);
      else await AdminUsersAPI.unblock(u._id);
      await fetchUsers();
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
          <h2 className="h5 mb-1">Utilisateurs</h2>
          <div className="text-muted small">Gestion des comptes de la plateforme</div>
        </div>
        <form onSubmit={onSearchSubmit} className="d-inline-block">
          <InputGroup>
            <Form.Control
              placeholder="Rechercher (nom, prénom, email, téléphone)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" variant="primary">Rechercher</Button>
          </InputGroup>
        </form>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4"><Spinner animation="border" size="sm" className="me-2"/>Chargement…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">Aucun utilisateur</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-circle bg-primary text-white">{`${(u.prenom||'').charAt(0)}${(u.nom||'').charAt(0)}`.toUpperCase()}</div>
                      <div>
                        <div className="fw-semibold small">{u.prenom} {u.nom}</div>
                        <div className="text-muted small">{u._id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.tel}</td>
                  <td>
                    {u.actif ? <Badge bg="success">Actif</Badge> : <Badge bg="secondary">Bloqué</Badge>}
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant={u.actif ? 'outline-danger' : 'outline-success'}
                      onClick={() => handleBlockToggle(u)}
                      disabled={loading}
                    >
                      {u.actif ? 'Bloquer' : 'Débloquer'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination className="mb-0">
            <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
            {paginationItems.map((p) => (
              <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
          </Pagination>
        </div>
      )}
    </div>
  );
}
