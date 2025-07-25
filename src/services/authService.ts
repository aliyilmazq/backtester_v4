import api from './api';
import { User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async validateToken(token: string): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/auth/refresh');
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  checkPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  }

  canManageStrategies(user: User | null): boolean {
    return this.checkPermission(user, 'manage_strategies');
  }

  canExecuteTrades(user: User | null): boolean {
    return this.checkPermission(user, 'execute_trades');
  }

  canViewReports(user: User | null): boolean {
    return this.checkPermission(user, 'view_reports');
  }
}

export default new AuthService();