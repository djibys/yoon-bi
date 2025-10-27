import { useState } from 'react';
import { User, Mail, Phone, Upload, Lock, Bell, Moon, Globe, Palette, Shield } from 'lucide-react';

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  initials: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  twoFactorAuth: boolean;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  
  const userData: UserData = {
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@yoon-bi.sn',
    phone: '+221 77 123 45 67',
    initials: 'AP',
    theme: 'light',
    notifications: true,
    language: 'fr',
    twoFactorAuth: false
  };

  const [formData, setFormData] = useState<UserData>(userData);

  const handleInputChange = (field: keyof UserData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Logique de sauvegarde
    setIsEditing(false);
  };

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container">
        {/* En-tête */}
        <div className="mb-4">
          <h1 className="h2 mb-2">Mon Profil</h1>
          <p className="text-muted">Gérez vos informations personnelles</p>
        </div>

        <div className="row g-4">
          {/* Carte Photo de profil */}
          <div className="col-lg-4 d-flex">
            <div className="card w-100">
              <div className="card-body text-center">
                <h2 className="h5 card-title">Photo de profil</h2>
                <p className="text-muted small mb-4">Cliquez pour modifier votre photo</p>
                
                <div className="d-flex flex-column align-items-center">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-3" 
                       style={{width: '160px', height: '160px', fontSize: '3rem'}}>
                    {userData.initials}
                  </div>
                  
                  <p className="text-muted small mb-4">JPG, PNG ou GIF (MAX. 2MB)</p>
                  
                  <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                    <Upload size={16} />
                    Télécharger une photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Informations personnelles */}
          <div className="col-lg-8 d-flex">
            <div className="card w-100">
              <div className="card-body d-flex flex-column h-100">
                <div className="mb-4">
                  <h2 className="h5 card-title mb-1">Informations personnelles</h2>
                  <p className="text-muted small mb-4">Mettez à jour vos informations de compte</p>
                </div>
                
                <div className="flex-grow-1">
                  <div className="row">
                  {/* Prénom */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Prénom
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <User size={18} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Nom */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Nom
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <User size={18} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={18} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Téléphone
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Phone size={18} className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                  </div>
                </div>
                
                <div className="mt-4 text-end">
                  <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="btn btn-dark px-4"
                  >
                    {isEditing ? 'Enregistrer les modifications' : 'Modifier les informations'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}