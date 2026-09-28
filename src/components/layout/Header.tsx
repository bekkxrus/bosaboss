import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Calculator } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Quote', href: '#quote' },
    { name: 'Join as Driver', href: '#driver' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      // For hash links, we could implement scroll spy logic here
      return false;
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full z-50 bg-black-primary/95 backdrop-blur-sm border-b border-red-primary/30 shadow-red-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('#home')}
            className="flex items-center space-x-2 flex-shrink-0 group"
          >
            <img 
              src="/photo_2025-07-06_20.35.24-removebg-preview.png" 
              alt="Bosaboss Logo" 
             className="h-28 w-auto transition-transform duration-700 group-hover:scale-110 animate-logo-pulse"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap relative group ${
                  isActive(item.href)
                    ? 'text-red-primary'
                    : 'text-white hover:text-red-primary'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-primary transition-all duration-300 group-hover:w-full ${
                  isActive(item.href) ? 'w-full' : ''
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Quote CTA - Desktop */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <button
              onClick={() => handleNavClick('#quote')}
              className="flex items-center space-x-2 bg-button-gradient hover:bg-red-secondary text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-red-glow hover:shadow-red-glow-lg transform hover:scale-105"
            >
              <Calculator className="h-4 w-4" />
              <span className="text-sm font-semibold">Get a Quote</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2 hover:text-red-primary transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-red-primary/30 bg-black-primary/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-semibold transition-all duration-300 py-2 px-4 rounded-lg text-left ${
                    isActive(item.href)
                      ? 'text-red-primary bg-red-primary/10'
                      : 'text-white hover:text-red-primary hover:bg-red-primary/10'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Quote CTA */}
              <div className="pt-4 border-t border-red-primary/30">
                <button
                  onClick={() => handleNavClick('#quote')}
                  className="flex items-center space-x-2 bg-button-gradient hover:bg-red-secondary text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-red-glow w-fit"
                >
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-semibold">Get a Quote</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;