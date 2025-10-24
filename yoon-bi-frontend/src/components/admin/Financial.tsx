import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, FileText, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, Button, Form, InputGroup, Badge, Table, Pagination } from 'react-bootstrap';
import { AdminFinanceAPI, type Paiement, type TrajetEnAttente } from '../../services/api';

export function Financial() {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<'all' | 'success' | 'pending'>('all');
  const [filtrePeriode, setFiltrePeriode] = useState<'month' | 'quarter' | 'year' | 'custom'>('month');
  const [pageCourante, setPageCourante] = useState(1);
  const elementsParPage = 10;

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string>('');

  const [kpiTotalRevenus, setKpiTotalRevenus] = useState<number>(0);
  const [kpiCommission, setKpiCommission] = useState<number>(0);
  const [kpiVerseAuxChauffeurs, setKpiVerseAuxChauffeurs] = useState<number>(0);
  const [kpiEnAttente, setKpiEnAttente] = useState<number>(0);

  const [statsMoisTrajets, setStatsMoisTrajets] = useState<number>(0);
  const [statsMoisPrixTotal, setStatsMoisPrixTotal] = useState<number>(0);
  const [statsMoisCommission, setStatsMoisCommission] = useState<number>(0);
  const [statsMoisNet, setStatsMoisNet] = useState<number>(0);

  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [trajetsEnAttente, setTrajetsEnAttente] = useState<TrajetEnAttente[]>([]);

  // Charger KPI + stats
  useEffect(() => {
    let mounted = true;
    const chargerStats = async () => {
      try {
        setErreur('');
        const r = await AdminFinanceAPI.stats(filtrePeriode);
        const totalRevenue = Number(r?.kpi?.totalRevenue ?? 0);
        const commission = Number(r?.kpi?.commission ?? 0);
        const paidToDrivers = Number(r?.kpi?.paidToDrivers ?? (totalRevenue - commission));
        const pendingValidation = Number(r?.kpi?.pendingValidation ?? 0);
        const completedTrips = Number(r?.monthly?.completedTrips ?? 0);
        const totalTripPrice = Number(r?.monthly?.totalTripPrice ?? totalRevenue);
        const commissionMonth = Number(r?.monthly?.commission ?? commission);
        const netPaid = Number(r?.monthly?.netPaid ?? paidToDrivers);

        if (!mounted) return;
        setKpiTotalRevenus(totalRevenue);
        setKpiCommission(commission);
        setKpiVerseAuxChauffeurs(paidToDrivers);
        setKpiEnAttente(pendingValidation);
        setStatsMoisTrajets(completedTrips);
        setStatsMoisPrixTotal(totalTripPrice);
        setStatsMoisCommission(commissionMonth);
        setStatsMoisNet(netPaid);
      } catch (e: any) {
        if (!mounted) return;
        setErreur(e?.message || 'Erreur lors du chargement des statistiques');
      }
    };
    chargerStats();
    return () => { mounted = false; };
  }, [filtrePeriode]);

  // Charger paiements + trajets en attente
  useEffect(() => {
    let mounted = true;
    const chargerPaiements = async () => {
      try {
        setChargement(true);
        setErreur('');
        const r = await AdminFinanceAPI.payments({ status: filtreStatut, page: pageCourante, limit: elementsParPage, search: recherche });
        if (!mounted) return;
        setPaiements(r?.items || []);
        setTotalPages(r?.totalPages || 1);
      } catch (e: any) {
        if (!mounted) return;
        setErreur(e?.message || 'Erreur lors du chargement des paiements');
      } finally {
        if (mounted) setChargement(false);
      }
    };
    const chargerEnAttente = async () => {
      try {
        const r = await AdminFinanceAPI.pendingTrips();
        if (!mounted) return;
        setTrajetsEnAttente(r || []);
      } catch (e) {
        // silencieux
      }
    };
    chargerPaiements();
    chargerEnAttente();
    return () => { mounted = false; };
  }, [filtreStatut, pageCourante, elementsParPage, recherche]);

  const paiementsAffiches = useMemo(() => paiements, [paiements]);

  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="h5 mb-1">Gestion financière</h2>
        <div className="text-muted small">Suivi des revenus et paiements</div>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <Form.Select style={{ width: 220 }} value={filtrePeriode} onChange={(e) => setFiltrePeriode(e.target.value as any)}>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </Form.Select>
            </div>
            <div className="text-muted small">Période: {filtrePeriode}</div>
          </div>
        </Card.Body>
      </Card>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">Revenus totaux</div>
                  <div className="h5 mt-1 mb-0">{kpiTotalRevenus.toLocaleString()} FCFA</div>
                  <div className="d-flex align-items-center gap-1 text-success small mt-1"><TrendingUp size={14} /> —</div>
                </div>
                <div className="bg-primary p-2 rounded text-white"><DollarSign size={20} /></div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">Ma commission collectée</div>
                  <div className="h5 mt-1 mb-0">{kpiCommission.toLocaleString()} FCFA</div>
                  <div className="text-muted small mt-1">15% du total</div>
                </div>
                <div className="bg-success p-2 rounded text-white"><DollarSign size={20} /></div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">Versé aux chauffeurs</div>
                  <div className="h5 mt-1 mb-0">{kpiVerseAuxChauffeurs.toLocaleString()} FCFA</div>
                  <div className="text-muted small mt-1">{statsMoisTrajets} versements</div>
                </div>
                <div className="bg-purple p-2 rounded text-white" style={{ backgroundColor: '#6f42c1' }}><CheckCircle size={20} /></div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">En attente de validation</div>
                  <div className="h5 mt-1 mb-0">{kpiEnAttente.toLocaleString()} FCFA</div>
                  <div className="text-muted small mt-1">{trajetsEnAttente.length} trajets</div>
                </div>
                <div className="bg-warning p-2 rounded text-white"><Clock size={20} /></div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="mb-3">
        <Card.Header>
          <div className="h6 mb-0">Statistiques du mois</div>
        </Card.Header>
        <Card.Body>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="text-muted small">Trajets effectués</div>
                <div className="h5 mb-0 mt-1">{statsMoisTrajets}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="text-muted small">Prix total des trajets</div>
                <div className="h6 mb-0 mt-1">{statsMoisPrixTotal.toLocaleString()} FCFA</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="text-muted small">Commission plateforme (15%)</div>
                <div className="h6 mb-0 mt-1 text-success">{statsMoisCommission.toLocaleString()} FCFA</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="text-muted small">Net versé</div>
                <div className="h6 mb-0 mt-1">{statsMoisNet.toLocaleString()} FCFA</div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 rounded" style={{ background: '#e7f1ff', border: '1px solid #cfe2ff' }}>
            <div className="small" style={{ color: '#084298' }}>
              💡 Les paiements sont versés automatiquement sur le compte des chauffeurs après validation de chaque trajet par le client
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>
          <div className="h6 mb-1 d-flex align-items-center gap-2"><Clock size={16} className="text-warning" />En attente de validation client</div>
          <div className="text-muted small">Ces trajets sont payés mais pas encore validés</div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-2">
            {trajetsEnAttente.map((trip, idx) => (
              <div key={idx} className="p-3 rounded" style={{ background: '#fff3cd', border: '1px solid #ffe69c' }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div>{trip.trip}</div>
                    <div className="d-flex gap-3 text-muted small mt-1">
                      <div>Client: {trip.client}</div>
                      <div>Chauffeur: {trip.driver}</div>
                    </div>
                    <div className="text-muted small mt-1">Date du trajet: {trip.tripDate}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{trip.amount.toLocaleString()} FCFA</div>
                    <Badge bg="warning" text="dark" className="mt-1">⏳ En attente</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center small">
            Total en attente: <strong>{trajetsEnAttente.reduce((s, t) => s + t.amount, 0).toLocaleString()} FCFA</strong>
          </div>
        </Card.Body>
      </Card>

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
