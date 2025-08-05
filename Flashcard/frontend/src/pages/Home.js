import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  BookOpen, 
  Plus, 
  Target, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Create Custom Sets',
      description: 'Build your own flashcard sets with unlimited questions and answers tailored to your learning needs.'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Practice with Purpose',
      description: 'Flip through cards, track your progress, and focus on areas that need more attention.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed statistics and performance analytics.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Share & Collaborate',
      description: 'Share your flashcard sets with others and discover sets created by the community.'
    }
  ];

  const benefits = [
    'Unlimited flashcard sets',
    'Custom categories and tags',
    'Progress tracking',
    'Mobile-responsive design',
    'Secure user authentication',
    'Real-time updates'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <Brain className="h-12 w-12 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Any Subject with
              <span className="text-gradient block">Smart Flashcards</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, practice, and master flashcards to enhance your learning experience. 
              Whether you're studying for exams or learning new skills, our platform makes it easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary text-lg px-8 py-3"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create effective learning experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of students who have improved their learning with our comprehensive flashcard platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Brain className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sample Flashcard</h3>
                    <p className="text-sm text-gray-500">Interactive learning experience</p>
                  </div>
                </div>
                <div className="flashcard mb-6">
                  <div className="flashcard-front">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Question</p>
                      <p className="text-xl font-semibold text-gray-900">
                        What is the capital of France?
                      </p>
                    </div>
                  </div>
                  <div className="flashcard-back">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Answer</p>
                      <p className="text-xl font-semibold text-gray-900">
                        Paris
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="btn btn-secondary">Previous</button>
                  <button className="btn btn-primary">Flip Card</button>
                  <button className="btn btn-secondary">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and start creating your own flashcard sets today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/create"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Set</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 