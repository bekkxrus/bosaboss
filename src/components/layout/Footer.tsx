import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-section-gradient border-t border-red-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 group">
              <img 
                src="/photo_2025-07-06_20.35.24-removebg-preview.png" 
                alt="Bosaboss Logo" 
               className="h-24 w-auto transition-transform duration-700 group-hover:scale-110 animate-logo-pulse"
              />
            </div>
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Reliable trucking and dispatch services across the USA. We connect shippers with qualified drivers 
              and provide comprehensive logistics solutions for your transportation needs.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-white/60 hover:text-red-primary cursor-pointer transition-all duration-300 hover:scale-110" />
              <Twitter className="h-5 w-5 text-white/60 hover:text-red-primary cursor-pointer transition-all duration-300 hover:scale-110" />
              <Instagram className="h-5 w-5 text-white/60 hover:text-red-primary cursor-pointer transition-all duration-300 hover:scale-110" />
              <Linkedin className="h-5 w-5 text-white/60 hover:text-red-primary cursor-pointer transition-all duration-300 hover:scale-110" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <Phone className="h-4 w-4 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/80 group-hover:text-white transition-colors duration-300">407-777-2772</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="h-4 w-4 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/80 group-hover:text-white transition-colors duration-300">info@bosaboss.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="h-4 w-4 text-red-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white/80 group-hover:text-white transition-colors duration-300">123 Logistics Ave, Dallas, TX 75201</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-white/80 hover:text-red-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">Our Services</a></li>
              <li><a href="/quote" className="text-white/80 hover:text-red-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">Get Quote</a></li>
              <li><a href="/join-driver" className="text-white/80 hover:text-red-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">Driver Portal</a></li>
              <li><a href="/contact" className="text-white/80 hover:text-red-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-primary/30 mt-8 pt-8 text-center">
          <p className="text-white/60">
            &copy; 2024 Bosaboss Trucking & Dispatch. All rights reserved. | 
            <span className="text-white/40"> Privacy Policy | Terms of Service</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;