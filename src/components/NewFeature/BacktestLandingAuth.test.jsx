import React from 'react';
import { render, screen } from '@testing-library/react';
import BacktestLandingAuth from './BacktestLandingAuth';

test('renders learn react link', () => {
  render(<BacktestLandingAuth />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
