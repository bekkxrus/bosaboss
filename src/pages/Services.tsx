import React, { useState } from 'react';
import { Truck, Users, Package, Shield, Clock, Phone, FileText, Globe, Award } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'dispatching'>('logistics');

  const logisticsServices = [
    {
      icon: Users,
      title: 'Owner-Operator Management',
      description: 'Comprehensive support for independent owner-operators with consistent freight and dedicated assistance.',
      features: ['Consistent freight opportunities', 'Dedicated account management', 'Fuel advances available', 'Transparent payment terms'],
    },
    {
      icon: Truck,
      title: 'Lease Driver Programs',
      description: 'Flexible lease options for drivers looking to build their own trucking business with our support.',
      features: ['Flexible lease terms', 'Maintenance support', 'Insurance assistance', 'Business development guidance'],
    },
    {
      icon: Package,
      title: 'Company Driver Positions',
      description: 'Stable employment opportunities with competitive benefits and consistent home time.',
      features: ['Competitive salary packages', 'Health benefits', 'Consistent home time', 'Career advancement'],
    },
    {
      icon: Shield,
      title: 'Fleet Management',
      description: 'Complete fleet oversight including maintenance scheduling, compliance, and performance optimization.',
      features: ['Preventive maintenance', 'DOT compliance', 'Performance tracking', 'Cost optimization'],
    },
  ];

  const dispatchingServices = [
    {
      icon: Phone,
      title: 'Load Booking & Negotiation',
      description: 'Expert load booking with skilled negotiators securing the best rates for your routes.',
      features: ['Premium load boards access', 'Rate optimization', 'Route planning', 'Broker relationships'],
    },
    {
      icon: FileText,
      title: 'Paperwork Management',
      description: 'Complete handling of all shipping documentation, permits, and compliance requirements.',
      features: ['BOL processing', 'Permit acquisition', 'Invoice management', 'Digital record keeping'],
    },
    {
      icon: Clock,
      title: '24/7 Dispatch Support',
      description: 'Round-the-clock assistance from experienced dispatch professionals who understand the road.',
      features: ['24/7 availability', 'Emergency support', 'Real-time communication', 'Problem resolution'],
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Dispatch services available in multiple languages including English, Spanish, and Russian.',
      features: ['English support', 'Spanish support', 'Russian support', 'Cultural understanding'],
    },
  ];

  const currentServices = activeTab === 'logistics' ? logisticsServices : dispatchingServices;

  const inHouseDepartments = [
    {
      title: 'Experienced Dispatchers',
      description: 'Seasoned professionals with deep industry knowledge and proven track records.',
      icon: Users,
    },
    {
      title: 'Safety Coordinators',
      description: 'Dedicated safety professionals ensuring compliance and maintaining high standards.',
      icon: Shield,
    },
    {
      title: 'Accounting Professionals',
      description: 'Transparent financial management with timely payments and clear reporting.',
      icon: FileText,
    },
    {
      title: 'Fleet Support Teams',
      description: 'Comprehensive operational support for all your trucking needs.',
      icon: Truck,
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-in">
            Our <span className="text-red-primary">Services</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up">
            Comprehensive logistics and dispatch solutions designed to elevate your trucking experience. 
            We don't just find loads — we build careers and partnerships.
          </p>
        </div>
      </section>

      {/* Service Toggle */}
      <section className="py-12 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-black-primary/50 rounded-xl p-2 flex border-2 border-red-primary/30 shadow-red-glow">
              <button
                className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === 'logistics'
                    ? 'bg-button-gradient text-white shadow-red-glow'
                    : 'text-white/70 hover:text-white hover:bg-red-primary/20'
                }`}
                onClick={() => setActiveTab('logistics')}
              >
                Logistics Solutions
              </button>
              <button
                className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === 'dispatching'
                    ? 'bg-button-gradient text-white shadow-red-glow'
                    : 'text-white/70 hover:text-white hover:bg-red-primary/20'
                }`}
                onClick={() => setActiveTab('dispatching')}
              >
                Dispatch Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} hover className="group">
                  <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{service.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-white/80">
                        <div className="w-2 h-2 bg-red-primary rounded-full mr-3 group-hover:shadow-red-glow transition-all duration-300"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-House Departments */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              <span className="text-red-primary">In-House</span> Departments
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              All our essential services are handled by experienced professionals under one roof, 
              ensuring seamless coordination and superior service quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {inHouseDepartments.map((dept, index) => {
              const IconComponent = dept.icon;
              return (
                <Card key={index} className="text-center group" hover>
                  <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{dept.title}</h3>
                  <p className="text-white/70 leading-relaxed">{dept.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose BosaBoss */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="text-red-primary">BosaBoss</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our commitment to transparency, reliability, and experience sets us apart in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-slide-up">
              <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <Shield className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">Transparency</h3>
              <p className="text-white/70 leading-relaxed">No hidden fees, no surprises — just honest support and clear communication.</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <Clock className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">24/7 Reliability</h3>
              <p className="text-white/70 leading-relaxed">Round-the-clock assistance so you're never alone on the road.</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <Award className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">7+ Years Experience</h3>
              <p className="text-white/70 leading-relaxed">Seasoned team with deep industry knowledge and proven results.</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                <Users className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">Family Approach</h3>
              <p className="text-white/70 leading-relaxed">You're not just a number — you're part of our logistics family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              <span className="text-red-primary">Future</span> Innovations
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              We're constantly evolving to better serve our drivers and clients with cutting-edge solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card hover>
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="h-10 w-10 text-red-primary" />
                <h3 className="text-xl font-bold text-white">Mobile App Development</h3>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                A comprehensive mobile app for drivers to manage loads, view available freight, 
                and communicate with dispatch teams in real-time.
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Real-time load management
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Available freight browsing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Direct dispatch communication
                </li>
              </ul>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-10 w-10 text-red-primary" />
                <h3 className="text-xl font-bold text-white">Strategic Partnerships</h3>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Building strong alliances with brokers, shippers, and service providers to 
                enhance our offerings and secure better opportunities for our drivers.
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Premium broker relationships
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Insurance & factoring partnerships
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                  Fuel card & equipment providers
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-button-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to Experience the BosaBoss Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let us handle the logistics while you focus on the drive. 
            Join our logistics family and experience what it means to be truly supported.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-red-primary hover:bg-white/90 shadow-red-glow-lg">
              Request Quote
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-primary">
              Join Our Network
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;