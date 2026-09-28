import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'driver',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.role
      );
      
      if (success) {
        setSuccess('Account created successfully! You are now logged in.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary pt-16">
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          <Card>
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/photo_2025-07-06_20.35.24-removebg-preview.png" 
                alt="Bosaboss Logo" 
                className="h-10 w-auto animate-logo-pulse"
              />
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-8">
              Create Your Account
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 text-sm">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Account Type <span className="text-red-primary">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('role', 'user')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.role === 'user'
                        ? 'border-red-primary bg-red-primary/10 text-red-primary'
                        : 'border-gray-700 bg-dark-tertiary text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    Client/Shipper
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('role', 'driver')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.role === 'driver'
                        ? 'border-red-primary bg-red-primary/10 text-red-primary'
                        : 'border-gray-700 bg-dark-tertiary text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    Driver
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-primary focus:ring-red-primary border-gray-600 rounded bg-dark-tertiary"
                />
                <label htmlFor="agree-terms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-red-primary hover:text-red-400">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-red-primary hover:text-red-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-red-primary hover:text-red-400 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {formData.role === 'driver' && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  <strong>Driver Note:</strong> After creating your account, you'll need to complete 
                  a driver application with your CDL and insurance information.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;