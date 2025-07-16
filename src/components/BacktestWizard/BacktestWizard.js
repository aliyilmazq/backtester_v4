import React, { useState, useEffect } from 'react';
import StepSymbolSelection from './steps/StepSymbolSelection';
import StepDateRange from './steps/StepDateRange';
import StepStrategySelection from './steps/StepStrategySelection';
import StepParameterConfig from './steps/StepParameterConfig';
import StepReview from './steps/StepReview';
import StepResults from './steps/StepResults';
import StepIndicator from './StepIndicator';
import backtestService from '../../services/backtestService';
import dataService from '../../services/dataService';

const STEPS = [
  { id: 1, name: 'Symbol Selection', component: StepSymbolSelection },
  { id: 2, name: 'Date Range', component: StepDateRange },
  { id: 3, name: 'Strategy Selection', component: StepStrategySelection },
  { id: 4, name: 'Parameters', component: StepParameterConfig },
  { id: 5, name: 'Review & Run', component: StepReview },
  { id: 6, name: 'Results', component: StepResults }
];

export default function BacktestWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backtestConfig, setBacktestConfig] = useState({
    symbol: '',
    startDate: '',
    endDate: '',
    strategy: null,
    parameters: {
      initialCapital: 10000,
      positionSize: 1,
      commission: 0.001
    }
  });
  const [marketData, setMarketData] = useState(null);
  const [backtestResults, setBacktestResults] = useState(null);

  const updateConfig = (updates) => {
    setBacktestConfig(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const runBacktest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch market data if not already loaded
      if (!marketData) {
        const data = await dataService.getMarketData(
          backtestConfig.symbol,
          backtestConfig.startDate,
          backtestConfig.endDate
        );
        setMarketData(data);
      }

      // Run backtest
      const results = await backtestService.runBacktest({
        data: marketData || await dataService.getMarketData(
          backtestConfig.symbol,
          backtestConfig.startDate,
          backtestConfig.endDate
        ),
        strategy: backtestConfig.strategy,
        parameters: backtestConfig.parameters
      });

      setBacktestResults(results);
      nextStep();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setBacktestConfig({
      symbol: '',
      startDate: '',
      endDate: '',
      strategy: null,
      parameters: {
        initialCapital: 10000,
        positionSize: 1,
        commission: 0.001
      }
    });
    setMarketData(null);
    setBacktestResults(null);
    setError(null);
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Backtest Wizard
          </h1>
          
          <StepIndicator 
            steps={STEPS} 
            currentStep={currentStep} 
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="mt-8">
            <CurrentStepComponent
              config={backtestConfig}
              updateConfig={updateConfig}
              onNext={nextStep}
              onPrev={prevStep}
              onRunBacktest={runBacktest}
              isLoading={isLoading}
              results={backtestResults}
              onReset={resetWizard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}