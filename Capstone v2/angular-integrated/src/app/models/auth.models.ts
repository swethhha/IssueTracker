export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  expiration: Date;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  department: string;
  role: EmployeeRole;
}

export enum EmployeeRole {
  Employee = 'Employee',
  Manager = 'Manager',
  FinanceAdmin = 'FinanceAdmin',
  Admin = 'Admin'
}