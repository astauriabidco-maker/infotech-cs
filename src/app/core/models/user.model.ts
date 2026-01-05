export interface User {
  id: number;
  email: string;
  displayName: string;
  roles: Role[];
  createdAt: string;
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_SELLER = 'ROLE_SELLER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
