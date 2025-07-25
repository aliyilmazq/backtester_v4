import { 
  BarChart2, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Play,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Building,
  Phone,
  Globe,
  Menu,
  X,
  Star,
  ChevronDown,
  DollarSign,
  Clock,
  FileText,
  Activity
} from 'lucide-react';

import logo from './logo-citalf.svg';

const BacktestLandingAuth = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');

  // Landing Page Component
  const LandingPage = () => {
    const features = [
      {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your data is protected with enterprise-grade encryption and security protocols'
      },
      {
        icon: Zap,
        title: 'Lightning Fast Execution',
        description: 'Process millions of data points in seconds with our optimized infrastructure'
      },
      {
        icon: BarChart2,
        title: 'Advanced Analytics',
        description: 'Comprehensive metrics including Sharpe ratio, max drawdown, and more'
      },
      {
        icon: Activity,
        title: 'Real-Time Monitoring',
        description: 'Track your strategies performance with live updates and alerts'
      }
    ];

    const testimonials = [
      {
        name: 'Michael Chen',
        role: 'Portfolio Manager',
        company: 'Apex Capital',
        content: 'BackTest Pro transformed how we validate our trading strategies. The accuracy and speed are unmatched.',
        rating: 5
      },
      {
        name: 'Sarah Williams',
        role: 'Quantitative Analyst',
        company: 'Sterling Investments',
        content: 'The most comprehensive backtesting platform I\'ve used. Essential for serious traders.',
        rating: 5
      },
      {
        name: 'David Kumar',
        role: 'Independent Trader',
        company: 'Self-Employed',
        content: 'From strategy development to execution, BackTest Pro covers everything I need.',
        rating: 5
      }
    ];

    const plans = [
      {
        name: 'Starter',
        price: 49,
        period: 'month',
        features: [
          'Up to 5 strategies',
          'Basic backtesting',
          '1 year historical data',
          'Email support',
          'CSV export'
        ],
        recommended: false
      },
      {
        name: 'Professional',
        price: 149,
        period: 'month',
        features: [
          'Unlimited strategies',
          'Advanced backtesting',
          '10 years historical data',
          'Priority support',
          'API access',
          'Machine learning tools',
          'Real-time data'
        ],
        recommended: true
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: [
          'Everything in Professional',
          'Dedicated infrastructure',
          'Custom integrations',
          'Dedicated account manager',
          'SLA guarantee',
          'On-premise deployment'
        ],
        recommended: false
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="logo" />
                  
                </div>
                <div className="hidden md:flex items-center space-x-8 ml-10">
                  <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                  <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
                  <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                  <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </button>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900 transition-colors py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 transition-colors py-2">How it Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900 transition-colors py-2">Pricing</a>
              <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 transition-colors py-2">Testimonials</a>
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Backtesting for
                <span className="text-blue-600"> Serious Traders</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Test your trading strategies against historical data with institutional-grade accuracy. 
                Join over 10,000 traders who trust BackTest Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight size={18} />
                </button>
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Play size={18} />
                  <span>Watch Demo</span>
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">No credit card required • Cancel anytime</p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">$2.5B+</p>
                <p className="text-gray-600 mt-1">Assets Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">10,000+</p>
                <p className="text-gray-600 mt-1">Active Traders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">99.9%</p>
                <p className="text-gray-600 mt-1">Uptime SLA</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">150M+</p>
                <p className="text-gray-600 mt-1">Backtests Run</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600">
                Professional tools designed for modern traders
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Strategy</h3>
                  <p className="text-gray-600">Import your trading strategy or create one using our visual builder</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight size={32} className="text-gray-300" />
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Configure & Test</h3>
                  <p className="text-gray-600">Set parameters, select assets, and run comprehensive backtests</p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight size={32} className="text-gray-300" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-8 border border-gray-200">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyze Results</h3>
                <p className="text-gray-600">Get detailed reports with actionable insights to optimize performance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600">
                Start with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg border ${
                    plan.recommended 
                      ? 'border-blue-600 shadow-xl relative' 
                      : 'border-gray-200'
                  } bg-white`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      {plan.price === 'Custom' ? (
                        <p className="text-3xl font-bold text-gray-900">Custom</p>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          ${plan.price}
                          <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle size={18} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setCurrentPage('register')}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        plan.recommended 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Trading Professionals
              </h2>
              <p className="text-xl text-gray-600">
                See what our users have to say
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Take Your Trading to the Next Level?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of traders who are already using BackTest Pro
            </p>
            <button 
              onClick={() => setCurrentPage('register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Start Your Free Trial Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img src={logo} alt="logo" />
                  
                </div>
                <p className="text-sm">Professional backtesting platform for serious traders.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>&copy; 2025 BackTest Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart2 size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button 
            onClick={() => setCurrentPage('register')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            start your 14-day free trial
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setCurrentPage('landing')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Register Page Component
  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart2 size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Start your free trial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          14 days free • No credit card required
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Smith"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company (optional)
              </label>
              <div className="mt-1 relative">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corp"
                />
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Work email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                Select plan
              </label>
              <div className="mt-1">
                <select
                  id="plan"
                  name="plan"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="starter">Starter - $49/month</option>
                  <option value="professional">Professional - $149/month (Recommended)</option>
                  <option value="enterprise">Enterprise - Custom pricing</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setCurrentPage('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setCurrentPage('landing')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield size={16} />
            <span className="text-xs">Bank-level security</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock size={16} />
            <span className="text-xs">SSL encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle size={16} />
            <span className="text-xs">SOC 2 compliant</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the current page
  return (
    <div>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
    </div>
  );
};

export default BacktestLandingAuth;