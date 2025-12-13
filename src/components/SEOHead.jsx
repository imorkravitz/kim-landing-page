import { useEffect } from 'react';

export default function SEOHead({ 
  title = "קים גפסון | תזונה מאפשרת - דיאטנית קלינית",
  description = "קים גפסון - דיאטנית קלינית מוסמכת עם 12 שנות ניסיון. ליווי תזונתי אישי עם גישת 80:20, אפליקציית Liveat ותמיכה יומית בוואטסאפ. הצטרפי ל-5,000+ מטופלות מרוצות.",
  keywords = "קים גפסון, קים גפסון קרביץ, תזונה, דיאטה, נשים, גניקולוגיה, גניקולוגית, רפואה, דיאטנית קלינית, תזונה מאפשרת, ירידה במשקל, תזונה בריאה, ליווי תזונתי, אפליקציית תזונה, Liveat, דיאטנית ראשון לציון",
  image = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/eeac41e3b_kim-t.png",
  url = "https://tzuna-maafsheret.com"
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or create meta tag
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'קים גפסון');
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', 'Hebrew');
    setMetaTag('revisit-after', '7 days');

    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:locale', 'he_IL', true);
    setMetaTag('og:site_name', 'תזונה מאפשרת - קים גפסון', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Add structured data (JSON-LD)
    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "תזונה מאפשרת - קים גפסון",
      "description": description,
      "image": image,
      "url": url,
      "@id": url,
      "telephone": "+972-50-1234567",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "רוטשילד 25",
        "addressLocality": "ראשון לציון",
        "addressCountry": "IL"
      },
      "priceRange": "₪₪",
      "openingHours": "Su-Th 09:00-18:00",
      "sameAs": [
        "https://www.instagram.com/kim_gafson"
      ],
      "founder": {
        "@type": "Person",
        "name": "קים גפסון",
        "jobTitle": "דיאטנית קלינית",
        "description": "דיאטנית קלינית מוסמכת עם 12 שנות ניסיון בליווי תזונתי אישי"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "5000"
      }
    };
    
    scriptElement.textContent = JSON.stringify(structuredData);

    // Cleanup function
    return () => {
      // Optional: clean up on unmount if needed
    };
  }, [title, description, keywords, image, url]);

  return null;
}