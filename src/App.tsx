import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import Strategies from './components/strategies/Strategies';
import Backtest from './components/backtest/Backtest';
import Academy from './components/academy/Academy';
import Analytics from './components/analytics/Analytics';
import Settings from './components/settings/Settings';
import Unauthorized from './components/common/Unauthorized';

// Create a component that uses hooks
const AppContent: React.FC = () => {
  const auth = useAuth();
  const websocket = useWebSocket();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="strategies"
            element={
              <ProtectedRoute requiredPermission="manage_strategies">
                <Strategies />
              </ProtectedRoute>
            }
          />
          <Route
            path="backtest"
            element={
              <ProtectedRoute requiredPermission="run_backtest">
                <Backtest />
              </ProtectedRoute>
            }
          />
          <Route path="academy" element={<Academy />} />
          <Route
            path="analytics"
            element={
              <ProtectedRoute requiredPermission="view_analytics">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;