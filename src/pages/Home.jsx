import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import ProcessSection from '@/components/landing/ProcessSection';
import AppSection from '@/components/landing/AppSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CalculatorSection from '@/components/landing/CalculatorSection';
import AboutSection from '@/components/landing/AboutSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/landing/ScrollToTop';
import AccessibilityWidget from '@/components/landing/AccessibilityWidget';
import FloatingCTA from '@/components/landing/FloatingCTA';

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
    <div dir="rtl" className="min-h-screen bg-white font-piki page-transition">
      <SEOHead 
        title="קים גפסון | תזונה מאפשרת - דיאטנית קלינית"
        description="קים גפסון - דיאטנית קלינית מוסמכת עם 12 שנות ניסיון. ליווי תזונתי אישי לנשים עם גישת 80:20, התמחות בגניקולוגיה ורפואת נשים, אפליקציית Liveat ותמיכה יומית בוואטסאפ."
      />
      <style>{`
        @font-face {
          font-family: 'Piki';
          src: local('Piki'), local('Arial Hebrew'), local('Arial');
          font-weight: normal;
          font-style: normal;
        }
        
        .font-piki {
          font-family: 'Piki', 'Calibri', 'Arial Hebrew', Arial, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
          scroll-snap-type: y proximity;
        }
        
        @media (max-width: 768px) {
          html {
            scroll-snap-type: y mandatory;
          }
          
          section {
            scroll-snap-align: start;
            scroll-snap-stop: normal;
          }
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
        
        /* Improved scroll behavior */
        * {
          scroll-margin-top: 80px;
        }
      `}</style>
      
      <HeroSection />
      
      <AnimatedSection>
        <ProblemSolutionSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <ProcessSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <AppSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <AboutSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <CalculatorSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
      
      <Footer />
      
      {/* Fixed Elements */}
      <ScrollToTop />
      <AccessibilityWidget />
      <FloatingCTA />
    </div>
  );
}