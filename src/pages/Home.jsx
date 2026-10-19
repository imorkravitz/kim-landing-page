import React, { useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { initScrollTracking } from '@/lib/analytics';

import SEOHead from '@/components/SEOHead';
import ScrollStorySection, { STORY_SECTIONS } from '@/components/landing/ScrollStorySection';
import SectionNav from '@/components/landing/SectionNav';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import ScrollVideoBackground from '@/components/landing/ScrollVideoBackground';
import PricingSection from '@/components/landing/PricingSection';
import ProcessSection from '@/components/landing/ProcessSection';
import AppSection from '@/components/landing/AppSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import TrustBar from '@/components/landing/TrustBar';
import AboutSection from '@/components/landing/AboutSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/landing/ScrollToTop';
import AccessibilityWidget from '@/components/landing/AccessibilityWidget';
import FloatingCTA from '@/components/landing/FloatingCTA';
import StickyCTA from '@/components/landing/StickyCTA';
import ScrollProgressBar from '@/components/landing/ScrollProgressBar';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

/* Navbar destinations: the story chapters, then the page's main sections. */
const NAV_SECTIONS = [
  ...STORY_SECTIONS,
  { id: 'method', label: 'השיטה' },
  { id: 'about', label: 'על קים' },
  { id: 'results', label: 'סיפורי הצלחה' },
  { id: 'start', label: 'יוצאות לדרך' },
  { id: 'app', label: 'האפליקציה' },
  { id: 'pricing', label: 'תוכניות' },
  { id: 'faq', label: 'שאלות' },
];

const AnimatedSection = ({ children }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={sectionVariants}
  >
    {children}
  </motion.div>
);

export default function Home() {
  /* Runs after mount so [data-track-section] elements exist to observe. */
  useEffect(() => initScrollTracking(), []);

  return (
    <MotionConfig reducedMotion="user">
    <div dir="rtl" className="min-h-screen bg-white font-sans page-transition">
      {/* Stable page H1 for SEO/screen readers — visually hidden, zero layout impact.
          The hero's visual headline lives inside the animated story phases and
          unmounts on scroll, so it can't serve as the document H1. */}
      <h1 className="sr-only">
        קים גפסון, תזונה מאפשרת: ליווי תזונתי אישי לנשים בגישת 80:20, לרדת במשקל ולשמור על התוצאות
      </h1>
      <SEOHead
        title="קים גפסון קרביץ | תזונה מאפשרת, קליניקה לליווי תזונתי לנשים"
        description="ליווי תזונתי אישי לנשים בגישת 80:20, עם צוות דיאטניות קליניות מוסמכות. תפריט מותאם, תמיכה יומית בווצאפ ואפליקציית Liveat. הקליניקה של קים גפסון קרביץ, מייסדת תזונה מאפשרת, בוגרת תואר במדעי התזונה באוניברסיטה העברית."
      />
      <style>{`
        /* No global scroll-behavior: smooth. On an 18,000px page it animates
           every programmatic scroll, which is what made scrolling feel like it
           had been taken away from the user. Controls that genuinely want an
           animated scroll (ScrollToTop) opt in per call instead. */

        /* Smooth page transitions */
        .page-transition {
          animation: fadeInUp 0.4s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Anchor targets clear the fixed header when scrolled to */
        section[id], [id][data-scroll-target] {
          scroll-margin-top: 80px;
        }
      `}</style>
      
      <main id="main-content">
      <div data-track-section="hero_story"><ScrollStorySection /></div>

      {/* First real content after the hero story (StickyCTA measures from here) */}
      <div id="content-start" tabIndex={-1} className="outline-none" />

      <div data-track-section="trust_bar"><TrustBar /></div>

      {/* Stethoscope scrub spans ProblemSolution + About — the animation
          completes only at the bottom of About (Kim's full portrait) */}
      <ScrollVideoBackground>
        <div id="method" data-track-section="problem_solution"><ProblemSolutionSection /></div>
        <div id="about" data-track-section="about_kim"><AboutSection /></div>
      </ScrollVideoBackground>

      <AnimatedSection>
        <div data-track-section="testimonials"><TestimonialsSection /></div>
      </AnimatedSection>

      <AnimatedSection>
        <div id="start" data-track-section="process"><ProcessSection /></div>
      </AnimatedSection>

      <AnimatedSection>
        <div data-track-section="liveat_app"><AppSection /></div>
      </AnimatedSection>

      <AnimatedSection>
        <div id="pricing" data-track-section="pricing"><PricingSection /></div>
      </AnimatedSection>

      <AnimatedSection>
        <div id="faq" data-track-section="faq"><FAQSection /></div>
      </AnimatedSection>
      
      <AnimatedSection>
        <div data-track-section="closing_cta"><CTASection /></div>
      </AnimatedSection>
      
      </main>

      <Footer />
      
      {/* Fixed Elements */}
      <SectionNav sections={NAV_SECTIONS} />
      <ScrollProgressBar />
      <ScrollToTop />
      <AccessibilityWidget />
      <FloatingCTA />
      <StickyCTA />
    </div>
    </MotionConfig>
  );
}