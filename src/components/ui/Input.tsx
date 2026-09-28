import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-white">
          {label} {required && <span className="text-red-primary">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 bg-black-primary/80 border-2 border-red-primary/30 rounded-lg text-white placeholder-red-primary/50 focus:border-red-primary focus:ring-2 focus:ring-red-primary/30 focus:outline-none transition-all duration-300 hover:border-red-primary/50"
      />
    </div>
  );
};

export default Input;