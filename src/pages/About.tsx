import React from 'react';
import { Award, Users, Calendar, MapPin, Globe, Shield, Clock, Heart } from 'lucide-react';
import Card from '../components/ui/Card';

const About: React.FC = () => {
  const milestones = [
    { year: '2017', title: 'Company Founded', description: 'Started with a vision to elevate the trucking experience for professionals' },
    { year: '2019', title: 'Nationwide Expansion', description: 'Extended services across all 48 contiguous states' },
    { year: '2021', title: '1000+ Drivers', description: 'Built a network of over 1000 qualified drivers and owner-operators' },
    { year: '2023', title: 'In-House Departments', description: 'Established comprehensive in-house logistics and support teams' },
    { year: '2024', title: 'Technology Innovation', description: 'Launched advanced tracking and mobile app development' },
  ];

  const stats = [
    { icon: Users, value: '2,500+', label: 'Active Drivers' },
    { icon: MapPin, value: '48', label: 'States Covered' },
    { icon: Award, value: '99.8%', label: 'On-Time Delivery' },
    { icon: Calendar, value: '24/7', label: 'Support Available' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'No hidden fees, no surprises — just honest support and clear communication in every interaction.',
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: '24/7 assistance, so you\'re never alone on the road. Our team is always here when you need us.',
    },
    {
      icon: Award,
      title: 'Experience',
      description: 'Our seasoned team brings deep industry knowledge and proven results from 7+ years in trucking.',
    },
    {
      icon: Heart,
      title: 'Partnership',
      description: 'You\'re not just a number — you\'re part of the team. We support every client like family.',
    },
  ];

  const departments = [
    {
      title: 'Experienced Dispatchers',
      description: 'Professional load booking, broker communication, and rate negotiation',
    },
    {
      title: 'Safety Coordinators',
      description: 'Ensuring compliance and maintaining the highest safety standards',
    },
    {
      title: 'Accounting Professionals',
      description: 'Transparent financial management and timely payment processing',
    },
    {
      title: 'Fleet Support Teams',
      description: 'Comprehensive support for all your operational needs',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              About <span className="text-red-primary">BosaBoss</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-primary font-bold mb-8">
              Your All-in-One Logistics & Dispatch Partner
            </p>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              BosaBoss was built from the ground up with one mission: to elevate the experience of trucking 
              professionals by offering comprehensive, in-house logistics and dispatch solutions that put drivers first. 
              With over 7 years of experience in the trucking industry, we've grown from a small team into a 
              full-service logistics company that operates nationwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2 group-hover:text-red-primary transition-colors duration-300">{stat.value}</div>
                  <div className="text-white/70 font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                What We <span className="text-red-primary">Offer</span>
              </h2>
              <div className="space-y-8">
                <div className="group">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">Logistics Solutions</h3>
                  <p className="text-white/80 leading-relaxed">
                    Hiring and managing owner-operators, lease drivers, and company drivers with 
                    consistent freight and 24/7 support.
                  </p>
                </div>
                <div className="group">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">Professional Dispatch Services</h3>
                  <p className="text-white/80 leading-relaxed">
                    Load booking, broker communication, rate negotiation, and complete paperwork management.
                  </p>
                </div>
                <div className="group">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">In-House Departments</h3>
                  <p className="text-white/80 leading-relaxed">
                    Including experienced dispatchers, safety coordinators, accounting professionals, 
                    and fleet support teams all under one roof.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <Card key={index} hover>
                  <h3 className="text-lg font-bold text-white mb-3">{dept.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{dept.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Our Core <span className="text-red-primary">Values</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              These principles guide everything we do and define how we serve our drivers and clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center group" hover>
                  <div className="bg-red-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-10 w-10 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-white/70 leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Our <span className="text-red-primary">Journey</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              From humble beginnings to industry leadership, here's how we've grown to serve you better.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex-shrink-0 w-32">
                  <div className="bg-button-gradient text-white px-6 py-3 rounded-full text-center font-black shadow-red-glow hover:shadow-red-glow-lg transition-all duration-300 hover:scale-105 transform">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1" hover>
                  <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                  <p className="text-white/70 leading-relaxed">{milestone.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Looking <span className="text-red-primary">Forward</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our commitment to innovation and growth continues with exciting developments ahead.
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
                enhance our offerings and secure better opportunities.
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

      {/* Multilingual Support */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
              <span className="text-red-primary">Multilingual</span> Support
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              We serve drivers from diverse backgrounds with support in multiple languages including 
              English, Spanish, Russian, and more. Communication should never be a barrier to success.
            </p>
            <div className="bg-red-primary/10 border-2 border-red-primary/30 rounded-xl p-8 max-w-2xl mx-auto shadow-red-glow">
              <p className="text-lg text-white font-bold mb-6 leading-relaxed">
                "Our approach is simple: support every client like they're part of our fleet. 
                That's what makes BosaBoss more than a service — we're your logistics family."
              </p>
              <p className="text-red-primary font-black text-xl">— The BosaBoss Team</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;