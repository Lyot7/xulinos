import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, onClick, className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <button
        ref={ref}
        className={`
          ${sizeClasses[size]}
          bg-transparent text-white rounded-xl
          hover:bg-white/10 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
          active:bg-white/20 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
          transition-all duration-200 ease-in-out
          flex items-center justify-center
          ${className || ''}
        `}
        onClick={onClick}
        {...props}
      >
        <span className={`${iconSizeClasses[size]} flex items-center justify-center`}>
          {icon}
        </span>
      </button>
    );
  }
);

export default IconButton; 