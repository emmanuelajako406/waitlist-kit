import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils'; // Adjust path based on your directory structure

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   * @default "primary"
   */
  variant?: 'primary' | 'outline';
  
  /**
   * Sizing adjustment configurations
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Puts the button into a disabled visual state and displays a loading spinner
   * @default false
   */
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    
    // Base styles applied to all button configurations
    const baseStyles = `inline-flex cursor-pointer items-center 
    justify-center font-medium rounded-full 
    transition-all focus:outline-none 
    hover:opacity-80
    disabled:opacity-50 disabled:pointer-events-none 
    active:scale-[0.98] transform duration-300`;

    // Style variants
    const variants = {
      primary: 'bg-primary text-background border border-transparent shadow-md',
      outline: 'bg-transparent  text-foreground/90 border border-foreground/90 hover:border-foreground',
    };

    // Size variants
    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            {/* Minimal SVG Loading Spinner */}
            <svg 
              className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };