import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, AlertCircle, Eye, EyeOff, 
  Shield, TrendingUp, Activity, BarChart3,
  CheckCircle, Globe, Award, Zap
} from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/authSlice';
import '../../styles/globals.css';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const ModernLoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by Redux
    }
  };

  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const features = [
    { icon: Shield, title: 'Bank-Level Security', desc: '256-bit encryption & 2FA' },
    { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Live market data & insights' },
    { icon: Activity, title: 'Smart Algorithms', desc: 'AI-powered trading strategies' },
    { icon: Award, title: 'Proven Results', desc: '68.4% average win rate' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AlgoTrade Pro</h1>
              <p className="text-sm text-gray-500">Institutional Trading Platform</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to access your trading dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl fade-in">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`form-input pl-10 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="john.smith@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 fade-in">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 fade-in">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>

              <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm text-blue-700">
              <p>Portfolio Manager: pm@example.com / password123</p>
              <p>Trader: trader@example.com / password123</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-700">
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative flex-1 flex flex-col justify-center px-12 xl:px-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-white">
                Trade Smarter,<br />Not Harder
              </h3>
              <p className="text-xl text-blue-100 max-w-md">
                Join thousands of institutional traders using our AI-powered platform to maximize returns and minimize risk.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-lg">
              {features.map((feature, index) => (
                <div key={index} className="glass-card bg-white/10 backdrop-blur-md p-4 text-white">
                  <feature.icon className="w-8 h-8 mb-3 text-blue-300" />
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-blue-100">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">$2.4B+</p>
                <p className="text-blue-200">Assets Managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15K+</p>
                <p className="text-blue-200">Active Traders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">99.9%</p>
                <p className="text-blue-200">Uptime SLA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default ModernLoginForm;