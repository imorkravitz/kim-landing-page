import React, { useEffect, useRef, useState } from 'react';
import { Clock, Scale, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ProblemSolutionSection() {
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

  const cards = [
    {
      icon: Clock,
      title: 'הבעיה',
      subtitle: '"אין לי זמן"',
      description: 'בין עבודה, משפחה וחיים – קשה למצוא זמן לתזונה נכונה',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200'
    },
    {
      icon: Scale,
      title: 'הפתרון',
      subtitle: 'גישת 80:20',
      description: '80% עקביות פשוטה, 20% גמישות – ללא קיצוניות',
      bgColor: 'bg-[#8B7F4B]/5',
      iconBg: 'bg-[#8B7F4B]/20',
      iconColor: 'text-[#8B7F4B]',
      borderColor: 'border-[#8B7F4B]/30'
    },
    {
      icon: Target,
      title: 'התוצאה',
      subtitle: 'שליטה אמיתית',
      description: 'תוצאות שמתמשכות שמתאימות לסגנון החיים שלך',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            הדרך החכמה לתזונה <span className="text-[#8B7F4B]">שאת מחפשת</span>
          </h2>
          <p className="text-xl text-gray-500 mb-2">עם גישת 80:20</p>
          <p className="text-lg text-gray-600">80% עקביות פשוטה, 20% גמישות - בלי קיצוניות</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`${card.bgColor} ${card.borderColor} border-2 rounded-[2rem] p-10 lg:p-12 text-center transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`${card.iconBg} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 scale-110`}>
                <card.icon className={`w-12 h-12 ${card.iconColor}`} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{card.title}</h3>
              <p className={`text-xl md:text-2xl font-semibold ${card.iconColor} mb-4`}>{card.subtitle}</p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="https://wa.link/ntdrz1" target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="bg-[#25D366] text-white px-10 py-6 text-lg rounded-full shadow-[0_4px_6px_-1px_rgba(37,211,102,0.4)] hover:bg-[#20BA5C] hover:shadow-[0_10px_15px_-3px_rgba(37,211,102,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
            >
              <WhatsAppIcon className="w-5 h-5 ml-2" />
              דברי איתי בוואטסאפ
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}