import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Headphones, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general',
    language: 'english',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
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
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim() || null,
        message: formData.message.trim(),
        inquiry_type: formData.inquiryType,
        status: 'new' as const,
      };

      const { data, error: supabaseError } = await supabase
        .from('contact_messages')
        .insert(contactData)
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        
        if (supabaseError.code === 'PGRST116') {
          setError('Contact form is temporarily unavailable. Please call us directly.');
        } else if (supabaseError.code === '42501') {
          setError('Contact form is temporarily unavailable. Please call us directly.');
        } else {
          setError('Failed to send message. Please try again or contact us directly.');
        }
        return;
      }

      console.log('Contact message submitted successfully:', data);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general',
        language: 'english',
      });

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const departments = [
    {
      icon: MessageSquare,
      title: 'Sales & Quotes',
      description: 'Get pricing and discuss shipping requirements with our logistics experts',
      contact: 'sales@bosaboss.com',
      phone: '(555) 123-4567 ext. 1',
    },
    {
      icon: Headphones,
      title: 'Dispatch Support',
      description: '24/7 support for active drivers and loads with experienced dispatchers',
      contact: 'dispatch@bosaboss.com',
      phone: '(555) 123-4567 ext. 2',
    },
    {
      icon: Phone,
      title: 'Driver Relations',
      description: 'Support for current and prospective drivers in multiple languages',
      contact: 'drivers@bosaboss.com',
      phone: '407-777-2772',
    },
  ];

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'russian', name: 'Русский', flag: '🇷🇺' },
  ];

  if (isSubmitted) {
    return (
      <div className="pt-16">
        <section className="py-20 bg-hero-gradient min-h-screen flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="animate-fade-in">
              <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-8 animate-glow-pulse" />
              <h1 className="text-3xl font-black text-white mb-6">
                Message Sent Successfully!
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Thank you for contacting us. We've received your message and will get back to you 
                within 2 hours during business hours.
              </p>
              <div className="bg-black-primary/50 p-6 rounded-lg mb-8 border border-red-primary/30">
                <p className="text-sm text-red-primary mb-3 font-bold">What happens next?</p>
                <ul className="text-sm text-white/80 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    Our team will review your message
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    We'll prepare a detailed response
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    You'll receive an email reply
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-primary rounded-full mr-3"></div>
                    We may follow up with a phone call if needed
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
                  Send Another Message
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
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 animate-fade-in">
            Contact <span className="text-red-primary">BosaBoss</span>
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up">
            Get in touch with our logistics family. We're here to help with your shipping needs, 
            driver questions, and business partnerships. Support available in multiple languages.
          </p>
          
          {/* Quick Contact for Drivers */}
          <div className="bg-red-primary/20 border-2 border-red-primary/50 rounded-xl p-6 max-w-2xl mx-auto shadow-red-glow animate-fade-in">
            <h3 className="text-lg font-black text-white mb-4">🚛 Owner Operators - Apply Now!</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:407-777-2772"
                className="flex items-center justify-center space-x-2 bg-button-gradient text-white px-6 py-3 rounded-lg font-bold hover:bg-red-secondary transition-all duration-300 text-sm shadow-red-glow hover:scale-105 transform"
              >
                <Phone className="h-4 w-4" />
                <span>Call: 407-777-2772</span>
              </a>
              <a
                href="tel:407-777-2772"
                className="flex items-center justify-center space-x-2 bg-white text-red-primary px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-all duration-300 text-sm hover:scale-105 transform"
              >
                <Phone className="h-4 w-4" />
                <span>Call: 407-777-2772</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Department Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon;
              return (
                <Card key={index} hover className="group">
                  <div className="bg-red-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-primary/30 transition-all duration-300 group-hover:shadow-red-glow">
                    <IconComponent className="h-6 w-6 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-primary transition-colors duration-300">{dept.title}</h3>
                  <p className="text-white/70 mb-4 text-sm leading-relaxed">{dept.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-white font-semibold">Email: </span>
                      <span className="text-red-primary font-bold">{dept.contact}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white font-semibold">Phone: </span>
                      <span className="text-red-primary font-bold">{dept.phone}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="animate-fade-in">
              <h2 className="text-xl font-black text-white mb-6">Send us a Message</h2>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Your Name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white">
                      Inquiry Type <span className="text-red-primary">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                      value={formData.inquiryType}
                      onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="quote">Request Quote</option>
                      <option value="driver">Driver Question</option>
                      <option value="dispatch">Dispatch Services</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white">
                      Preferred Language
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-bold text-white">
                    Message <span className="text-red-primary">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white placeholder-red-primary/50 focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300"
                    rows={5}
                    placeholder="Tell us more about your needs..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full shadow-red-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Visit Office */}
              <Card className="animate-slide-up">
                <h3 className="text-lg font-bold text-white mb-4">Visit Our Office</h3>
                <div className="bg-black-primary/50 h-48 rounded-lg mb-4 flex items-center justify-center border border-red-primary/30">
                  <p className="text-white/60 text-sm">Interactive Map Placeholder</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-primary mt-1" />
                    <div>
                      <p className="text-white font-bold text-sm">BosaBoss Trucking & Dispatch</p>
                      <p className="text-white/70 text-sm">123 Logistics Avenue</p>
                      <p className="text-white/70 text-sm">Dallas, TX 75201</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-red-primary" />
                    <p className="text-white/80 text-sm">(555) 123-4567</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-red-primary" />
                    <p className="text-white/80 text-sm">Mon-Fri: 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </Card>

              {/* Driver Quick Apply */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold text-white mb-4">Driver Quick Apply</h3>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">
                  Owner operators can apply immediately through our direct channels for faster processing.
                </p>
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

              {/* Multilingual Support */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-bold text-white mb-4">Multilingual Support</h3>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">
                  We serve drivers and clients from diverse backgrounds with support in multiple languages.
                </p>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.code} className="flex items-center justify-between p-3 bg-black-primary/50 rounded-lg border border-red-primary/20">
                      <span className="text-white font-bold text-sm">{lang.flag} {lang.name}</span>
                      <span className="text-red-primary text-xs font-bold">Available</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emergency Support */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
    </div>
  );
};

export default Contact;