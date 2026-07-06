import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils"; // Standard Tailwind class merger utility

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * The text label displayed above the input field
   */
  label?: string;
  
  /**
   * Validation error message. If provided, applies error styling to the field
   */
  error?: string;
  
  /**
   * Descriptive subtext displayed below the input field
   */
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, disabled, ...props }, ref) => {
    // Generate a unique ID for accessibility mapping between label and input
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {/* Render Label if provided */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium transition-colors",
              disabled ? "text-foreground/20" : "text-foreground/80", // Uses theme foreground opacity
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Field Wrapping Container */}
        <div className="relative rounded-full shadow-sm">
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              // Base interactive styles utilizing the theme background and foreground tokens
              "block w-full px-4 py-2.5 rounded-full bg-background border text-foreground text-sm transition-all focus:outline-none focus:ring-2 placeholder-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed",
              
              // Default styling with theme primary configuration vs Error validation styling
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : "border-foreground/20 focus:border-primary focus:ring-primary/20 hover:border-foreground/30", // ✨ Swapped blue for your theme's primary token
              
              className
            )}
            {...props}
          />
        </div>

        {/* Error Messaging Block */}
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        {/* Helper Contextual Text (only shows if there is no error) */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-foreground/50">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };