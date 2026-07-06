import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/content/brand";

interface LogoProps {
  /**
   * The source URL for the logo image.
   * @default BRAND.logo
   */
  imageSrc?: string;

  /**
   * The brand name text string to display.
   * @default BRAND.name
   */
  text?: string;

  /**
   * Width of the logo image in pixels
   * @default 50
   */
  width?: number;
  
  /**
   * Height of the logo image in pixels
   * @default 50
   */
  height?: number;
  
  /**
   * Position of the text relative to the logo image
   * @default "right"
   */
  textPosition?: "left" | "top" | "right" | "bottom";

  /**
   * Size of the container div
   * @default 10 (h-10 w-10)
   */
  containerSize?: number;
  
  /**
   * Custom CSS classes for the logo container
   */
  className?: string;
  
  /**
   * Custom CSS classes for the text
   */
  textClassName?: string;
}

/**
 * Logo Component
 * * Renders a customizable brand logo and text combination that links to the homepage.
 * Now fully modular with overrides for independent image assets and typography.
 */
export default function Logo({
  imageSrc = BRAND.logo,
  text = "",
  width = 50,
  height = 50,
  textPosition = "right",
  containerSize = 10,
  className = "",
  textClassName = "",
}: LogoProps) {
  
  // Maps the position prop to corresponding Tailwind layout utility classes
  const positionClasses = {
    right: "flex-row items-center text-left",
    left: "flex-row-reverse items-center text-right",
    bottom: "flex-col items-center text-center",
    top: "flex-col-reverse items-center text-center",
  };

  return (
    <Link 
      href="/" 
      className={`flex gap-3 ${positionClasses[textPosition]} ${className}`}
    >
      {/* Logo Image Container */}
      <div 
        className={`flex h-${containerSize} w-${containerSize} items-center justify-center rounded-full shrink-0`}
      >
        <Image
          src={imageSrc}
          alt={`${text} logo`} // Dynamically generates accessible alternative descriptions
          width={width}
          height={height}
          loading="eager"
          priority
        />
      </div>
      
      {/* Brand Text */}
        <span className={`text-foreground text-lg 
          font-semibold tracking-tight ${textClassName}`}>
          {text}
        </span>
    </Link>
  );
}