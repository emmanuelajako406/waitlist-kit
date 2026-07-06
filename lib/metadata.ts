import { Metadata } from "next";
import { WAITLIST_CONTENT } from "@/content/WaitList";
// Interface for custom overrides when calling the generator
interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}


/**
 * Metadata Generator Utility
 * Combines global fallback SEO defaults with page-specific overrides.
 */
export function generateMetadata({
  title,
  description,
  image = WAITLIST_CONTENT.seo.ogImage,
  url = WAITLIST_CONTENT.seo.url,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  
  // Format the page title (e.g., "Login | Odota" or use global fallback if root)
  const fullTitle = title 
    ? `${title}` 
    : WAITLIST_CONTENT.seo.title;

  const fullDescription = description || WAITLIST_CONTENT.seo.description;

  return {
    title: fullTitle,
    description: fullDescription,
    
    // Core search engine crawler configurations
    metadataBase: new URL(WAITLIST_CONTENT.seo.url),
    alternates: {
      canonical: url,
    },
    
    // Open Graph standard (Facebook, LinkedIn, Discord, WhatsApp)
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: "Waitlist Kit",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${fullTitle} social sharing banner preview`,
        },
      ],
      type: "website",
    },

    // X / Twitter Cards positioning formatting
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: WAITLIST_CONTENT.seo.twitterHandle,
    },

    // Prevent search engine indexing for staging links, dashboards, or thank-you routes
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}