export type ParametresHttp = Record<string, string | number | boolean | undefined | null>;

const API_PREFIX = (import.meta as any)?.env?.VITE_API_PREFIX ?? '/api';
const ADMIN_PREFIX = (import.meta as any)?.env?.VITE_API_ADMIN_PREFIX ?? '/admin';

function construireRequete(params?: ParametresHttp) {
  if (!params) return '';
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
}

async function delApi<T>(chemin: string): Promise<T> {
  const url = `${API_PREFIX}${chemin}`;
  const res = await fetch(url, { method: 'DELETE', headers: entetesAuthentification() });
  if (!res.ok) {
    const txt = await safeText(res);
    throw new Error(`HTTP ${res.status} for ${url}${txt ? ` — ${txt}` : ''}`);
  }
  try { return await res.json() as T; } catch { return undefined as unknown as T; }
}

function entetesAuthentification() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function getApi<T>(chemin: string, params?: ParametresHttp): Promise<T> {
  const url = `${API_PREFIX}${chemin}${construireRequete(params)}`;
  console.log('[API GET]', url);
  
  try {
    const res = await fetch(url, { headers: entetesAuthentification() });
    console.log('[API GET] Statut:', res.status, url);
    
    if (!res.ok) {
      const txt = await safeText(res);
      console.error('[API GET] Erreur:', res.status, txt, url);
      throw new Error(`HTTP ${res.status} for ${url}${txt ? ` — ${txt}` : ''}`);
    }
    
    const data = await res.json() as T;
    console.log('[API GET] ✓ Succès:', url, data);
    return data;
  } catch (error) {
    console.error('[API GET] ✗ Exception:', error, url);
    throw error;
  }
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ''; }
}

