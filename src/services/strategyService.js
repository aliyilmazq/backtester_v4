export const getStrategies = async () => {
  try {
    // Mock strategy data for now
    const strategies = [
      {
        id: 'trend-following',
        name: 'Trend Following',
        description: 'Follows market trends using moving averages and momentum indicators',
        riskLevel: 'Medium',
        complexity: 'Beginner',
        expectedReturn: '15-25%',
        indicators: ['SMA', 'EMA', 'MACD']
      },
      {
        id: 'mean-reversion',
        name: 'Mean Reversion',
        description: 'Trades on the assumption that prices will revert to their mean',
        riskLevel: 'Low',
        complexity: 'Intermediate',
        expectedReturn: '10-20%',
        indicators: ['RSI', 'Bollinger Bands']
      },
      {
        id: 'momentum',
        name: 'Momentum Trading',
        description: 'Capitalizes on strong price movements and market momentum',
        riskLevel: 'High',
        complexity: 'Advanced',
        expectedReturn: '20-40%',
        indicators: ['RSI', 'Stochastic', 'Volume']
      },
      {
        id: 'breakout',
        name: 'Breakout Strategy',
        description: 'Identifies and trades breakouts from key support/resistance levels',
        riskLevel: 'Medium',
        complexity: 'Intermediate',
        expectedReturn: '15-30%',
        indicators: ['ATR', 'Volume', 'Price Action']
      },
      {
        id: 'scalping',
        name: 'Scalping',
        description: 'High-frequency trading for small, quick profits',
        riskLevel: 'Very High',
        complexity: 'Expert',
        expectedReturn: '5-15%',
        indicators: ['Level 2 Data', 'Volume', 'Price Action']
      },
      {
        id: 'multi-strategy',
        name: 'Multi-Strategy',
        description: 'Combines multiple strategies for diversified approach',
        riskLevel: 'Medium',
        complexity: 'Advanced',
        expectedReturn: '15-25%',
        indicators: ['Various']
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return strategies;
  } catch (error) {
    console.error('Error fetching strategies:', error);
    throw error;
  }
};