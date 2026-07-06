import { useEffect } from 'react';

export default function SEOHead({ 
  title = "קים גפסון | תזונה מאפשרת - קליניקת דיאטניות",
  description = "קים גפסון - בוגרת תואר בתזונה באוניברסיטה העברית וסטודנטית לרפואה בתל אביב סמלול ה-4 שנתי. עם 12 שנות ניסיון. ליווי תזונתי אישי עם גישת 80:20, אפליקציית Liveat ותמיכה יומית בווצאפ. הצטרפי ל-5,000+ מטופלות מרוצות.",
  keywords = "קים גפסון, קים גפסון קרביץ, קים תזונה ובריאות נשים, דיאטנית קלינית, דיאטנית קלינית לנשים, דיאטנית נשים, תזונאית קלינית, תזונאית לנשים, ליווי תזונתי, ליווי תזונתי לנשים, ירידה במשקל, ירידה במשקל לנשים, דיאטה לנשים, תזונה בריאה, תזונה מאוזנת, תזונה מאפשרת, תזונה מותאמת אישית, תפריט תזונה אישי, תהליך ירידה במשקל, שמירה על המשקל, תזונה בהריון, תזונה אחרי לידה, תזונה בהנקה, תזונה לפוריות, תזונה ל-PCOS, תזונה לאנדומטריוזיס, תזונה לסוכרת, תזונה לנערות, דיאטנית ראשון לציון, תזונאית ראשון לציון, דיאטנית אונליין, תזונאית אונליין, ייעוץ תזונה אונליין, ליווי תזונה בווצאפ, אפליקציית תזונה, Liveat",
  image = "/og-image.jpg",
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
      "@type": "ProfessionalService",
      "name": "תזונה מאפשרת - קים גפסון",
      "description": description,
      "image": image,
      "url": url,
      "@id": url,
      "areaServed": {
        "@type": "Country",
        "name": "IL"
      },
      "priceRange": "₪₪",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "08:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Friday"],
          "opens": "08:00",
          "closes": "16:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/kimgafson"
      ],
      "founder": {
        "@type": "Person",
        "name": "קים גפסון",
        "jobTitle": "בוגרת תואר בתזונה וסטודנטית לרפואה",
        "description": "קים גפסון היא בוגרת תואר בתזונה באוניברסטיה העברית וסטודנטית לרפואה באוניברסיטת תל אביב במסלול ה-4 שנתי. מתמחה בגישה של 80:20, המאפשרת לאכול בריא מבלי לוותר על ההנאות הקטנות של החיים. קים מציעה ליווי תזונתי מותאם אישית, כולל תמיכה יומית בווצאפ ואפליקציית Liveat, ומסייעת למטופלות להשיג את מטרותיהן התזונתיות בצורה בריאה ומאוזנת."
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