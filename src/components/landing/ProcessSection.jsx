import React, { useEffect, useRef, useState } from 'react';
import { ClipboardList, Calendar, Smartphone, MessageCircle } from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
  </svg>
);
import { Button } from "@/components/ui/button";

export default function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: '1',
      icon: ClipboardList,
      title: 'מילוי שאלון אישי',
      description: 'שאלון קצר שיעזור לנו להבין את השגרה, ההעדפות, המטרות והאתגרים שלך.',
      color: 'bg-[#8B7F4B]'
    },
    {
      number: '2',
      icon: Calendar,
      title: 'בניית תפריט מותאם',
      description: 'תוכנית אישית שנבנית לפי החיים שלך — לא לפי תפריט גנרי.',
      color: 'bg-[#A69B6A]'
    },
    {
      number: '3',
      icon: WhatsAppIcon,
      title: 'ליווי יומי בווצאפ',
      description: 'מענה אישי, פידבק מקצועי ותמיכה בזמן אמת לאורך התהליך.',
      color: 'bg-[#25D366]'
    },
    {
      number: '4',
      icon: Smartphone,
      title: 'מעקב ודיוקים באפליקציה',
      description: 'צילום ארוחות, מעקב אחר ההתקדמות ודיוקים שיעזרו לך להבין מה עובד עבורך.',
      color: 'bg-[#B8AD7E]'
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-16 min-h-[55vh] md:min-h-[85vh]"
      style={{ background: 'transparent' }}
    >
      <div className="container mx-auto px-6">

        {/* ── RESULT block — moved from ProblemSolutionSection ── */}
        <div
          className="rounded-3xl p-7 md:p-10 text-center mb-12"
          style={{
            background: 'rgba(139,127,75,0.07)',
            border: '1px solid rgba(139,127,75,0.13)',
          }}
        >
          <h3
            className="text-2xl md:text-3xl font-heading text-gray-900 mb-3 leading-snug"
            style={{ textWrap: 'balance' }}
          >
            תזונה שמרגישה כמו חיים —{' '}
            <span style={{ color: '#8B7F4B' }}>כמו החיים האמיתיים</span>
          </h3>
          <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md mx-auto">
            אלפי נשים ששינו את מערכת היחסים עם אוכל ולמדו לנהל את התזונה שלהן בצורה שמתאימה לחיים.
          </p>
          <a href="https://wa.link/ntdrz1" target="_blank" rel="noopener noreferrer">
            <button
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full text-base font-bold cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: '#25D366',
                boxShadow: '0 4px 16px rgba(37,211,102,0.30)',
              }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              בואי לדבר איתנו בווצאפ
            </button>
          </a>
        </div>

        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 mb-4" style={{ textWrap: 'balance' }}>
            מהרגע שהשארת פרטים — אנחנו איתך
          </h2>
          <p className="text-xl text-gray-500">
            4 צעדים פשוטים לתהליך שמותאם <strong style={{ color: '#8B7F4B' }}>אליך</strong>
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-14 right-[12%] left-[12%] h-1 bg-gradient-to-l from-[#8B7F4B] via-[#A69B6A] to-[#B8AD7E] rounded-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative text-center transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative inline-block">
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#6d6339] text-white text-sm font-bold flex items-center justify-center z-20 shadow-md border-2 border-white">
                      {step.number}
                    </div>
                    
                    {/* Icon Container with realistic shadow */}
                    <div className={`w-16 h-16 md:w-24 md:h-24 mx-auto rounded-2xl md:rounded-3xl ${step.color} flex items-center justify-center mb-3 md:mb-5 shadow-xl relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <step.icon className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-14">
          <a 
            href="https://tinyurl.com/nutrition-diary" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="lg" 
              className="bg-[#8B7F4B] text-white px-10 py-6 text-lg rounded-full shadow-[0_4px_6px_-1px_rgba(139,127,75,0.4)] hover:bg-[#6d6339] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
            >
              <ClipboardList className="w-5 h-5 ml-2" />
              לקביעת ייעוץ התאמה חינם
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}