import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, TrendingUp, AlertCircle } from 'lucide-react';
import { debounce } from 'lodash';
import { searchSymbols } from '../../../services/symbolService';

const StepSymbolSelection = ({ data, onUpdate, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(data.symbol || null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const results = await searchSymbols(query);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        setError('Failed to search symbols. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSelectSymbol = (symbol) => {
    setSelectedSymbol(symbol);
    setSearchQuery(symbol.displaySymbol);
    setShowDropdown(false);
    onUpdate({ symbol });
  };

  const handleClearSelection = () => {
    setSelectedSymbol(null);
    setSearchQuery('');
    setSearchResults([]);
    onUpdate({ symbol: null });
  };

  const handleNext = () => {
    if (selectedSymbol) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select a Symbol
        </h3>
        <p className="text-sm text-gray-600">
          Search and select a stock symbol to backtest your strategy
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            placeholder="Search by symbol or company name..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {selectedSymbol && (
            <button
              onClick={handleClearSelection}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-96 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectSymbol(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {result.displaySymbol}
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.description}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.type} • {result.currency}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute z-10 mt-1 w-full bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
          <div className="absolute z-10 mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              No symbols found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Selected Symbol Display */}
      {selectedSymbol && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <div className="font-semibold text-gray-900">
                {selectedSymbol.displaySymbol}
              </div>
              <div className="text-sm text-gray-600">
                {selectedSymbol.description}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedSymbol.type} • {selectedSymbol.currency} • {selectedSymbol.exchange}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!selectedSymbol}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedSymbol
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepSymbolSelection;