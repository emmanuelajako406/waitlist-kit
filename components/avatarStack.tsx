import Image from "next/image";
import { cn } from "@/lib/utils"; // Standard Tailwind class merger utility

interface AvatarStackProps {
  /**
   * Array of image URLs for the avatars
   */
  images: string[];
  
  /**
   * Optional text string to display alongside the avatar pile
   */
  text?: string;
  
  /**
   * Layout position of the text relative to the avatars
   * @default "right"
   */
  textPosition?: "left" | "right" | "top" | "bottom";
  
  /**
   * The explicit width/height dimensions for each avatar image in pixels
   * @default 40
   */
  avatarSize?: number;
  
  /**
   * Custom CSS classes for the main wrapping container
   */
  className?: string;
  
  /**
   * Custom CSS classes for the text block
   */
  textClassName?: string;
}

export function AvatarStack({
  images,
  text,
  textPosition = "right",
  avatarSize = 40,
  className = "",
  textClassName = "",
}: AvatarStackProps) {
  
  // Maps all 4 structural positions to proper Tailwind flex utility rules
  const positionClasses = {
    right: "flex-row items-center text-left gap-4",
    left: "flex-row-reverse items-center text-right gap-4",
    bottom: "flex-col items-center text-center gap-2",
    top: "flex-col-reverse items-center text-center gap-2",
  };

  return (
    <div className={cn("inline-flex select-none", positionClasses[textPosition], className)}>
      
      {/* 👥 The Avatar Overlay Pile */}
      <div className="flex -space-x-3 items-center">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative rounded-full ring-2 ring-foreground/10 shadow-sm  overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105 hover:z-10"
            style={{ 
              width: `${avatarSize}px`, 
              height: `${avatarSize}px`,
              zIndex: images.length - index // Left overlays on top of right
            }}
          >
            <Image
              src={src}
              alt={`Subscriber user avatar profile thumbnail ${index + 1}`}
              width={avatarSize}
              height={avatarSize}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* 📝 Contextual Text String */}
      {text && (
        <span className={cn("text-sm font-medium text-foreground/60 tracking-tight", textClassName)}>
          {text}
        </span>
      )}
      
    </div>
  );
}