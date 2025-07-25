import React from 'react';
import { BookOpen, Award, Zap, TestTube, BarChart3, TrendingUp, PlayCircle } from 'lucide-react';

const Academy: React.FC = () => {
  const courses = {
    beginner: [
      { title: 'Introduction to Markets', duration: '4 hours', progress: 100 },
      { title: 'Basic Technical Analysis', duration: '6 hours', progress: 75 },
      { title: 'Risk Management 101', duration: '3 hours', progress: 50 },
    ],
    intermediate: [
      { title: 'Algorithmic Trading Basics', duration: '8 hours', progress: 30 },
      { title: 'Portfolio Optimization', duration: '6 hours', progress: 0 },
      { title: 'Market Microstructure', duration: '5 hours', progress: 0 },
    ],
    advanced: [
      { title: 'Machine Learning for Trading', duration: '12 hours', progress: 0 },
      { title: 'High-Frequency Trading', duration: '10 hours', progress: 0 },
      { title: 'Derivatives & Options', duration: '8 hours', progress: 0 },
    ],
  };

  const activeCourses = [
    { title: 'Quantitative Analysis Fundamentals', progress: 75, duration: '6 hours', instructor: 'Dr. Sarah Chen' },
    { title: 'Python for Financial Markets', progress: 45, duration: '8 hours', instructor: 'Prof. Michael Ross' },
    { title: 'Risk-Adjusted Returns', progress: 30, duration: '4 hours', instructor: 'John Williams, CFA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Trading Academy</h2>
          <p className="text-gray-600 mt-1">Master algorithmic trading with our comprehensive courses</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Your Progress:</span>
          <div className="flex items-center space-x-2">
            <Award size={20} className="text-yellow-600" />
            <span className="font-semibold text-gray-900">Level 3</span>
          </div>
        </div>
      </div>

      {/* Featured Course */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Zap size={18} />
              <span className="text-sm font-medium">FEATURED COURSE</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Advanced Risk Management Strategies</h3>
            <p className="text-blue-100 mb-4">
              Learn how to implement sophisticated risk management techniques used by institutional traders
            </p>
            <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Start Learning →
            </button>
          </div>
          <BookOpen size={64} className="text-blue-200 opacity-50" />
        </div>
      </div>

      {/* Course Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TestTube size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Beginner</h3>
          <p className="text-sm text-gray-600 mb-4">Start your journey with trading fundamentals</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {courses.beginner.map((course, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>• {course.title}</span>
                {course.progress > 0 && (
                  <span className="text-xs text-green-600 font-medium">{course.progress}%</span>
                )}
              </li>
            ))}
          </ul>
          <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Explore Courses
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Intermediate</h3>
          <p className="text-sm text-gray-600 mb-4">Develop advanced trading strategies</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {courses.intermediate.map((course, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>• {course.title}</span>
                {course.progress > 0 && (
                  <span className="text-xs text-blue-600 font-medium">{course.progress}%</span>
                )}
              </li>
            ))}
          </ul>
          <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Explore Courses
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced</h3>
          <p className="text-sm text-gray-600 mb-4">Master institutional-grade strategies</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {courses.advanced.map((course, index) => (
              <li key={index}>• {course.title}</li>
            ))}
          </ul>
          <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Explore Courses
          </button>
        </div>
      </div>

      {/* Your Courses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
        <div className="space-y-4">
          {activeCourses.map((course, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <PlayCircle size={40} className="text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.instructor} • {course.duration}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${course.progress}%`}}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{course.progress}%</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Academy;