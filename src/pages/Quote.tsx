import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, Package, CheckCircle, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { supabase, testSupabaseConnection, testQuoteInsertion } from '../lib/supabase';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Quote: React.FC = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    cargoType: '',
    weight: '',
    dimensions: '',
    pickupDate: '',
    deliveryDate: '',
    serviceType: 'ftl',
    specialRequirements: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);

  // Test connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      setDebugInfo('Checking Supabase connection... URL: ' + import.meta.env.VITE_SUPABASE_URL);
      console.log('Checking Supabase connection...');
      
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        setDebugInfo('✅ Supabase connection successful');
        
        // Test quote insertion
        const insertTest = await testQuoteInsertion();
        if (insertTest.success) {
          setDebugInfo('✅ Database connection and permissions working');
        } else {
          setDebugInfo(`⚠️ Connection OK but insert failed: ${insertTest.error}`);
        }
      } else {
        setConnectionStatus('error');
        setDebugInfo(`❌ Connection failed: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setDebugInfo(`❌ Unexpected error: ${error.message}`);
    }
  };

  const retryConnection = async () => {
    setIsRetrying(true);
    await checkConnection();
    setIsRetrying(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = [
      'pickupLocation', 'deliveryLocation', 'cargoType'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }
    
    // Check contact fields
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    
    if (!formData.contactName.trim()) {
      setError('Contact name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form
      if (!validateForm()) {
        console.log('Form validation failed');
        setIsSubmitting(false);
        return;
      }

      console.log('Form validation passed, submitting quote request:', formData);

      // Prepare data for insertion
      const quoteData = {
        pickup_location: formData.pickupLocation.trim(),
        delivery_location: formData.deliveryLocation.trim(),
        cargo_type: formData.cargoType.trim(),
        weight: formData.weight.trim() || null,
        dimensions: formData.dimensions.trim() || null,
        pickup_date: formData.pickupDate || null,
        delivery_date: formData.deliveryDate || null,
        service_type: formData.serviceType,
        special_requirements: formData.specialRequirements.trim() || null,
        company_name: formData.companyName.trim(),
        contact_name: formData.contactName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        status: 'pending' as const,
      };

      console.log('Prepared quote data:', quoteData);
      
      // Submit the quote
      const { data, error: supabaseError } = await supabase
        .from('quote_requests')
        .insert(quoteData)
        .select();
      
      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        
        // Provide specific error messages based on error type
        if (supabaseError.code === 'PGRST116') {
          setError('Database table not found. Please contact support.');
        } else if (supabaseError.code === '42501') {
          setError('Permission denied. The quote system may be temporarily unavailable.');
        } else if (supabaseError.message.includes('Failed to fetch') || 
                   supabaseError.message.includes('network') ||
                   supabaseError.message.includes('connection')) {
          setError('Connection error. Please check your internet connection and try again.');
        } else if (supabaseError.message.includes('JWT') || 
                   supabaseError.message.includes('auth')) {
          setError('Authentication error. Please refresh the page and try again.');
        } else {
          setError(`Database error: ${supabaseError.message} (Code: ${supabaseError.code || 'Unknown'})`);
        }
        return;
      }

      console.log('Quote request submitted successfully!', data);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        pickupLocation: '',
        deliveryLocation: '',
        cargoType: '',
        weight: '',
        dimensions: '',
        pickupDate: '',
        deliveryDate: '',
        serviceType: 'ftl',
        specialRequirements: '',
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
      });

    } catch (error: any) {
      console.error('Error submitting quote:', error);
      
      if (error.message.includes('timeout')) {
        setError('Submission timeout. Please check your connection and try again.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again or contact support.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-16">
        <section className="py-20 bg-hero-gradient min-h-screen flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="animate-fade-in">
              <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-8 animate-glow-pulse" />
              <h1 className="text-3xl font-black text-white mb-6">
                Quote Request Submitted!
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Thank you for your quote request. We've received your information and will get back to you 
                within 2 hours during business hours with a competitive quote.
              </p>
              <div className="bg-black-primary/50 p-6 rounded-lg mb-8 border border-red-primary/30">
                <p className="text-sm text-red-primary mb-3 font-bold">What happens next?</p>
                <ul className="text-sm text-white/80 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    Our team will review your requirements
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    We'll prepare a competitive quote
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    You'll receive an email with pricing details
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    We'll follow up to discuss your needs
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.href = '/'}>
                  Back to Home
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsSubmitted(false);
                  setError('');
                }}>
                  Submit Another Quote
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-in">
            Request a <span className="text-red-primary">Quote</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Get competitive pricing for your shipping needs. Fill out the form below and we'll provide 
            you with a detailed quote within 2 hours during business hours.
          </p>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Connection Status */}
          {connectionStatus !== 'connected' && (
            <div className={`mb-6 p-4 rounded-lg border-2 animate-fade-in ${
              connectionStatus === 'checking' 
                ? 'bg-blue-primary/20 border-blue-primary/50' 
                : 'bg-red-primary/20 border-red-primary/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className={`h-5 w-5 ${
                    connectionStatus === 'checking' ? 'text-blue-400 animate-spin' : 'text-red-primary'
                  }`} />
                  <p className={`font-semibold ${
                    connectionStatus === 'checking' ? 'text-blue-400' : 'text-red-primary'
                  }`}>
                    {connectionStatus === 'checking' ? 'Checking database connection...' : 'Database Connection Issue'}
                  </p>
                </div>
                {connectionStatus === 'error' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryConnection}
                    disabled={isRetrying}
                    className="ml-4"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </Button>
                )}
              </div>
              {debugInfo && (
                <div className="mt-3 p-3 bg-black-primary/50 rounded border border-red-primary/30">
                  <p className="text-sm text-white/80 font-mono">{debugInfo}</p>
                  {connectionStatus === 'error' && (
                    <div className="mt-2 text-xs text-white/60">
                      <p>Common solutions:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Verify your .env file contains correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
                        <li>Check that your Supabase project is active in the dashboard</li>
                        <li>Ensure the database migration has been run in Supabase SQL Editor</li>
                        <li>Restart your development server (npm run dev)</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-primary/20 border-2 border-red-primary/50 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-primary" />
                <p className="text-red-primary font-semibold">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="animate-fade-in">
                  <h2 className="text-2xl font-black text-white mb-8">Shipment Details</h2>
                  
                  {/* Pickup & Delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Input
                      label="Pickup Location"
                      placeholder="City, State or ZIP Code"
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      required
                    />
                    <Input
                      label="Delivery Location"
                      placeholder="City, State or ZIP Code"
                      value={formData.deliveryLocation}
                      onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                      required
                    />
                  </div>

                  {/* Cargo Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-white">
                        Cargo Type <span className="text-red-primary">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                        value={formData.cargoType}
                        onChange={(e) => handleInputChange('cargoType', e.target.value)}
                        required
                      >
                        <option value="">Select cargo type</option>
                        <option value="general">General Freight</option>
                        <option value="food">Food & Beverage</option>
                        <option value="automotive">Automotive</option>
                        <option value="construction">Construction Materials</option>
                        <option value="electronics">Electronics</option>
                        <option value="hazmat">Hazardous Materials</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input
                      label="Weight (lbs)"
                      placeholder="e.g., 25,000"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                    <Input
                      label="Dimensions (L×W×H)"
                      placeholder="e.g., 40×8×8 ft"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    />
                  </div>

                  {/* Dates & Service Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Input
                      label="Pickup Date"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    />
                    <Input
                      label="Delivery Date"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-white">
                        Service Type <span className="text-red-primary">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        required
                      >
                        <option value="ftl">Full Truckload (FTL)</option>
                        <option value="ltl">Less Than Truckload (LTL)</option>
                        <option value="reefer">Refrigerated</option>
                        <option value="flatbed">Flatbed</option>
                        <option value="expedited">Expedited</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-white mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white placeholder-red-primary/50 focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                      rows={4}
                      placeholder="Any special handling, equipment, or delivery instructions..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    />
                  </div>

                  <h3 className="text-xl font-black text-white mb-6">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                    />
                    <Input
                      label="Contact Name"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full shadow-red-glow-lg"
                      disabled={isSubmitting || connectionStatus === 'error'}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                    </Button>
                    {connectionStatus === 'error' && (
                      <p className="text-red-primary text-sm mt-2 text-center">
                        Form disabled due to connection issues. Please use alternative contact methods below.
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Info Sidebar */}
              <div className="space-y-6">
                <Card className="animate-slide-up">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calculator className="h-6 w-6 text-red-primary" />
                    <h3 className="text-lg font-bold text-white">Quick Quote</h3>
                  </div>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    Receive your competitive quote within 2 hours during business hours.
                  </p>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Free, no-obligation quotes
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Competitive market rates
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Transparent pricing
                    </li>
                  </ul>
                </Card>

                <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-6 w-6 text-red-primary" />
                    <h3 className="text-lg font-bold text-white">Coverage Area</h3>
                  </div>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    We provide services across all 48 contiguous states with specialized routes.
                  </p>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Nationwide coverage
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Canada & Mexico routes
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      Specialized corridors
                    </li>
                  </ul>
                </Card>

                <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Package className="h-6 w-6 text-red-primary" />
                    <h3 className="text-lg font-bold text-white">Need Help?</h3>
                  </div>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    Our sales team is ready to assist with complex shipping requirements.
                  </p>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="text-white font-bold">Call us directly:</div>
                      <div className="text-red-primary font-bold">407-777-2772</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-white font-bold">Email us:</div>
                      <div className="text-red-primary font-bold">quotes@bosaboss.com</div>
                    </div>
                  </div>
                </Card>

                {/* Fallback Contact Info */}
                <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-primary" />
                    <h3 className="text-lg font-bold text-white">Having Issues?</h3>
                  </div>
                  <p className="text-white/70 mb-4 leading-relaxed text-sm">
                    If you're experiencing technical difficulties with the form, you can also:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      <span className="text-white/80">Call us at 407-777-2772</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      <span className="text-white/80">Email quotes@bosaboss.com</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                      <span className="text-white/80">Visit our contact page</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Quote;