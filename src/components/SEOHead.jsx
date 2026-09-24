import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BUSINESS, FOUNDER, activeTeam } from '@/data/clinic';

/**
 * Per-route meta tags and structured data.
 *
 * ── Why the entity graph is shaped the way it is ──────────────────────
 *
 * The primary entity is the CLINIC, not Kim. That is a legal requirement
 * before it is an SEO choice: "דיאטנית קלינית" is a title protected by
 * חוק הדיאטנים, התשע"ו-2016, and Kim is not on the Ministry of Health
 * register. The clinic employs women who are, and they deliver the care.
 *
 * So: MedicalBusiness is the thing that provides the service and can carry
 * the commercial term. Kim hangs off it as `founder` with a truthful,
 * non-clinical jobTitle. Registered dietitians hang off it as `employee`,
 * each carrying her own licence. Google gets a graph that matches reality,
 * and the term stays claimable at the level where it is actually true.
 *
 * This also matters for the knowledge panel, which currently says Kim is a
 * clinical dietitian. Schema alone will not flip it, but a graph that
 * consistently contradicts the old claim is the precondition for the
 * feedback submission to stick.
 *
 * ── Why the tags are also static in index.html ────────────────────────
 *
 * This is a client-rendered SPA, so everything below runs after JS. The
 * Meta/WhatsApp/Bing crawlers do not execute JS at all, and almost all of
 * this site's traffic arrives through links shared on those platforms. The
 * honest defaults therefore live in index.html too; this component only
 * overrides them per route.
 */
export default function SEOHead({
  title = 'קים גפסון | תזונה מאפשרת, קליניקה לליווי תזונתי אישי לנשים',
  description = 'ליווי תזונתי אישי לנשים בגישת 80:20, עם צוות דיאטניות קליניות מוסמכות. תפריט מותאם, תמיכה יומית בווצאפ ואפליקציה תומכת. הקליניקה של קים גפסון, מייסדת "תזונה מאפשרת".',
  /* Kept for the terms the CLINIC can truthfully own. The protected title
     appears here only as a service descriptor, never bound to Kim's name. */
  keywords = 'קים גפסון, קים גפסון קרביץ, תזונה מאפשרת, קליניקת דיאטניות, דיאטנית קלינית לנשים, ליווי תזונתי לנשים, ליווי תזונתי אישי, ירידה במשקל לנשים, תפריט אישי לנשים, תזונה בריאה, תזונה מאוזנת, גישת 80:20, תזונה בהריון, תזונה אחרי לידה, תזונה בהנקה, תזונה לפוריות, תזונה ל-PCOS, תזונה לאנדומטריוזיס, תזונה לנערות, דיאטנית ראשון לציון, ייעוץ תזונה אונליין, ליווי תזונה בווצאפ, אפליקציית תזונה, Liveat',
  image = '/og-image.jpg',
  /* Leave unset and the canonical is derived from the route, which is almost
     always what you want. It used to default to the site root, and because
     only two of the six pages bothered to pass a value, /Privacy,
     /Accessibility and /SuccessStories were each telling Google "the
     canonical version of me is the homepage". That is an instruction to fold
     them into the homepage and not index them on their own, which is the
     opposite of the intent for three pages that exist to be found.
     Pass it explicitly only to point somewhere other than the current path. */
  url,
  /* Opt-in only. A thank-you or confirmation page must never be indexed:
     left crawlable it turns up in search results and people arrive at
     "thanks for your purchase" without having bought anything. Defaults to
     false so every existing page keeps indexing exactly as before. */
  noindex = false,
}) {
  const { pathname } = useLocation();

  /* Built from the path alone: no query string and no hash, because those
     are the same page as far as indexing goes and letting them through is
     how a canonical ends up splitting one page into many. The root keeps its
     trailing slash; every other path drops one, so /Terms and /Terms/ cannot
     both be claimed as canonical. */
  const canonicalUrl =
    url ?? `${BUSINESS.site}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;

  useEffect(() => {
    document.title = title;

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

    // Canonical URL, one authoritative address for this page
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', FOUNDER.name);
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('language', 'Hebrew');
    setMetaTag('revisit-after', '7 days');

    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:locale', 'he_IL', true);
    setMetaTag('og:site_name', `${BUSINESS.tradeName} | ${FOUNDER.name}`, true);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    let scriptElement = document.querySelector('script[type="application/ld+json"][data-seo-head]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.setAttribute('data-seo-head', '');
      document.head.appendChild(scriptElement);
    }

    /* The clinic. This is the node that provides the service, so this is
       the node allowed to mention registered clinical dietitians. */
    const organization = {
      '@type': 'MedicalBusiness',
      '@id': `${BUSINESS.site}/#clinic`,
      name: BUSINESS.tradeName,
      legalName: BUSINESS.legalName,
      description,
      image,
      url: BUSINESS.site,
      email: BUSINESS.email,
      medicalSpecialty: 'Dietetics',
      areaServed: { '@type': 'Country', name: BUSINESS.country },
      priceRange: '₪₪',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '22:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Friday'],
          opens: '08:00',
          closes: '16:00',
        },
      ],
      sameAs: BUSINESS.socials,
      founder: { '@id': `${BUSINESS.site}/#kim` },
    };

    if (BUSINESS.phone) organization.telephone = BUSINESS.phone;
    if (BUSINESS.taxId) organization.taxID = BUSINESS.taxId;
    if (BUSINESS.address) {
      organization.address = {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address,
        addressLocality: BUSINESS.city,
        addressCountry: BUSINESS.country,
      };
    }

    /* Registered dietitians, each with her own licence. Only emitted when
       real people with real licence numbers have been entered, because an
       employee node without a credential is the claim without the proof. */
    if (activeTeam.length) {
      organization.employee = activeTeam.map((m) => ({
        '@type': 'Person',
        name: m.name,
        jobTitle: m.title,
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'רישיון דיאטנית קלינית, משרד הבריאות',
          identifier: m.license,
        },
      }));
    }

    /* Kim. Deliberately NOT given a clinical jobTitle, and deliberately not
       the provider of the service. She is the founder and the brand. */
    const person = {
      '@type': 'Person',
      '@id': `${BUSINESS.site}/#kim`,
      name: FOUNDER.name,
      alternateName: FOUNDER.alternateNames,
      jobTitle: FOUNDER.jobTitle,
      description: FOUNDER.description,
      url: BUSINESS.site,
      sameAs: BUSINESS.socials,
      alumniOf: FOUNDER.education
        .filter((e) => !e.inProgress)
        .map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
      worksFor: { '@id': `${BUSINESS.site}/#clinic` },
    };

    scriptElement.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [organization, person],
    });
  }, [title, description, keywords, image, canonicalUrl, noindex]);

  return null;
}
