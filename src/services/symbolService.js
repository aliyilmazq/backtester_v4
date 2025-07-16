export const searchSymbols = async (query) => {
  try {
    // Mock symbol data for now
    const allSymbols = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'Stock' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', type: 'Stock' },
      { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', type: 'Stock' },
      { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', type: 'Stock' },
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', exchange: 'NYSE', type: 'ETF' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', type: 'ETF' },
      { symbol: 'BTC-USD', name: 'Bitcoin USD', exchange: 'Crypto', type: 'Cryptocurrency' },
      { symbol: 'ETH-USD', name: 'Ethereum USD', exchange: 'Crypto', type: 'Cryptocurrency' },
      { symbol: 'BNB-USD', name: 'Binance Coin USD', exchange: 'Crypto', type: 'Cryptocurrency' }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter symbols based on query
    const searchTerm = query.toLowerCase();
    const results = allSymbols.filter(item => 
      item.symbol.toLowerCase().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm)
    );

    return results.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error('Error searching symbols:', error);
    throw error;
  }
};