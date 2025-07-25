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
    // Mock authentication for demo
    const mockUsers = [
      {
        email: 'pm@example.com',
        password: 'password123',
        user: {
          id: '1',
          email: 'pm@example.com',
          name: 'Portfolio Manager',
          role: 'portfolio_manager' as const,
          permissions: ['view_dashboard', 'manage_strategies', 'run_backtest', 'view_analytics', 'execute_trades', 'view_reports']
        }
      },
      {
        email: 'trader@example.com',
        password: 'password123',
        user: {
          id: '2',
          email: 'trader@example.com',
          name: 'Trader',
          role: 'trader' as const,
          permissions: ['view_dashboard', 'execute_trades', 'view_reports']
        }
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (validUser) {
      return {
        user: validUser.user,
        token: 'mock-jwt-token-' + Date.now()
      };
    }

    throw new Error('Invalid email or password');
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response;
  }

  async logout(): Promise<void> {
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async validateToken(token: string): Promise<{ user: User }> {
    // Mock token validation
    if (token && token.startsWith('mock-jwt-token-')) {
      return {
        user: {
          id: '1',
          email: 'pm@example.com',
          name: 'Portfolio Manager',
          role: 'portfolio_manager' as const,
          permissions: ['view_dashboard', 'manage_strategies', 'run_backtest', 'view_analytics', 'execute_trades', 'view_reports']
        }
      };
    }
    throw new Error('Invalid token');
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