import { useState } from 'react';
import { Search, FileText, AlertTriangle, UserX, MoreVertical } from 'lucide-react';

export default function GestionSignalements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const signalements = [
    {
      id: 'SIG-2025-001',
      date: '18/10/2025 15:30',
      type: 'Tarif abusif',
      typeIcon: '💰',
      client: { name: 'Aminata Diallo', initials: 'AD', color: 'primary' },
      chauffeur: { name: 'Ibrahima Ba', initials: 'IB', color: 'success', alerts: '2 signalements précédents' },
      trajet: 'Dakar → Thiès',
      dateDu: '18/10/2025'
    },
    {
      id: 'SIG-2025-002',
      date: '17/10/2025 09:15',
      type: 'Comportement',
      typeIcon: '⚠️',
      client: { name: 'Fatou Sow', initials: 'FS', color: 'info' },
      chauffeur: { name: 'Moussa Ndiaye', initials: 'MN', color: 'success', alerts: '' },
      trajet: 'Dakar → Saint-Louis',
      dateDu: '17/10/2025'
    },
    {
      id: 'SIG-2025-003',
      date: '16/10/2025 14:20',
      type: 'Retard',
      typeIcon: '⏰',
      client: { name: 'Ousmane Fall', initials: 'OF', color: 'warning' },
      chauffeur: { name: 'Abdou Sarr', initials: 'AS', color: 'success', alerts: '' },
      trajet: 'Dakar → Mbour',
      dateDu: '16/10/2025'
    },
    {
      id: 'SIG-2025-004',
      date: '15/10/2025 11:45',
      type: 'Véhicule',
      typeIcon: '🚗',
      client: { name: 'Mariama Sy', initials: 'MS', color: 'secondary' },
      chauffeur: { name: 'Cheikh Gueye', initials: 'CG', color: 'success', alerts: '1 signalement précédent' },
      trajet: 'Dakar → Kaolack',
      dateDu: '15/10/2025'
    },
    {
      id: 'SIG-2025-005',
      date: '14/10/2025 16:30',
      type: 'Annulation',
      typeIcon: '❌',
      client: { name: 'Ibrahima Diop', initials: 'ID', color: 'danger' },
      chauffeur: { name: 'Mamadou Kane', initials: 'MK', color: 'success', alerts: '' },
      trajet: 'Dakar → Tambacounda',
      dateDu: '14/10/2025'
    }
  ];

  const filteredSignalements = signalements.filter(sig => {
    const matchesSearch = sig.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sig.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sig.chauffeur.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sig.type === typeFilter;
    const matchesStatus = statusFilter === 'all';
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSignalements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSignalements = filteredSignalements.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand les filtres changent
  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>, 
    value: string
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid py-4">
      {/* En-tête */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="mb-1">Gestion des signalements</h3>
          <p className="text-muted mb-0">Gérer les signalements des utilisateurs</p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par client, chauffeur ou référence..."
                      value={searchTerm}
                      onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
                  >
                    <option value="all">Tous les types</option>
                    <option value="Tarif abusif">Tarif abusif</option>
                    <option value="Comportement">Comportement</option>
                    <option value="Retard">Retard</option>
                    <option value="Véhicule">Véhicule</option>
                    <option value="Annulation">Annulation</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="resolved">Résolu</option>
                    <option value="rejected">Rejeté</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Liste des signalements ({filteredSignalements.length})</h6>
              <button className="btn btn-sm btn-outline-dark mb-0">
                <FileText size={16} className="me-1" />
                Exporter
              </button>
            </div>
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">
                        ID
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Date
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Type
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Client
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Chauffeur
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Trajet
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Date du trajet
                      </th>
                      <th className="text-secondary opacity-7"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSignalements.map((sig) => (
                      <tr key={sig.id}>
                        <td className="ps-4">
                          <p className="text-xs font-weight-bold mb-0">{sig.id}</p>
                        </td>
                        <td>
                          <p className="text-xs text-secondary mb-0">{sig.date}</p>
                        </td>
                        <td>
                          <span className="badge badge-sm bg-gradient-warning">
                            {sig.typeIcon} {sig.type}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={`avatar avatar-sm me-2 bg-gradient-${sig.client.color} rounded-circle d-flex align-items-center justify-content-center`}>
                              <span className="text-white text-xs font-weight-bold">{sig.client.initials}</span>
                            </div>
                            <span className="text-xs font-weight-bold">{sig.client.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-1">
                              <div className={`avatar avatar-sm me-2 bg-gradient-${sig.chauffeur.color} rounded-circle d-flex align-items-center justify-content-center`}>
                                <span className="text-white text-xs font-weight-bold">{sig.chauffeur.initials}</span>
                              </div>
                              <span className="text-xs font-weight-bold">{sig.chauffeur.name}</span>
                            </div>
                            {sig.chauffeur.alerts && (
                              <small className="text-danger text-xxs ms-5">{sig.chauffeur.alerts}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <p className="text-xs text-secondary mb-0">{sig.trajet}</p>
                        </td>
                        <td>
                          <p className="text-xs text-secondary mb-0">{sig.dateDu}</p>
                        </td>
                        <td className="align-middle text-center">
                          <button className="btn btn-link text-secondary mb-0 p-1">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer">
                <div className="d-flex flex-column align-items-center">
                  <div className="text-sm text-secondary mb-2">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <nav aria-label="Pagination">
                    <ul className="pagination pagination-sm mb-0" style={{ gap: '10px' }}>
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          &lt;
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li 
                          key={index + 1} 
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                            style={{ 
                              color: currentPage === index + 1 ? '#fff' : '#198754',
                              backgroundColor: currentPage === index + 1 ? '#198754' : 'transparent',
                              borderColor: '#198754'
                            }}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          &gt;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}