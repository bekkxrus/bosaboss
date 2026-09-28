import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, Shield, Clock, Star, ArrowRight, Globe, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home: React.FC = () => {
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-hero-gradient bg-hero-pattern bg-cover bg-center bg-no-repeat min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-4xl animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Your All-in-One <span className="text-red-primary bg-gradient-to-r from-red-primary to-red-secondary bg-clip-text text-transparent animate-glow-pulse">Logistics & Dispatch</span> Partner
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl leading-relaxed">
              We don't just find loads — we build careers and partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quote">
                <Button size="lg" className="w-full sm:w-auto shadow-red-glow-lg">
                  Request a Quote
                </Button>
              </Link>
              <Link to="/join-driver">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Join Our Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              What We <span className="text-red-primary">Offer</span>
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

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg" className="group">
                View All Services 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose BosaBoss */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="text-red-primary">BosaBoss</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Whether you're an independent driver looking for a trusted dispatch partner or a fleet-ready 
              driver wanting to join a reliable carrier, BosaBoss has the tools, team, and network to keep you moving.
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

      {/* Testimonials */}
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

      {/* Mission Statement */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
              More Than a Service — We're Your <span className="text-red-primary">Logistics Family</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              Our approach is simple: support every client like they're part of our fleet. 
              Let us handle the logistics, so you can focus on the drive.
            </p>
            <div className="bg-red-primary/10 border-2 border-red-primary/30 rounded-xl p-8 shadow-red-glow">
              <p className="text-lg md:text-xl text-white font-bold leading-relaxed">
                "At BosaBoss, we don't just find loads — we build careers and partnerships. 
                With over 7 years of experience, we've grown into a full-service logistics company 
                that operates nationwide, always putting drivers first."
              </p>
            </div>
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
            <Link to="/quote">
              <Button variant="secondary" size="lg" className="bg-white text-red-primary hover:bg-white/90 shadow-red-glow-lg">
                Get Free Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-primary">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;