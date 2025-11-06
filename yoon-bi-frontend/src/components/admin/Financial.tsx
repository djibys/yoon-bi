import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, FileText } from 'lucide-react';
import { Card, Button, Form, InputGroup, Badge, Table, Pagination } from 'react-bootstrap';
import { AdminFinanceAPI, type Paiement } from '../../services/api';

export function Financial() {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<'all' | 'success' | 'pending'>('all');
  const [pageCourante, setPageCourante] = useState(1);
  const elementsParPage = 10;

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string>('');

  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Charger paiements
  useEffect(() => {
    let mounted = true;
    const chargerPaiements = async () => {
      try {
        console.log('[FINANCE] Chargement paiements:', { filtreStatut, pageCourante, recherche });
        setChargement(true);
        setErreur('');
        
        const r = await AdminFinanceAPI.payments({ 
          status: filtreStatut, 
          page: pageCourante, 
          limit: elementsParPage, 
          search: recherche 
        });
        
        console.log('[FINANCE] Paiements reçus:', r);
        
        if (!mounted) return;
        setPaiements(r?.items || []);
        setTotalPages(r?.totalPages || 1);
        console.log('[FINANCE] ✓ Paiements chargés:', r?.items?.length || 0);
      } catch (e: any) {
        console.error('[FINANCE] ✗ Erreur paiements:', e);
        if (!mounted) return;
        setErreur(e?.message || 'Erreur lors du chargement des paiements');
      } finally {
        if (mounted) setChargement(false);
      }
    };
    
    chargerPaiements();
    return () => { mounted = false; };
  }, [filtreStatut, pageCourante, elementsParPage, recherche]);

  const paiementsAffiches = useMemo(() => paiements, [paiements]);

  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="h5 mb-1">Gestion financière</h2>
        <div className="text-muted small">Historique des versements</div>
      </div>

      {erreur && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
          <span>⚠️</span>
          <div>
            <strong>Erreur de chargement:</strong> {erreur}
            <div className="small mt-1">Vérifiez que le serveur backend est démarré et accessible.</div>
          </div>
        </div>
      )}

      <Card>
        <Card.Header>
          <div className="d-flex align-items-center justify-content-between">
            <div className="h6 mb-0">Historique des versements automatiques</div>
            <Button variant="outline" className="d-flex align-items-center gap-2"><FileText size={16} />Exporter</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <form className="flex-grow-1" onSubmit={(e) => e.preventDefault()}>
              <InputGroup>
                <InputGroup.Text><Search size={16} /></InputGroup.Text>
                <Form.Control placeholder="Rechercher par chauffeur, référence ou client..." value={recherche} onChange={(e) => { setPageCourante(1); setRecherche(e.target.value); }} />
              </InputGroup>
            </form>
            <Form.Select style={{ maxWidth: 220 }} value={filtreStatut} onChange={(e) => { setPageCourante(1); setFiltreStatut(e.target.value as any); }}>
              <option value="all">Tous les statuts</option>
              <option value="success">Versé avec succès</option>
              <option value="pending">En cours</option>
            </Form.Select>
          </div>

          {erreur && <div className="text-danger small mb-2">{erreur}</div>}

          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Référence</th>
                  <th>Chauffeur</th>
                  <th>Trajet</th>
                  <th>Client</th>
                  <th>Prix total</th>
                  <th>Commission</th>
                  <th>Montant versé</th>
                  <th>Mode</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chargement && paiementsAffiches.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-3 text-muted">Chargement…</td>
                  </tr>
                ) : paiementsAffiches.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-3 text-muted">Aucun versement</td>
                  </tr>
                ) : paiementsAffiches.map((p) => (
                  <tr key={p.id}>
                    <td className="small">{p.date}</td>
                    <td className="font-monospace small">{p.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-circle bg-success text-white">{p.driverAvatar || (p.driver?.split(' ').map(s=>s[0]).join('').toUpperCase().slice(0,2) || 'DR')}</div>
                        <span className="small">{p.driver}</span>
                      </div>
                    </td>
                    <td className="small">{p.trip}</td>
                    <td className="small">{p.client}</td>
                    <td>{p.totalPrice.toLocaleString()} FCFA</td>
                    <td className="text-danger">-{p.commission.toLocaleString()} FCFA</td>
                    <td className="text-success">{p.amountPaid.toLocaleString()} FCFA</td>
                    <td>
                      <div className="small">{p.paymentMethod}</div>
                      {p.phone && <div className="text-muted small">{p.phone}</div>}
                    </td>
                    <td>
                      {p.status === 'success' ? (
                        <Badge bg="success" className="bg-success-subtle text-success-emphasis">✅ Versé</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">⏳ En cours</Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" variant="light"><Eye size={16} /></Button>
                        <Button size="sm" variant="light"><FileText size={16} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination className="mb-0">
                <Pagination.Prev onClick={() => setPageCourante(Math.max(1, pageCourante - 1))} disabled={pageCourante === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item key={p} active={p === pageCourante} onClick={() => setPageCourante(p)}>{p}</Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPageCourante(Math.min(totalPages, pageCourante + 1))} disabled={pageCourante === totalPages} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
