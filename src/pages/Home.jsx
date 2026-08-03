import React, { useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';

import SEOHead from '@/components/SEOHead';
import ScrollStorySection from '@/components/landing/ScrollStorySection';
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
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div dir="rtl" className="min-h-screen bg-white font-sans page-transition">
      {/* First focusable element on the page — WCAG 2.4.1 Bypass Blocks.
          Must live here, not in the portalled a11y widget: there it was the
          LAST tab stop, which defeats the purpose. */}
      <a
        href="#content-start"
        className="skip-to-content"
        onClick={(e) => {
          // Handled here rather than by the generic anchor handler below,
          // because a skip link must MOVE FOCUS, not just scroll — otherwise
          // the keyboard user's tab position never actually advances.
          e.preventDefault();
          const target = document.getElementById('content-start');
          if (!target) return;
          // Instant, positional scroll — deliberately not smooth: a skip link
          // exists to get a keyboard user past the hero immediately, and
          // animating ~4700px works against that. The positional form is also
          // the one UAs never suppress.
          const top = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top);
          target.focus({ preventScroll: true });
        }}
      >
        דילוג לתוכן הראשי
      </a>
      {/* Stable page H1 for SEO/screen readers — visually hidden, zero layout impact.
          The hero's visual headline lives inside the animated story phases and
          unmounts on scroll, so it can't serve as the document H1. */}
      <h1 className="sr-only">
        קים גפסון — תזונה מאפשרת: ליווי תזונתי אישי לנשים בגישת 80:20, לרדת במשקל ולשמור על התוצאות
      </h1>
      <SEOHead 
        title="קים גפסון קרביץ | תזונה מאפשרת — דיאטנית קלינית"
        description="קים גפסון -  בוגרת תואר בתזונה באוניברסיטה העברית עם 12 שנות ניסיון. ליווי תזונתי אישי לנשים עם גישת 80:20,סטודנטית לרפואה באוניברסיטה העברית במסלול 4 שנתי עתידה להתמחות ברפואת נשים, אפליקציית Liveat ותמיכה יומית בווצאפ."
      />
      <style>{`
        html {
          scroll-behavior: smooth;
        }

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
      <ScrollStorySection />

      {/* Skip-link destination: first real content after the hero story */}
      <div id="content-start" tabIndex={-1} className="outline-none" />

      <TrustBar />

      {/* Stethoscope scrub spans ProblemSolution + About — the animation
          completes only at the bottom of About (Kim's full portrait) */}
      <ScrollVideoBackground>
        <ProblemSolutionSection />
        <AboutSection />
      </ScrollVideoBackground>

      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>

      <AnimatedSection>
        <ProcessSection />
      </AnimatedSection>

      <AnimatedSection>
        <AppSection />
      </AnimatedSection>

      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>

      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
      
      </main>

      <Footer />
      
      {/* Fixed Elements */}
      <ScrollProgressBar />
      <ScrollToTop />
      <AccessibilityWidget />
      <FloatingCTA />
    </div>
    </MotionConfig>
  );
}