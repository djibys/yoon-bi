import { useState } from 'react';
import { Lock, Check } from 'lucide-react';

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
};

export default function Settings() {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof PasswordFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    setIsSuccess(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
      
      setIsSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  // Style commun pour les champs de saisie
  const inputStyle = {
    height: '45px',
    borderRadius: '0.35rem',
    border: '1px solid #d1d3e2',
    fontSize: '0.9rem',
    padding: '0.6rem 1rem',
    outline: 'none',
    boxShadow: 'none',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#198754',
      boxShadow: 'none'
    }
  };

  return (
    <div className="settings-container" style={{ padding: '20px' }}>
      <div className="card shadow-sm" style={{ maxWidth: '500px', margin: '0 auto', border: 'none', borderRadius: '10px' }}>
        <div className="card-header bg-white border-0 pt-4">
          <h2 className="h5 mb-0" style={{ color: '#333', fontWeight: '600' }}>
            Modifier le mot de passe
          </h2>
        </div>
          
        <div className="card-body pt-0">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2" role="alert" style={{ fontSize: '0.875rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
              </div>
            )}
            
            {isSuccess && (
              <div className="alert alert-success d-flex align-items-center py-2" role="alert" style={{ fontSize: '0.875rem' }}>
                <Check size={16} className="me-2" />
                <div>Mot de passe mis à jour avec succès</div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="form-label fw-medium" style={{ fontSize: '0.9rem', color: '#5a5c69' }}>
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#198754';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d3e2';
                }}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="form-label fw-medium" style={{ fontSize: '0.9rem', color: '#5a5c69' }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#198754';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d3e2';
                }}
              />
              <div className="form-text mt-1" style={{ fontSize: '0.8rem', color: '#858796' }}>
                Le mot de passe doit contenir au moins 8 caractères
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-medium" style={{ fontSize: '0.9rem', color: '#5a5c69' }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#198754';
                  e.target.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d3e2';
                }}
              />
            </div>
            
            <div className="d-flex justify-content-end mt-5">
              <button 
                type="submit" 
                className="btn px-4"
                disabled={isLoading}
                style={{
                  minWidth: '180px',
                  height: '45px',
                  backgroundColor: '#198754',
                  border: 'none',
                  borderRadius: '0.35rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 0.15rem 0.2rem rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#157347';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 0.3rem 0.5rem rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#198754';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0.15rem 0.2rem rgba(0, 0, 0, 0.1)';
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Enregistrement...</span>
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
