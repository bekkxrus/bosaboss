import React, { useState } from 'react';
import { 
  Truck, Users, Shield, Clock, Star, Globe, Award,
  Calculator, MapPin, CheckCircle, AlertCircle,
  Settings, RefreshCw, Phone, Mail, MessageSquare,
  UserCheck, FileText
} from 'lucide-react';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PromoBanner from '../components/ui/PromoBanner';

const SinglePageHome: React.FC = () => {
  // Quote form state
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

  // Contact form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general',
    language: 'english',
  });

  // Driver form state
  const [, setDriverData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cdlNumber: '',
    cdlClass: '',
    cdlExpiration: '',
    experience: '',
    truckType: '',
    trailerType: '',
    insuranceCarrier: '',
    policyNumber: '',
    mcNumber: '',
    dotNumber: '',
    preferredLanes: '',
    homeBase: '',
    availableDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('connected');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeForm, setActiveForm] = useState<'quote' | 'contact' | 'driver'>('quote');

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      setDebugInfo('Checking Supabase connection... URL: ' + import.meta.env.VITE_SUPABASE_URL);
      
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        setDebugInfo('✅ Supabase connection successful');
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

  const handleInputChange = (field: string, value: string, formType: 'quote' | 'contact' | 'driver' = 'quote') => {
    if (formType === 'quote') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'contact') {
      setContactData(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'driver') {
      setDriverData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateQuoteForm = () => {
    const requiredFields = [
      'pickupLocation', 'deliveryLocation', 'cargoType', 
      'companyName', 'contactName', 'email', 'phone'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const validateContactForm = () => {
    if (!contactData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!contactData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!contactData.message.trim()) {
      setError('Message is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, formType: 'quote' | 'contact' | 'driver') => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (formType === 'quote') {
        if (!validateQuoteForm()) {
          setIsSubmitting(false);
          return;
        }

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

        const { error: supabaseError } = await supabase
          .from('quote_requests')
          .insert(quoteData);

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          setError('Failed to submit quote. Please try again or contact us directly.');
          return;
        }

        setIsSubmitted(true);
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

      } else if (formType === 'contact') {
        if (!validateContactForm()) {
          setIsSubmitting(false);
          return;
        }

        const contactFormData = {
          name: contactData.name.trim(),
          email: contactData.email.trim().toLowerCase(),
          phone: contactData.phone.trim() || null,
          subject: contactData.subject.trim() || null,
          message: contactData.message.trim(),
          inquiry_type: contactData.inquiryType,
          status: 'new' as const,
        };

        const { error: supabaseError } = await supabase
          .from('contact_messages')
          .insert(contactFormData);

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          setError('Failed to send message. Please try again or contact us directly.');
          return;
        }

        setIsSubmitted(true);
        setContactData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: 'general',
          language: 'english',
        });

      } else if (formType === 'driver') {
        // Driver application logic would go here
        setIsSubmitted(true);
      }

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Failed to submit. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Data for sections
  const services = [
    {
      icon: Truck,
      title: 'Full Logistics Solutions',
      description: 'Comprehensive hiring and management of owner-operators, lease drivers, and company drivers with consistent freight.',
    },
    {
      icon: Users,
      title: 'Professional Dispatch',
      description: 'Expert load booking, broker communication, rate negotiation, and complete paperwork management.',
    },
    {
      icon: Shield,
      title: 'In-House Departments',
      description: 'Experienced dispatchers, safety coordinators, accounting professionals, and fleet support teams.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance ensuring you\'re never alone on the road with dedicated team support.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Johnson Manufacturing',
      text: 'BosaBoss has been our go-to logistics partner for over 3 years. Their reliability and professional service are unmatched.',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      company: 'Owner-Operator',
      text: 'The dispatch team at BosaBoss keeps me moving with consistent loads and fair rates. Best decision I made for my business.',
      rating: 5,
    },
    {
      name: 'Lisa Chen',
      company: 'Tech Solutions Inc',
      text: 'From electronics to equipment, they handle our sensitive cargo with the utmost care. Exceptional service every time.',
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Award,
      title: 'Transparency',
      description: 'No hidden fees, no surprises — just honest support and clear communication.',
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: '24/7 assistance with experienced professionals who understand the industry.',
    },
    {
      icon: Users,
      title: 'Experience',
      description: '7+ years of proven results and deep industry knowledge.',
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Support in English, Spanish, Russian, and more languages.',
    },
  ];


  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['Main: (555) 123-4567', 'Direct: 407-777-2772'],
      color: 'text-red-primary',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@bosaboss.com', 'dispatch@bosaboss.com'],
      color: 'text-red-primary',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Logistics Avenue', 'Dallas, TX 75201'],
      color: 'text-red-primary',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 6:00 AM - 10:00 PM', '24/7 Emergency Support'],
      color: 'text-red-primary',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="animate-fade-in">
            <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-8 animate-glow-pulse" />
              <h1 className="text-3xl font-black text-white mb-6">
  {activeForm === 'quote' ? 'Quote Request Submitted!' :
   activeForm === 'contact' ? 'Message Sent Successfully!' :
   'Application Submitted!'}
</h1>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Thank you for your submission. We've received your information and will get back to you 
              within 2 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Back to Home
              </Button>
              <Button variant="outline" onClick={() => {
                setIsSubmitted(false);
                setError('');
              }}>
                Submit Another {activeForm === 'quote' ? 'Quote' : activeForm === 'contact' ? 'Message' : 'Application'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Promotional Banner */}
      <PromoBanner />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-semi-truck-driving-on-a-highway-at-sunset-39756-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-4xl animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Your All-in-One <span className="text-red-primary bg-gradient-to-r from-red-primary to-red-secondary bg-clip-text text-transparent animate-glow-pulse">Logistics & Dispatch</span> Partner
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl leading-relaxed">
              We don't just find loads — we build careers and partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto shadow-red-glow-lg"
                onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request a Quote
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('driver')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join Our Network
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              About <span className="text-red-primary">BosaBoss</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Your All-in-One Logistics & Dispatch Partner. BosaBoss was built from the ground up with one mission: 
              to elevate the experience of trucking professionals by offering comprehensive, in-house logistics and 
              dispatch solutions that put drivers first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center group">
                  <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-8 w-8 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Our <span className="text-red-primary">Services</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              From comprehensive logistics solutions to professional dispatch services, 
              we provide everything you need for successful trucking operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} hover className="text-center group">
                  <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-8 w-8 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{service.title}</h3>
                  <p className="text-white/70 leading-relaxed">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="quote" className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Request a <span className="text-red-primary">Quote</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Get competitive pricing for your shipping needs. Fill out the form below and we'll provide 
              you with a detailed quote within 2 hours during business hours.
            </p>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <h3 className="text-2xl font-black text-white mb-8">Shipment Details</h3>
                
                <form onSubmit={(e) => handleSubmit(e, 'quote')}>
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

                  {/* Contact Information */}
                  <h4 className="text-xl font-black text-white mb-6">Contact Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full shadow-red-glow-lg"
                    disabled={isSubmitting || connectionStatus === 'error'}
                    onClick={() => setActiveForm('quote')}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                  </Button>
                </form>
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
            </div>
          </div>
        </div>
      </section>

      {/* Driver Section */}
      <section id="driver" className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Join Our <span className="text-red-primary">Driver Network</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-12">
              Partner with BosaBoss and take control of your success. We provide the loads, 
              support, and tools you need to build a profitable trucking business.
            </p>
            
          </div>

          {/* Driver Benefits - REMOVED PRICING SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center group" hover>
              <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <FileText className="h-8 w-8 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">Comprehensive Support</h3>
              <p className="text-white/70 leading-relaxed">Complete dispatch services, paperwork management, and 24/7 support for all your trucking needs.</p>
            </Card>
            
            <Card className="text-center group" hover>
              <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <Shield className="h-8 w-8 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">Premium Freight Access</h3>
              <p className="text-white/70 leading-relaxed">Access to high-quality loads with reliable payment terms and consistent freight opportunities.</p>
            </Card>
            
            <Card className="text-center group" hover>
              <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <UserCheck className="h-8 w-8 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">Driver-First Approach</h3>
              <p className="text-white/70 leading-relaxed">We prioritize your success with transparent operations, competitive rates, and personalized service.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Contact <span className="text-red-primary">BosaBoss</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get in touch with our logistics family. We're here to help with your shipping needs, 
              driver questions, and business partnerships.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center group" hover>
                  <div className="bg-red-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className={`h-8 w-8 ${info.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">{info.title}</h3>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-white/70 text-sm">
                      {detail}
                    </p>
                  ))}
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="animate-fade-in">
              <h3 className="text-xl font-black text-white mb-6">Send us a Message</h3>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={(e) => handleSubmit(e, 'contact')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Your Name"
                    placeholder="John Smith"
                    value={contactData.name}
                    onChange={(e) => handleInputChange('name', e.target.value, 'contact')}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@company.com"
                    value={contactData.email}
                    onChange={(e) => handleInputChange('email', e.target.value, 'contact')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={contactData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value, 'contact')}
                  />
                  <Input
                    label="Subject"
                    placeholder="How can we help you?"
                    value={contactData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value, 'contact')}
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-bold text-white">
                    Message <span className="text-red-primary">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white placeholder-red-primary/50 focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                    rows={5}
                    placeholder="Tell us more about your needs..."
                    value={contactData.message}
                    onChange={(e) => handleInputChange('message', e.target.value, 'contact')}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full shadow-red-glow"
                  disabled={isSubmitting}
                  onClick={() => setActiveForm('contact')}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card>

            {/* Quick Contact */}
            <div className="space-y-6">
              <Card className="animate-slide-up">
                <h3 className="text-lg font-bold text-white mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a
                    href="https://t.me/Bosaboss_CEO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-red-primary/20 rounded-lg hover:bg-red-primary/30 transition-all duration-300 border border-red-primary/30 hover:border-red-primary/50 group"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-white font-bold text-sm">Telegram Application</span>
                    </div>
                    <span className="text-red-primary font-black text-sm">407-777-2772</span>
                  </a>
                  <a
                    href="tel:407-777-2772"
                    className="flex items-center justify-between p-4 bg-red-primary/20 rounded-lg hover:bg-red-primary/30 transition-all duration-300 border border-red-primary/30 hover:border-red-primary/50 group"
                  >
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-white font-bold text-sm">Direct Phone Line</span>
                    </div>
                    <span className="text-red-primary font-black text-sm">407-777-2772</span>
                  </a>
                </div>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold text-white mb-4">Emergency Support</h3>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">
                  For urgent dispatch needs or roadside emergencies, our 24/7 support team is always available.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-primary/20 rounded-lg border border-red-primary/30">
                    <span className="text-white font-bold text-sm">Emergency Hotline</span>
                    <span className="text-red-primary font-black text-sm">(555) 987-6543</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-primary/20 rounded-lg border border-red-primary/30">
                    <span className="text-white font-bold text-sm">24/7 Dispatch</span>
                    <span className="text-red-primary font-black text-sm">dispatch@bosaboss.com</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              What Our <span className="text-red-primary">Family Says</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              At BosaBoss, you're not just a number — you're part of the team. Hear from our logistics family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-red-primary fill-current group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-bold text-lg">{testimonial.name}</p>
                  <p className="text-red-primary font-semibold">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-button-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to Join the BosaBoss Family?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust BosaBoss for their logistics needs. 
            Get your free quote today or become part of our driver network.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-red-primary hover:bg-white/90 shadow-red-glow-lg"
              onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Free Quote
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-red-primary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SinglePageHome;