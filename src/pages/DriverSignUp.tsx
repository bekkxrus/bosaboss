import React, { useState } from 'react';
import { UserCheck, FileText, Shield, DollarSign, Phone, MessageSquare, Truck, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const DriverSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Driver application:', formData);
    // Handle form submission
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Guaranteed Gross',
      description: 'Solo: $7,000+ | Strong Solo: $9,000–12,000 | Team: $10,000–15,000',
    },
    {
      icon: Shield,
      title: 'Low Monthly Fee',
      description: 'Only $499/month includes ELD, IFTA, Insurance, and Admin support.',
    },
    {
      icon: FileText,
      title: 'Amazon A-Rated Freight',
      description: 'Access to premium drop & hook freight with reliable payment terms.',
    },
    {
      icon: UserCheck,
      title: 'Complete Support',
      description: 'Fleet maintenance, dispatch support, fuel discounts, and weekly ACH payments.',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our <span className="text-red-primary">Driver Network</span>
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-6">
            Partner with BosaBoss and take control of your success. We provide the loads, 
            support, and tools you need to build a profitable trucking business.
          </p>
          
          {/* Quick Contact Banner */}
          <div className="bg-red-primary/20 border border-red-primary/50 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-3">Start Now - Owner Operators Welcome!</h3>
            <p className="text-white/80 mb-3 text-sm">Drive with Amazon & Street Loads! Maximize your weekly earnings.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:407-777-2772"
                className="flex items-center justify-center space-x-2 bg-red-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-secondary transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Apply via Phone: 407-777-2772</span>
              </a>
              <a
                href="tel:407-777-2772"
                className="flex items-center justify-center space-x-2 bg-white text-red-primary px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call: 407-777-2772</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Guaranteed Gross Section */}
      <section className="py-12 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              <span className="text-red-primary">Guaranteed Gross</span> Weekly Earnings
            </h2>
            <p className="text-lg text-white/80">Reliable drop & hook freight with consistent income potential</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Solo Driver</h3>
              <p className="text-2xl font-bold text-blue-400 mb-1">$7,000+</p>
              <p className="text-white/70 text-sm">Weekly gross earnings</p>
            </Card>

            <Card className="text-center bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Strong Solo</h3>
              <p className="text-2xl font-bold text-green-400 mb-1">$9,000–12,000</p>
              <p className="text-white/70 text-sm">Weekly gross earnings</p>
            </Card>

            <Card className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Team Drivers</h3>
              <p className="text-2xl font-bold text-purple-400 mb-1">$10,000–15,000</p>
              <p className="text-white/70 text-sm">Weekly gross earnings</p>
            </Card>
          </div>

          {/* What You Get */}
          <div className="bg-black-secondary rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">What You Get with BosaBoss</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Shield className="h-6 w-6 text-red-primary mx-auto mb-2" />
                <h4 className="text-white font-semibold mb-1 text-sm">Low Fee</h4>
                <p className="text-white/70 text-xs">$499/month includes ELD, IFTA, Insurance & Admin</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-6 w-6 text-red-primary mx-auto mb-2" />
                <h4 className="text-white font-semibold mb-1 text-sm">Fuel Discounts</h4>
                <p className="text-white/70 text-xs">Save at TA, Pilot, Love's and more locations</p>
              </div>
              <div className="text-center">
                <FileText className="h-6 w-6 text-red-primary mx-auto mb-2" />
                <h4 className="text-white font-semibold mb-1 text-sm">Weekly ACH</h4>
                <p className="text-white/70 text-xs">Fast, reliable payment processing every week</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-red-primary mx-auto mb-2" />
                <h4 className="text-white font-semibold mb-1 text-sm">Fleet Support</h4>
                <p className="text-white/70 text-xs">Maintenance & dispatch support included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Why Drive with <span className="text-red-primary">BosaBoss</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <div className="bg-red-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-red-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-section-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-3">Driver Application</h2>
              <p className="text-white/80 text-sm">
                Complete the form below to join our network of professional drivers. 
                We'll review your application and contact you within 24 hours.
              </p>
              <div className="mt-4 p-3 bg-red-primary/20 border border-red-primary/50 rounded-lg">
                <p className="text-red-primary font-medium mb-2 text-sm">Quick Apply Options:</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href="https://t.me/Bosaboss_CEO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-red-primary text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-secondary transition-colors text-sm"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Telegram: @Bosaboss_CEO</span>
                  </a>
                  <a
                    href="tel:407-777-2772"
                    className="flex items-center justify-center space-x-2 bg-white text-red-primary px-3 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors text-sm"
                  >
                    <Phone className="h-3 w-3" />
                    <span>407-777-2772</span>
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@email.com"
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
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    placeholder="Dallas"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        State <span className="text-red-primary">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 bg-black-primary/80 border border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors text-sm"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                      >
                        <option value="">State</option>
                        <option value="TX">TX</option>
                        <option value="CA">CA</option>
                        <option value="FL">FL</option>
                        {/* Add more states */}
                      </select>
                    </div>
                    <Input
                      label="ZIP"
                      placeholder="75201"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* CDL Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">CDL Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="CDL Number"
                    placeholder="CDL123456789"
                    value={formData.cdlNumber}
                    onChange={(e) => handleInputChange('cdlNumber', e.target.value)}
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      CDL Class <span className="text-red-primary">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-black-primary/80 border border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors text-sm"
                      value={formData.cdlClass}
                      onChange={(e) => handleInputChange('cdlClass', e.target.value)}
                      required
                    >
                      <option value="">Select class</option>
                      <option value="A">Class A</option>
                      <option value="B">Class B</option>
                      <option value="C">Class C</option>
                    </select>
                  </div>
                  <Input
                    label="CDL Expiration Date"
                    type="date"
                    value={formData.cdlExpiration}
                    onChange={(e) => handleInputChange('cdlExpiration', e.target.value)}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Years of Experience <span className="text-red-primary">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-black-primary/80 border border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors text-sm"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      required
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years (New driver)</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Equipment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Truck Type <span className="text-red-primary">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-black-primary/80 border border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors text-sm"
                      value={formData.truckType}
                      onChange={(e) => handleInputChange('truckType', e.target.value)}
                      required
                    >
                      <option value="">Select truck type</option>
                      <option value="owner-operator">Owner Operator</option>
                      <option value="company-driver">Company Driver</option>
                      <option value="team-driver">Team Driver</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Preferred Trailer Type <span className="text-red-primary">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-black-primary/80 border border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-1 focus:ring-red-primary focus:outline-none transition-colors text-sm"
                      value={formData.trailerType}
                      onChange={(e) => handleInputChange('trailerType', e.target.value)}
                      required
                    >
                      <option value="">Select trailer type</option>
                      <option value="dry-van">Dry Van</option>
                      <option value="reefer">Refrigerated</option>
                      <option value="flatbed">Flatbed</option>
                      <option value="step-deck">Step Deck</option>
                      <option value="lowboy">Lowboy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Insurance & Authority */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Insurance & Authority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Insurance Carrier"
                    placeholder="Progressive Commercial"
                    value={formData.insuranceCarrier}
                    onChange={(e) => handleInputChange('insuranceCarrier', e.target.value)}
                    required
                  />
                  <Input
                    label="Policy Number"
                    placeholder="POL123456789"
                    value={formData.policyNumber}
                    onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                    required
                  />
                  <Input
                    label="MC Number"
                    placeholder="MC-123456"
                    value={formData.mcNumber}
                    onChange={(e) => handleInputChange('mcNumber', e.target.value)}
                  />
                  <Input
                    label="DOT Number"
                    placeholder="DOT123456"
                    value={formData.dotNumber}
                    onChange={(e) => handleInputChange('dotNumber', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Lanes"
                    placeholder="TX-CA, Southeast, etc."
                    value={formData.preferredLanes}
                    onChange={(e) => handleInputChange('preferredLanes', e.target.value)}
                  />
                  <Input
                    label="Home Base"
                    placeholder="Dallas, TX"
                    value={formData.homeBase}
                    onChange={(e) => handleInputChange('homeBase', e.target.value)}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Available Start Date"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => handleInputChange('availableDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-black-primary/50 p-4 rounded-lg mb-6">
                <h4 className="text-base font-semibold text-white mb-2">Required Documents</h4>
                <p className="text-white/80 mb-3 text-sm">
                  Please have the following documents ready to upload after submitting your application:
                </p>
                <ul className="space-y-1 text-sm text-white/80">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-red-primary rounded-full mr-2"></div>
                    Valid CDL (both sides)
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-red-primary rounded-full mr-2"></div>
                    Insurance Certificate
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-red-primary rounded-full mr-2"></div>
                    MC Authority (if applicable)
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-red-primary rounded-full mr-2"></div>
                    W-9 Form
                  </li>
                </ul>
              </div>

              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DriverSignUp;