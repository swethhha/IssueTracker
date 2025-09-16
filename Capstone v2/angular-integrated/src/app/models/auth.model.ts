export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department?: string;
  position?: string;
}