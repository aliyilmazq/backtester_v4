import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout, clearError, updateUser } from '../../store/authSlice';
import { AuthState, User } from '../../types';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    localStorage.clear();
  });

  it('should handle initial state', () => {
    const state = store.getState().auth;
    expect(state).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('should handle clearError', () => {
    // Set an error first
    store.dispatch({ type: 'auth/login/rejected', error: { message: 'Test error' } });
    expect(store.getState().auth.error).toBe('Test error');

    // Clear the error
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });

  it('should handle updateUser', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'trader',
      permissions: ['view_portfolio'],
    };

    // Set a user first
    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { user, token: 'test-token' },
    });

    // Update the user
    store.dispatch(updateUser({ name: 'Updated Name', role: 'admin' }));
    
    const updatedUser = store.getState().auth.user;
    expect(updatedUser?.name).toBe('Updated Name');
    expect(updatedUser?.role).toBe('admin');
    expect(updatedUser?.email).toBe('test@example.com'); // unchanged
  });

  it('should handle login.pending', () => {
    store.dispatch({ type: login.pending.type });
    const state = store.getState().auth;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle login.fulfilled', () => {
    const payload = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'trader' as const,
        permissions: ['view_portfolio'],
      },
      token: 'test-token',
    };

    store.dispatch({ type: login.fulfilled.type, payload });
    const state = store.getState().auth;
    
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('test-token');
    expect(state.error).toBeNull();
  });

  it('should handle login.rejected', () => {
    store.dispatch({ 
      type: login.rejected.type, 
      error: { message: 'Invalid credentials' } 
    });
    
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBe('Invalid credentials');
  });

  it('should handle logout.fulfilled', () => {
    // Login first
    const payload = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'trader' as const,
        permissions: ['view_portfolio'],
      },
      token: 'test-token',
    };
    store.dispatch({ type: login.fulfilled.type, payload });

    // Then logout
    store.dispatch({ type: logout.fulfilled.type });
    const state = store.getState().auth;
    
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });
});