async function putApi<T>(chemin: string, body?: any): Promise<T> {
  const url = `${API_PREFIX}${chemin}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: entetesAuthentification(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await safeText(res);
    throw new Error(`HTTP ${res.status} for ${url}${txt ? ` — ${txt}` : ''}`);
  }
  try { return await res.json() as T; } catch { return undefined as unknown as T; }
}

export type ResumeTableauDeBord = {
  utilisateursTotaux?: number | string;
  trajetsPublies?: number | string;
  reservations?: number | string;
  commissionCollectee?: number | string;
  tendanceUtilisateurs?: string;
  tendanceTrajets?: string;
  tendanceReservations?: string;
  tendanceCommission?: string;
};

export type StatistiqueTableauDeBord = { libelle: string; valeur: string };

export type Activite = { type: string; title: string; name: string; time: string };

export type ActivitesPaginees = { items: Activite[]; totalPages?: number; total?: number };

export const TableauDeBordAPI = {
  resume: async () => {
    const r = await getApi<any>(`${ADMIN_PREFIX}/statistics`);
    const stats = r?.stats || {};
    const revenusTotal = Array.isArray(stats.revenus) && stats.revenus[0]?.total ? stats.revenus[0].total : 0;
    const mapped: ResumeTableauDeBord = {
      utilisateursTotaux: stats.utilisateurs?.total ?? '—',
      trajetsPublies: stats.trajets?.total ?? '—',
      reservations: stats.reservations?.total ?? '—',
      commissionCollectee: typeof revenusTotal === 'number' ? `${revenusTotal} FCFA` : revenusTotal,
      tendanceUtilisateurs: '+0%',
      tendanceTrajets: '+0%',
      tendanceReservations: '+0%',
      tendanceCommission: '+0%',
    };
    return mapped;
  },
  statistiques: async () => {
    const r = await getApi<any>(`${ADMIN_PREFIX}/statistics`);
    const s = r?.stats || {};
    const list: StatistiqueTableauDeBord[] = [
      { libelle: 'Nombre de clients', valeur: String(s.utilisateurs?.clients ?? '—') },
      { libelle: 'Nombre de chauffeurs', valeur: String(s.utilisateurs?.chauffeurs ?? '—') },
      { libelle: 'Trajets actifs', valeur: String((s.trajets?.disponibles ?? 0) + (s.trajets?.enCours ?? 0)) },
      { libelle: 'Revenus ce mois', valeur: String((Array.isArray(s.revenus) && s.revenus[0]?.total) ? `${s.revenus[0].total} FCFA` : '—') },
    ];
    return list;
  },
  activites: async (_page: number, _taillePage: number) => {
    return { items: [], totalPages: 1, total: 0 } as ActivitesPaginees;
  },
};

// =================== Reports (Admin) ===================
export type ReportClient = { name: string; initials: string; color: string };
export type ReportChauffeur = { name: string; initials: string; color: string; alerts?: string };
export type ReportItem = {
  id: string;
  date: string;
  type: string;
  typeIcon?: string;
  client: ReportClient;
  chauffeur: ReportChauffeur;
  trajet: string;
  dateDu: string;
  status?: 'pending' | 'resolved' | 'rejected';
  description?: string;
};

export type ListeReports = {
  items: ReportItem[];
  total: number;
  totalPages: number;
  page: number;
};

export const AdminReportsAPI = {
  list: (params: { page?: number; limit?: number; search?: string; type?: string; status?: string }) =>
    getApi<ListeReports>(`${ADMIN_PREFIX}/reports`, params),
  resolve: (id: string) => putApi<{ success: boolean; item: ReportItem }>(`${ADMIN_PREFIX}/reports/${id}/resolve`),
  reject: (id: string) => putApi<{ success: boolean; item: ReportItem }>(`${ADMIN_PREFIX}/reports/${id}/reject`),
};

export type Utilisateur = {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  tel: string;
  actif: boolean;
  createdAt?: string;
  typeUtilisateur?: 'ADMIN' | 'CLIENT' | 'CHAUFFEUR';
  statutValidation?: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  numPermis?: string;
  dateValiditePermis?: string;
  vehicule?: {
    typeVehicule?: string;
    marque?: string;
    modele?: string;
    immatriculation?: string;
    nombrePlaces?: number;
    couleur?: string;
  };
};

export type ListeUtilisateurs = {
  success: boolean;
  items: Utilisateur[];
  total: number;
  totalPages: number;
  page: number;
};

export const AdminUsersAPI = {
  list: (page = 1, limit = 10, search?: string, type?: 'ADMIN' | 'CLIENT' | 'CHAUFFEUR') =>
    getApi<ListeUtilisateurs>(`${ADMIN_PREFIX}/users`, { page, limit, search, type }),
  block: (id: string) => putApi<{ success: boolean; user: Utilisateur }>(`${ADMIN_PREFIX}/users/${id}/block`),
  unblock: (id: string) => putApi<{ success: boolean; user: Utilisateur }>(`${ADMIN_PREFIX}/users/${id}/unblock`),
  getPendingDrivers: () => getApi<{ success: boolean; count: number; chauffeurs: Utilisateur[] }>(`${ADMIN_PREFIX}/chauffeurs/pending`),
  validateDriver: (id: string, decision: 'VALIDE' | 'REJETE') => 
    putApi<{ success: boolean; message: string; chauffeur: Utilisateur }>(`${ADMIN_PREFIX}/chauffeurs/${id}/validate`, { decision }),
};

export type Trajet = {
  _id: string;
  depart?: string;
  arrivee?: string;
  dateDebut?: string;
  prixParPlace?: number;
  nbPlacesDisponibles?: number;
  statut?: string;
  chauffeur?: any;
};

export type ListeTrajets = { success?: boolean; items?: Trajet[] } | Trajet[];

export type ReservationTrajet = {
  _id: string;
  trajetId: string;
  client?: any;
  nbPlaces?: number;
  montant?: number;
  createdAt?: string;
  referencePaiement?: string;
};

export const TrajetsAPI = {
  list: (params?: ParametresHttp) => getApi<ListeTrajets>(`/trajets`, params),
  delete: (id: string) => delApi<{ success: boolean; message?: string }>(`/trajets/${id}`),
  reservationsByTrajet: (trajetId: string) => getApi<{ success?: boolean; reservations?: ReservationTrajet[] }>(`/reservations/trajet/${trajetId}`),
};

// =================== Finance (Admin) ===================
export type Paiement = {
  id: string;
  date: string;
  driver: string;
  driverAvatar?: string;
  trip: string;
  client: string;
  totalPrice: number;
  commission: number;
  amountPaid: number;
  paymentMethod: string;
  phone?: string;
  status: 'success' | 'pending';
};

export type ListePaiements = {
  items: Paiement[];
  total: number;
  totalPages: number;
  page: number;
};

export type TrajetEnAttente = {
  trip: string;
  client: string;
  driver: string;
  tripDate: string;
  amount: number;
};

export const AdminFinanceAPI = {
  stats: (period: 'month' | 'quarter' | 'year' | 'custom', from?: string, to?: string) =>
    getApi<any>(`${ADMIN_PREFIX}/finance/stats`, { period, from, to }),

  payments: (params: { status?: 'all' | 'success' | 'pending'; page?: number; limit?: number; search?: string }) =>
    getApi<ListePaiements>(`${ADMIN_PREFIX}/finance/payments`, params),

  pendingTrips: async () => {
    const r = await getApi<{ success?: boolean; items?: TrajetEnAttente[] }>(
      `${ADMIN_PREFIX}/finance/pending-trips`
    );
    return r?.items ?? [];
  },
};
