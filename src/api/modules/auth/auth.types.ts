/**
 * Auth module types
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface StoredSession {
  user: User;
  token: string;
  expiresAt: number;
  createdAt: number;
}
