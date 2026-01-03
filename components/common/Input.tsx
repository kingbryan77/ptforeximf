import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactElement<{ className?: string }>;
  error?: string;
  id: string; 
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  type = 'text',
  id,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  const inputType = isPasswordType && showPassword ? 'text' : type;

  // Default background is darkblue2, but allow override via className
  const baseBgClass = className?.includes('bg-') ? '' : 'bg-darkblue2';

  return (
    <div className={`mb-0 ${className?.includes('mb-') ? '' : ''}`}> {/* Removed default mb-4 to let parent control spacing if needed, actually kept generic container styling */}
      {label && (
        <label htmlFor={id} className="block text-gray-300 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, { className: 'h-5 w-5 text-gray-500' })}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          className={`block w-full px-4 py-3 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors duration-200
            ${baseBgClass}
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;