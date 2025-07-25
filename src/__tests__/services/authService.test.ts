import authService from '../../services/authService';
import { User } from '../../types';

describe('authService', () => {
  describe('permission checks', () => {
    const adminUser: User = {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      permissions: [],
    };

    const traderUser: User = {
      id: '2',
      email: 'trader@example.com',
      name: 'Trader User',
      role: 'trader',
      permissions: ['execute_trades', 'view_reports'],
    };

    const viewerUser: User = {
      id: '3',
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: 'viewer',
      permissions: ['view_reports'],
    };

    describe('checkPermission', () => {
      it('should return false for null user', () => {
        expect(authService.checkPermission(null, 'any_permission')).toBe(false);
      });

      it('should return true for admin regardless of permission', () => {
        expect(authService.checkPermission(adminUser, 'any_permission')).toBe(true);
        expect(authService.checkPermission(adminUser, 'manage_strategies')).toBe(true);
      });

      it('should check specific permissions for non-admin users', () => {
        expect(authService.checkPermission(traderUser, 'execute_trades')).toBe(true);
        expect(authService.checkPermission(traderUser, 'view_reports')).toBe(true);
        expect(authService.checkPermission(traderUser, 'manage_users')).toBe(false);
      });
    });

    describe('canManageStrategies', () => {
      it('should return true for admin', () => {
        expect(authService.canManageStrategies(adminUser)).toBe(true);
      });

      it('should return false for users without permission', () => {
        expect(authService.canManageStrategies(traderUser)).toBe(false);
        expect(authService.canManageStrategies(viewerUser)).toBe(false);
      });

      it('should return true for users with manage_strategies permission', () => {
        const userWithPermission = {
          ...traderUser,
          permissions: ['manage_strategies'],
        };
        expect(authService.canManageStrategies(userWithPermission)).toBe(true);
      });
    });

    describe('canExecuteTrades', () => {
      it('should return true for users with execute_trades permission', () => {
        expect(authService.canExecuteTrades(traderUser)).toBe(true);
      });

      it('should return false for users without permission', () => {
        expect(authService.canExecuteTrades(viewerUser)).toBe(false);
      });
    });

    describe('canViewReports', () => {
      it('should return true for users with view_reports permission', () => {
        expect(authService.canViewReports(traderUser)).toBe(true);
        expect(authService.canViewReports(viewerUser)).toBe(true);
      });

      it('should return false for null user', () => {
        expect(authService.canViewReports(null)).toBe(false);
      });
    });
  });
});