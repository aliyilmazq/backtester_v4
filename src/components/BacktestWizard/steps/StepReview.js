import { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  Settings, 
  DollarSign,
  AlertTriangle,
  Loader,
  Edit2
} from 'lucide-react';

const StepReview = ({ data, onUpdate, onNext, onPrevious, onEdit }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // The parent component will handle the actual backtest execution
      await onNext();
    } catch (err) {
      setError('Failed to start backtest. Please try again.');
      setIsRunning(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ReviewSection = ({ title, icon: Icon, children, onEdit, stepIndex }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-600 mr-2" />
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(stepIndex)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const ReviewItem = ({ label, value }) => (
    <div className="flex justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Review Configuration
        </h3>
        <p className="text-sm text-gray-600">
          Review your backtest settings before running the analysis
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {/* Symbol Section */}
        <ReviewSection 
          title="Symbol" 
          icon={TrendingUp} 
          onEdit={onEdit}
          stepIndex={0}
        >
          {data.symbol ? (
            <>
              <ReviewItem label="Symbol" value={data.symbol.displaySymbol} />
              <ReviewItem label="Company" value={data.symbol.description} />
              <ReviewItem label="Exchange" value={data.symbol.exchange} />
              <ReviewItem label="Currency" value={data.symbol.currency} />
            </>
          ) : (
            <p className="text-sm text-red-600">No symbol selected</p>
          )}
        </ReviewSection>

        {/* Date Range Section */}
        <ReviewSection 
          title="Date Range" 
          icon={Calendar} 
          onEdit={onEdit}
          stepIndex={1}
        >
          {data.startDate && data.endDate ? (
            <>
              <ReviewItem label="Start Date" value={formatDate(data.startDate)} />
              <ReviewItem label="End Date" value={formatDate(data.endDate)} />
              <ReviewItem 
                label="Duration" 
                value={`${Math.floor((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24))} days`} 
              />
            </>
          ) : (
            <p className="text-sm text-red-600">No date range selected</p>
          )}
        </ReviewSection>

        {/* Strategy Section */}
        <ReviewSection 
          title="Strategy" 
          icon={Settings} 
          onEdit={onEdit}
          stepIndex={2}
        >
          {data.strategy ? (
            <>
              <ReviewItem label="Strategy" value={data.strategy.name} />
              <ReviewItem label="Category" value={data.strategy.category} />
              <ReviewItem label="Complexity" value={data.strategy.complexity} />
              {data.strategyParameters && Object.entries(data.strategyParameters).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">Parameters:</p>
                  {Object.entries(data.strategyParameters).map(([key, value]) => (
                    <ReviewItem 
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={value}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-red-600">No strategy selected</p>
          )}
        </ReviewSection>

        {/* Portfolio Section */}
        <ReviewSection 
          title="Portfolio Settings" 
          icon={DollarSign} 
          onEdit={onEdit}
          stepIndex={3}
        >
          {data.portfolioParameters ? (
            <>
              <ReviewItem 
                label="Initial Capital" 
                value={formatCurrency(data.portfolioParameters.initialCapital)} 
              />
              <ReviewItem 
                label="Position Sizing" 
                value={data.portfolioParameters.positionSizing} 
              />
              <ReviewItem 
                label="Position Size" 
                value={data.portfolioParameters.positionSizing === 'percentage' 
                  ? `${data.portfolioParameters.positionSize}%`
                  : formatCurrency(data.portfolioParameters.positionSize)
                } 
              />
              <ReviewItem 
                label="Max Positions" 
                value={data.portfolioParameters.maxPositions} 
              />
              <ReviewItem 
                label="Commission" 
                value={formatPercent(data.portfolioParameters.commission)} 
              />
              <ReviewItem 
                label="Slippage" 
                value={formatPercent(data.portfolioParameters.slippage)} 
              />
            </>
          ) : (
            <p className="text-sm text-red-600">No portfolio settings configured</p>
          )}
        </ReviewSection>
      </div>

      {/* Warning Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-1">Before You Continue:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Ensure all settings are correct - the backtest may take several minutes</li>
              <li>Past performance does not guarantee future results</li>
              <li>Consider transaction costs and market conditions in your analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isRunning}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleRunBacktest}
          disabled={isRunning || !data.symbol || !data.strategy || !data.startDate || !data.endDate}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
            isRunning || !data.symbol || !data.strategy || !data.startDate || !data.endDate
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isRunning ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Running Backtest...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Run Backtest
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepReview;