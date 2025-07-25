import { 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Zap, 
  Target, 
  Layers,
  Info,
  Check
} from 'lucide-react';

import { getStrategies } from '../../../services/strategyService';

const StepStrategySelection = ({ data, onUpdate, onNext, onPrevious }) => {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(data.strategy || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Strategy icons mapping
  const strategyIcons = {
    'Moving Average Crossover': TrendingUp,
    'RSI': Activity,
    'MACD': BarChart3,
    'Bollinger Bands': Layers,
    'Momentum': Zap,
    'Mean Reversion': Target
  };

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const strategiesData = await getStrategies();
      setStrategies(strategiesData);
    } catch (err) {
      setError('Failed to load strategies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStrategy = (strategy) => {
    setSelectedStrategy(strategy);
    onUpdate({ strategy });
  };

  const handleNext = () => {
    if (selectedStrategy) {
      onNext();
    }
  };

  const getStrategyIcon = (strategyName) => {
    const Icon = strategyIcons[strategyName] || BarChart3;
    return Icon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Trend Following': 'blue',
      'Momentum': 'purple',
      'Volatility': 'orange',
      'Mean Reversion': 'green',
      'Technical': 'indigo'
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading strategies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadStrategies}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Trading Strategy
        </h3>
        <p className="text-sm text-gray-600">
          Choose a strategy to test on your selected symbol
        </p>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => {
          const Icon = getStrategyIcon(strategy.name);
          const colorClass = getCategoryColor(strategy.category);
          const isSelected = selectedStrategy?.id === strategy.id;

          return (
            <button
              key={strategy.id}
              onClick={() => handleSelectStrategy(strategy)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `border-${colorClass}-500 bg-${colorClass}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className={`absolute top-2 right-2 bg-${colorClass}-500 text-white rounded-full p-1`}>
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Strategy Icon */}
              <div className={`w-12 h-12 ${isSelected ? `bg-${colorClass}-100` : 'bg-gray-100'} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`h-6 w-6 ${isSelected ? `text-${colorClass}-600` : 'text-gray-600'}`} />
              </div>

              {/* Strategy Info */}
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {strategy.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {strategy.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected 
                      ? `bg-${colorClass}-100 text-${colorClass}-700`
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {strategy.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {strategy.complexity}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Strategy Details */}
      {selectedStrategy && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {selectedStrategy.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {selectedStrategy.description}
              </p>
              <div className="text-sm text-gray-700">
                <p className="mb-1">
                  <span className="font-medium">Category:</span> {selectedStrategy.category}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Complexity:</span> {selectedStrategy.complexity}
                </p>
                {selectedStrategy.defaultParameters && (
                  <p>
                    <span className="font-medium">Parameters:</span>{' '}
                    {Object.keys(selectedStrategy.defaultParameters).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedStrategy}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedStrategy
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

export default StepStrategySelection;