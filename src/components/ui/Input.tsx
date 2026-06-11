// ============================================
// DermaScan — Input Component
// ============================================

import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  icon,
  error,
  hint,
  type = 'text',
  className = '',
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          style={{
            width: '100%',
            borderRadius: '12px',
            border: error ? '1px solid #f87171' : '1px solid #e5e7eb',
            backgroundColor: '#fff',
            paddingLeft: icon ? '2.75rem' : '1rem',
            paddingRight: isPassword ? '2.75rem' : '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            fontSize: '0.875rem',
            color: '#111827',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#f87171' : '#0d6b5e';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(248,113,113,0.2)'
              : '0 0 0 3px rgba(42,112,112,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#f87171' : '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
