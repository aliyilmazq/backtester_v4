import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import { TrendingUp } from 'lucide-react';

describe('MetricCard', () => {
  it('renders with basic props', () => {
    render(
      <MetricCard 
        title="Test Metric" 
        value={100} 
      />
    );
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with prefix and suffix', () => {
    render(
      <MetricCard 
        title="Revenue" 
        value={1000} 
        prefix="$"
        suffix="USD"
      />
    );
    
    expect(screen.getByText('$1,000USD')).toBeInTheDocument();
  });

  it('renders positive change with green color', () => {
    render(
      <MetricCard 
        title="Growth" 
        value={50} 
        change={5.5}
      />
    );
    
    const changeElement = screen.getByText('5.5%');
    expect(changeElement).toHaveClass('text-green-600');
  });

  it('renders negative change with red color', () => {
    render(
      <MetricCard 
        title="Loss" 
        value={50} 
        change={-3.2}
      />
    );
    
    const changeElement = screen.getByText('3.2%');
    expect(changeElement).toHaveClass('text-red-600');
  });

  it('renders with icon', () => {
    render(
      <MetricCard 
        title="Trending" 
        value={100} 
        icon={TrendingUp}
      />
    );
    
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('renders with info tooltip', () => {
    render(
      <MetricCard 
        title="Complex Metric" 
        value={42} 
        info="This is additional information"
      />
    );
    
    const infoIcon = screen.getByRole('img', { hidden: true });
    expect(infoIcon).toBeInTheDocument();
  });
});