import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, style }) => {
  const baseClasses = 'bg-card-gradient border border-red-primary/20 rounded-lg p-6 backdrop-blur-sm';
  const hoverClasses = hover ? 'hover:border-red-primary/40 hover:shadow-card-glow hover:bg-gradient-to-br hover:from-black-primary hover:to-black-secondary transition-all duration-300 hover:-translate-y-1' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className} animate-fade-in`} style={style}>
      {children}
    </div>
  );
};

export default Card;