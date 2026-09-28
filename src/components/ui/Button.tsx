import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-primary/50';
  
  const variantClasses = {
    primary: 'bg-button-gradient text-white shadow-red-glow hover:shadow-red-glow-lg hover:brightness-110',
    secondary: 'bg-black-primary border-2 border-red-primary text-white hover:bg-red-primary hover:text-white hover:shadow-red-glow',
    outline: 'border-2 border-red-primary text-red-primary bg-transparent hover:bg-red-primary hover:text-white hover:shadow-red-glow',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''
  }`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;