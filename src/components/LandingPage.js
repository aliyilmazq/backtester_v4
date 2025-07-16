import React from 'react';
import BacktestWizard from './BacktestWizard';
import ErrorBoundary from './ErrorBoundary';

export default function LandingPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Backtest Platform
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/docs"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Documentation
                </a>
                <a
                  href="/api"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  API
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="py-10">
          <BacktestWizard />
        </main>
        
        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024 Backtest Platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}