import React from 'react';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ name, icon, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          bg-transparent text-white border border-white py-2 px-4 rounded-xl
          hover:bg-white/10 hover:shadow-md hover:border-white/80
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
          active:bg-white/20 active:scale-95 active:border-white/60
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
          transition-all duration-200 ease-in-out
          ${className || ''}
        `}
        onClick={onClick}
        {...props}
      >
        {icon && (
          <span className="mr-2 w-4 h-4">
            {icon}
          </span>
        )}
        {name}
      </button>
    );
  }
);

export default SecondaryButton; 