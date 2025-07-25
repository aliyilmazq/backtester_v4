import { Calendar, AlertCircle, Info } from 'lucide-react';

const StepDateRange = ({ data, onUpdate, onNext, onPrevious }) => {
  const [dateRange, setDateRange] = useState({
    startDate: data.startDate || '',
    endDate: data.endDate || ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 1 year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

  // Quick select options
  const quickSelects = [
    { label: '1 Month', months: 1 },
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '1 Year', months: 12 },
    { label: '2 Years', months: 24 },
    { label: '5 Years', months: 60 }
  ];

  useEffect(() => {
    // Set default dates if not provided
    if (!dateRange.startDate && !dateRange.endDate) {
      const defaultRange = {
        startDate: oneYearAgoStr,
        endDate: today
      };
      setDateRange(defaultRange);
      onUpdate(defaultRange);
    }
  }, []);

  const validateDates = (dates) => {
    const errors = {};
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const now = new Date();

    if (!dates.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!dates.endDate) {
      errors.endDate = 'End date is required';
    }

    if (dates.startDate && dates.endDate) {
      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }

      if (end > now) {
        errors.endDate = 'End date cannot be in the future';
      }

      const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) {
        errors.dateRange = 'Date range must be at least 7 days';
      }

      if (daysDiff > 3650) {
        errors.dateRange = 'Date range cannot exceed 10 years';
      }
    }

    return errors;
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    setTouched({ ...touched, [field]: true });
    
    const newErrors = validateDates(newDateRange);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onUpdate(newDateRange);
    }
  };

  const handleQuickSelect = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    
    const newDateRange = {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
    
    setDateRange(newDateRange);
    setTouched({ startDate: true, endDate: true });
    setErrors({});
    onUpdate(newDateRange);
  };

  const handleNext = () => {
    const allTouched = { startDate: true, endDate: true };
    setTouched(allTouched);
    
    const validationErrors = validateDates(dateRange);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const getDayCount = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Date Range
        </h3>
        <p className="text-sm text-gray-600">
          Choose the time period for your backtest analysis
        </p>
      </div>

      {/* Quick Select Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {quickSelects.map((option) => (
            <button
              key={option.label}
              onClick={() => handleQuickSelect(option.months)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              max={today}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.startDate && errors.startDate
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
          </div>
          {touched.startDate && errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              max={today}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.endDate && errors.endDate
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
          </div>
          {touched.endDate && errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Date Range Error */}
      {errors.dateRange && (
        <div className="flex items-center bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{errors.dateRange}</p>
        </div>
      )}

      {/* Date Range Info */}
      {dateRange.startDate && dateRange.endDate && !errors.dateRange && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">
                Selected Period: {getDayCount()} days
              </p>
              <p className="text-gray-600">
                From {new Date(dateRange.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} to {new Date(dateRange.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepDateRange;