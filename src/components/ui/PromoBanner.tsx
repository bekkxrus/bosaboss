import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-primary to-red-secondary text-white relative overflow-hidden shadow-red-glow">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-black">
            BosaBoss - Professional Trucking & Dispatch Services
          </h3>
          
          <div className="flex space-x-4">
            <a
              href="tel:407-777-2772"
              className="flex items-center justify-center space-x-2 bg-white text-red-primary px-4 py-2 rounded-lg font-bold hover:bg-white/90 transition-all duration-300 text-sm shadow-lg hover:scale-105 transform"
            >
              <Phone className="h-3 w-3" />
              <span>407-777-2772</span>
            </a>
            <a
              href="https://t.me/Bosaboss_CEO"
              className="flex items-center justify-center space-x-2 bg-black/50 text-white px-4 py-2 rounded-lg font-bold hover:bg-black/70 transition-all duration-300 text-sm border border-white/30 hover:scale-105 transform"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;