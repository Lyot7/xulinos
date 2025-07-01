import React from 'react';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ name, icon, className = '', onClick, ...props }, ref) => {
    
    return (
      <button
        ref={ref}
        className={`bg-primary py-2 px-4 rounded-xl text-white hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary transition-all duration-200 ease-in-out ${className}`}
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

export default PrimaryButton;