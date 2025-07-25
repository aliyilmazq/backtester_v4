import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { Play, AlertCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { BacktestConfig } from '../../types';
import strategyService from '../../services/strategyService';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  strategyId: yup.number().required('Strategy is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string()
    .required('End date is required')
    .test('date-order', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      return !startDate || !value || new Date(value) > new Date(startDate);
    }),
  initialCapital: yup.number()
    .required('Initial capital is required')
    .min(1000, 'Minimum capital is $1,000')
    .max(1000000000, 'Maximum capital is $1B'),
  commission: yup.number()
    .required('Commission is required')
    .min(0, 'Commission cannot be negative')
    .max(5, 'Commission cannot exceed 5%'),
  dataSource: yup.string().required('Data source is required'),
  assets: yup.array().of(yup.string().required()).min(1, 'Select at least one asset').required(),
  frequency: yup.string().oneOf(['daily', 'hourly', '5min']).required('Frequency is required'),
});

type FormData = yup.InferType<typeof schema>;

interface BacktestFormProps {
  onComplete: (result: any) => void;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const strategies = useSelector((state: RootState) => state.strategies.strategies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      initialCapital: 1000000,
      commission: 0.1,
      dataSource: 'bloomberg',
      frequency: 'daily',
      assets: ['SP500'],
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await strategyService.runBacktest(data as BacktestConfig);
      onComplete(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run backtest');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strategy
          </label>
          <select
            {...register('strategyId', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.strategyId ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="Select strategy"
            aria-invalid={!!errors.strategyId}
          >
            <option value="">Select a strategy</option>
            {strategies.map((strategy) => (
              <option key={strategy.id} value={strategy.id}>
                {strategy.name}
              </option>
            ))}
          </select>
          {errors.strategyId && (
            <p className="mt-1 text-sm text-red-600">{errors.strategyId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source
          </label>
          <select
            {...register('dataSource')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dataSource ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="Select data source"
          >
            <option value="bloomberg">Bloomberg Terminal</option>
            <option value="reuters">Reuters Eikon</option>
            <option value="internal">Internal Database</option>
          </select>
          {errors.dataSource && (
            <p className="mt-1 text-sm text-red-600">{errors.dataSource.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            {...register('startDate')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="Start date"
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            {...register('endDate')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="End date"
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Capital
          </label>
          <Controller
            name="initialCapital"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="number"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.initialCapital ? 'border-red-300' : 'border-gray-300'
                  }`}
                  aria-label="Initial capital"
                  aria-invalid={!!errors.initialCapital}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {field.value ? formatCurrency(field.value) : '$0'}
                </p>
              </div>
            )}
          />
          {errors.initialCapital && (
            <p className="mt-1 text-sm text-red-600">{errors.initialCapital.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commission (%)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('commission', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.commission ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="Commission percentage"
            aria-invalid={!!errors.commission}
          />
          {errors.commission && (
            <p className="mt-1 text-sm text-red-600">{errors.commission.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            {...register('frequency')}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.frequency ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-label="Select frequency"
          >
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
            <option value="5min">5 Minutes</option>
          </select>
          {errors.frequency && (
            <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assets
          </label>
          <Controller
            name="assets"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="SP500"
                    checked={field.value?.includes('SP500')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newValue = e.target.checked
                        ? [...(field.value || []), value]
                        : field.value?.filter((v) => v !== value) || [];
                      field.onChange(newValue);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">S&P 500 Components</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="NASDAQ100"
                    checked={field.value?.includes('NASDAQ100')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newValue = e.target.checked
                        ? [...(field.value || []), value]
                        : field.value?.filter((v) => v !== value) || [];
                      field.onChange(newValue);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">NASDAQ 100</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="RUSSELL2000"
                    checked={field.value?.includes('RUSSELL2000')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newValue = e.target.checked
                        ? [...(field.value || []), value]
                        : field.value?.filter((v) => v !== value) || [];
                      field.onChange(newValue);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">Russell 2000</span>
                </label>
              </div>
            )}
          />
          {errors.assets && (
            <p className="mt-1 text-sm text-red-600">{errors.assets.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Running Backtest...</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Run Backtest</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default BacktestForm;