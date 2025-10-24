import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Form, InputGroup, Badge, Table, Modal, Tabs, Tab, Pagination } from 'react-bootstrap';
import { Search, Eye, Trash2, MapPin, Calendar as CalIcon, Users as UsersIcon } from 'lucide-react';
import { TrajetsAPI } from '../../services/api';

type TrajetAffichage = {
  id: string;
  depart: string;
  arrivee: string;
  chauffeur: string;
  avatarChauffeur: string;
  date: string;
  heure: string;
  prix: number;
  placesTotales: number;
  placesReservees: number;
  statut: 'available' | 'in_progress' | 'completed' | 'cancelled';
};

type ReservationAffichage = {
  id: string;
  trajetId: string;
  itineraire: string;
  client: string;
  avatarClient: string;
  chauffeur: string;
  avatarChauffeur: string;
  dateTrajet: string;
  montant: number;
  nbPlaces: number;
  statut: 'pending' | 'confirmed' | 'completed';
  referencePaiement: string;
};

export function TripsReservations() {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('all');
  const [elementSelectionne, setElementSelectionne] = useState<ReservationAffichage | null>(null);
  const [dialogueOuvert, setDialogueOuvert] = useState(false);
  const [pageCouranteTrajets, setPageCouranteTrajets] = useState(1);
  const [pageCouranteReservations, setPageCouranteReservations] = useState(1);
  const elementsParPage = 3;
  const [chargementTrajets, setChargementTrajets] = useState(false);
  const [erreur, setErreur] = useState<string>('');

  const [trajets, setTrajets] = useState<TrajetAffichage[]>([]);
  const [reservations, setReservations] = useState<ReservationAffichage[]>([]);

  // Charger les trajets depuis le backend
  useEffect(() => {
    let mounted = true;
    const chargerTrajets = async () => {
      setChargementTrajets(true);
      setErreur('');
      try {
        const resp = await TrajetsAPI.list({ all: 'true' });
        const arr: any[] = Array.isArray(resp) ? resp : ((resp as any)?.trajets || (resp as any)?.items || []);
        const mapped: TrajetAffichage[] = (arr || []).map((t: any) => {
          const total = t.nbPlacesTotal ?? t.nbPlacesDisponibles ?? 0;
          const dispo = t.nbPlacesDisponibles ?? 0;
          const booked = total && dispo >= 0 ? Math.max(0, total - dispo) : (t.nbPlacesReservees ?? 0);
          const mapStatus = (s: any): TrajetAffichage['statut'] => {
            const v = String(s || '').toUpperCase();
            if (v === 'DISPONIBLE') return 'available';
            if (v === 'EN_COURS') return 'in_progress';
            if (v === 'TERMINE' || v === 'TERMINÉ' || v === 'TERMINEE' || v === 'TERMINÉE') return 'completed';
            if (v === 'ANNULE' || v === 'ANNULÉ' || v === 'ANNULEE' || v === 'ANNULÉE') return 'cancelled';
            return 'available';
          };
          return {
            id: t._id,
            depart: t.depart || '',
            arrivee: t.arrivee || '',
            chauffeur: t.chauffeur ? `${t.chauffeur?.prenom || ''} ${t.chauffeur?.nom || ''}`.trim() : '—',
            avatarChauffeur: t.chauffeur ? `${(t.chauffeur?.prenom || '').charAt(0)}${(t.chauffeur?.nom || '').charAt(0)}`.toUpperCase() : 'TR',
            date: t.dateDebut ? new Date(t.dateDebut).toLocaleDateString() : '—',
            heure: t.dateDebut ? new Date(t.dateDebut).toLocaleTimeString() : '',
            prix: t.prixParPlace || 0,
            placesTotales: total || 0,
            placesReservees: booked || 0,
            statut: mapStatus(t.statut),
          } as TrajetAffichage;
        });
        if (mounted) setTrajets(mapped);
      } catch (e: any) {
        if (mounted) setErreur(e?.message || 'Erreur lors du chargement des trajets');
      } finally {
        if (mounted) setChargementTrajets(false);
      }
    };
    chargerTrajets();
    return () => { mounted = false; };
  }, []);

  const afficherReservations = async (trajetId: string, itineraire: string, nomChauffeur: string, avatarChauffeur: string) => {
    try {
      const resp = await TrajetsAPI.reservationsByTrajet(trajetId);
      const list = (resp as any)?.reservations || [];
      const mapped: ReservationAffichage[] = list.map((r: any) => ({
        id: r._id,
        trajetId: trajetId,
        itineraire: itineraire,
        client: r.client ? `${r.client?.prenom || ''} ${r.client?.nom || ''}`.trim() : '—',
        avatarClient: r.client ? `${(r.client?.prenom || '').charAt(0)}${(r.client?.nom || '').charAt(0)}`.toUpperCase() : 'CL',
        chauffeur: nomChauffeur,
        avatarChauffeur: avatarChauffeur,
        dateTrajet: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—',
        montant: r.montantTotal ?? r.montant ?? 0,
        nbPlaces: r.nbPlaces ?? 0,
        statut: (() => {
          const v = String(r.etat || '').toUpperCase();
          if (v === 'CONFIRMEE' || v === 'CONFIRMÉE') return 'confirmed';
          if (v === 'TERMINEE' || v === 'TERMINÉE') return 'completed';
          return 'pending';
        })(),
        referencePaiement: r.referencePaiement || r._id || '',
      }));
      setReservations(mapped);
      setElementSelectionne(mapped[0] || null);
      setDialogueOuvert(true);
    } catch (e: any) {
      setErreur(e?.message || 'Impossible de charger les réservations du trajet');
    }
  };

  const supprimerTrajet = async (trajetId: string) => {
    if (!confirm('Supprimer ce trajet ?')) return;
    try {
      await TrajetsAPI.delete(trajetId);
      setTrajets((prev) => prev.filter((t) => t.id !== trajetId));
    } catch (e: any) {
      setErreur(e?.message || 'Suppression impossible');
    }
  };

  const badgeStatut = (statut: string) => {
    const statusConfig: Record<string, { label: string; variant: string }> = {
      available: { label: '🟢 Disponible', variant: 'success' },
      in_progress: { label: '🔵 En cours', variant: 'primary' },
      completed: { label: '✓ Terminé', variant: 'secondary' },
      cancelled: { label: '🔴 Annulé', variant: 'danger' },
      pending: { label: '🟡 En attente', variant: 'warning' },
      confirmed: { label: '🟢 Confirmé', variant: 'success' },
    };
    const key = String(statut || '').toLowerCase();
    const cfg = statusConfig[key] || { label: statut || '—', variant: 'secondary' };
    return <Badge bg={cfg.variant as any}>{cfg.label}</Badge>;
  };

  const trajetsFiltres = useMemo(() => {
    return trajets.filter((t) => {
      const texte = `${t.id} ${t.depart} ${t.arrivee} ${t.chauffeur}`.toLowerCase();
      const matchTxt = texte.includes(recherche.toLowerCase());
      const matchStatut = filtreStatut === 'all' || t.statut === filtreStatut;
      return matchTxt && matchStatut;
    });
  }, [trajets, recherche, filtreStatut]);

  const reservationsFiltrees = useMemo(() => {
    return reservations.filter((r) => {
      const texte = `${r.id} ${r.itineraire} ${r.client} ${r.chauffeur}`.toLowerCase();
      const matchTxt = texte.includes(recherche.toLowerCase());
      const matchStatut = filtreStatut === 'all' || r.statut === filtreStatut;
      return matchTxt && matchStatut;
    });
  }, [reservations, recherche, filtreStatut]);

  const totalPagesTrajets = Math.ceil(trajetsFiltres.length / elementsParPage) || 1;
  const totalPagesReservations = Math.ceil(reservationsFiltrees.length / elementsParPage) || 1;

  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="h5 mb-1">Trajets & Réservations</h2>
        <div className="text-muted small">Gérer tous les trajets et réservations</div>
      </div>

      <Tabs defaultActiveKey="trips" id="trips-res-tabs" className="mb-3">
        <Tab eventKey="trips" title="Tous les trajets">
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex flex-column flex-md-row gap-2">
                <form className="flex-grow-1" onSubmit={(e) => e.preventDefault()}>
                  <InputGroup>
                    <InputGroup.Text><Search size={16} /></InputGroup.Text>
                    <Form.Control placeholder="Rechercher un trajet..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                  </InputGroup>
                </form>
                <Form.Select style={{ maxWidth: 220 }} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="available">Disponible</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </Form.Select>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fw-semibold">Liste des trajets ({trajetsFiltres.length})</div>
                {erreur && <div className="text-danger small">{erreur}</div>}
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Trajet</th>
                      <th>Chauffeur</th>
                      <th>Date & Heure</th>
                      <th>Prix</th>
                      <th>Places</th>
                      <th>Statut</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chargementTrajets && trajetsFiltres.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">Chargement…</td>
                      </tr>
                    ) : trajetsFiltres.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">Aucun trajet</td>
                      </tr>
                    ) : trajetsFiltres.slice((pageCouranteTrajets - 1) * elementsParPage, pageCouranteTrajets * elementsParPage).map((t) => (
                      <tr key={t.id}>
                        <td className="font-monospace small">{t.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <MapPin size={16} color="#00853F" />
                            <span>{t.depart} → {t.arrivee}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar-circle bg-success text-white">{t.avatarChauffeur}</div>
                            <span>{t.chauffeur}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <CalIcon size={16} color="#6c757d" />
                            <div>
                              <div className="small">{t.date}</div>
                              <div className="text-muted small">{t.heure}</div>
                            </div>
                          </div>
                        </td>
                        <td>{Number(t.prix || 0).toLocaleString()} FCFA</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UsersIcon size={16} color="#6c757d" />
                            <span>{t.placesReservees}/{t.placesTotales}</span>
                          </div>
                        </td>
                        <td>{badgeStatut(t.statut)}</td>
                        <td className="text-end">
                          <Button size="sm" variant="light" className="me-2" onClick={() => afficherReservations(
                            t.id,
                            `${t.depart} → ${t.arrivee}`,
                            t.chauffeur,
                            t.avatarChauffeur
                          )}><Eye size={16} /></Button>
                          <Button size="sm" variant="outline-danger" onClick={() => supprimerTrajet(t.id)}><Trash2 size={16} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            {totalPagesTrajets > 1 && (
              <Card.Footer className="d-flex justify-content-center">
                <Pagination className="mb-0">
                  <Pagination.Prev onClick={() => setPageCouranteTrajets(Math.max(1, pageCouranteTrajets - 1))} disabled={pageCouranteTrajets === 1} />
                  {Array.from({ length: totalPagesTrajets }, (_, i) => i + 1).map((p) => (
                    <Pagination.Item key={p} active={p === pageCouranteTrajets} onClick={() => setPageCouranteTrajets(p)}>{p}</Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setPageCouranteTrajets(Math.min(totalPagesTrajets, pageCouranteTrajets + 1))} disabled={pageCouranteTrajets === totalPagesTrajets} />
                </Pagination>
              </Card.Footer>
            )}
          </Card>
        </Tab>

        <Tab eventKey="reservations" title="Réservations">
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex flex-column flex-md-row gap-2">
                <form className="flex-grow-1" onSubmit={(e) => e.preventDefault()}>
                  <InputGroup>
                    <InputGroup.Text><Search size={16} /></InputGroup.Text>
                    <Form.Control placeholder="Rechercher une réservation..." value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                  </InputGroup>
                </form>
                <Form.Select style={{ maxWidth: 220 }} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="completed">Terminé</option>
                </Form.Select>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fw-semibold">Liste des réservations ({reservationsFiltrees.length})</div>
                {erreur && <div className="text-danger small">{erreur}</div>}
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Trajet</th>
                      <th>Client</th>
                      <th>Chauffeur</th>
                      <th>Date du trajet</th>
                      <th>Montant</th>
                      <th>Places</th>
                      <th>Statut</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsFiltrees.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-4 text-muted">Aucune réservation</td>
                      </tr>
                    ) : reservationsFiltrees.slice((pageCouranteReservations - 1) * elementsParPage, pageCouranteReservations * elementsParPage).map((r) => (
                      <tr key={r.id}>
                        <td className="font-monospace small">{r.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <MapPin size={16} color="#00853F" />
                            <span className="small">{r.itineraire}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar-circle bg-primary text-white">{r.avatarClient}</div>
                            <span className="small">{r.client}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar-circle bg-success text-white">{r.avatarChauffeur}</div>
                            <span className="small">{r.chauffeur}</span>
                          </div>
                        </td>
                        <td>{r.dateTrajet}</td>
                        <td>{r.montant.toLocaleString()} FCFA</td>
                        <td>{r.nbPlaces}</td>
                        <td>{badgeStatut(r.statut)}</td>
                        <td className="text-end">
                          <Button size="sm" variant="light" onClick={() => { setElementSelectionne(r); setDialogueOuvert(true); }}>
                            <Eye size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            {totalPagesReservations > 1 && (
              <Card.Footer className="d-flex justify-content-center">
                <Pagination className="mb-0">
                  <Pagination.Prev onClick={() => setPageCouranteReservations(Math.max(1, pageCouranteReservations - 1))} disabled={pageCouranteReservations === 1} />
                  {Array.from({ length: totalPagesReservations }, (_, i) => i + 1).map((p) => (
                    <Pagination.Item key={p} active={p === pageCouranteReservations} onClick={() => setPageCouranteReservations(p)}>{p}</Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setPageCouranteReservations(Math.min(totalPagesReservations, pageCouranteReservations + 1))} disabled={pageCouranteReservations === totalPagesReservations} />
                </Pagination>
              </Card.Footer>
            )}
          </Card>
        </Tab>
      </Tabs>

      <Modal show={dialogueOuvert} onHide={() => setDialogueOuvert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!elementSelectionne ? null : (
            <div className="small">
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-muted">ID Réservation</div>
                  <div className="font-monospace">{elementSelectionne.id}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Référence paiement</div>
                  <div className="font-monospace">{elementSelectionne.referencePaiement}</div>
                </div>
                <div className="col-12">
                  <div className="text-muted">Trajet</div>
                  <div>{elementSelectionne.itineraire}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Client</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-circle bg-primary text-white">{elementSelectionne.avatarClient}</div>
                    <span>{elementSelectionne.client}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Chauffeur</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-circle bg-success text-white">{elementSelectionne.avatarChauffeur}</div>
                    <span>{elementSelectionne.chauffeur}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Date du trajet</div>
                  <div>{elementSelectionne.dateTrajet}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Nombre de places</div>
                  <div>{elementSelectionne.nbPlaces}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Montant total</div>
                  <div>{elementSelectionne.montant.toLocaleString()} FCFA</div>
                </div>
                <div className="col-6">
                  <div className="text-muted">Commission (15%)</div>
                  <div>{(elementSelectionne.montant * 0.15).toLocaleString()} FCFA</div>
                </div>
                <div className="col-12">
                  <div className="text-muted">Statut</div>
                  <div className="mt-1">{badgeStatut(elementSelectionne.statut)}</div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDialogueOuvert(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
