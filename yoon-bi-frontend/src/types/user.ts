// Types d'utilisateur partagés dans l'application
export interface User {
  id: string;
  _id?: string;
  email: string;
  typeUtilisateur: string;
  prenom?: string;
  nom?: string;
  photo?: string;
  tel?: string;
  actif?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
