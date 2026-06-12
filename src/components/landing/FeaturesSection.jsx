import React, { useRef, useState, useEffect } from 'react';
import {
  MessageCircle, Smartphone, Heart, TrendingUp,
  Users, Calendar, Award, BarChart3,
} from 'lucide-react';

// Video background is now handled by ScrollVideoBackground in Home.jsx.
// This component is purely content — transparent outer background so the
// shared sticky canvas video is visible behind it.

const BRAND = '#8B7F4B';

const features = [
  { icon: MessageCircle, title: 'ליווי אישי מקצועי',  description: 'דיאטנית קלינית מוסמכת, זמינה בוואטסאפ יומי ופגישות זום קבועות'   },
  { icon: Smartphone,    title: 'אפליקציה מדויקת',    description: 'מעקב מנות בצילום, מדדי גוף, יעדים אישיים וגרפים מפורטים'         },
  { icon: Heart,         title: 'תמיכה רגשית',         description: 'לא רק תזונה – גם תמיכה נפשית ומוטיבציה לאורך הדרך'             },
  { icon: Calendar,      title: 'גמישות מלאה',          description: 'מותאם לסגנון החיים שלך – עבודה, משפחה, חברה'                   },
  { icon: BarChart3,     title: 'מעקב מתקדם',           description: 'כלים חכמים למעקב אחר התקדמות ושיפור מתמיד'                     },
  { icon: Users,         title: 'קהילה תומכת',           description: 'חלק מקהילה של נשים עם מטרות דומות ותמיכה הדדית'               },
  { icon: Award,         title: 'גישת 80:20',            description: 'לא קיצורי דרך, מותאם לנשים עסוקות. 80% עקביות, 20% גמישות'   },
  { icon: TrendingUp,    title: 'תוצאות מוכחות',       description: 'מאות נשים השיגו את המטרות שלהן עם השיטה שלנו'                 },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative min-h-[100vh]"
      style={{ background: 'transparent' }}
    >
      <div
        className="relative z-10 text-right py-16 px-6 lg:px-16"
        dir="rtl"
      >
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-gveret text-gray-900 mb-3">
            מה מייחד אותנו?
          </h2>
          <p className="text-lg text-gray-500 max-w-xl">
            ליווי מקצועי ואישי שמתאים בדיוק לסגנון החיים שלך
          </p>
        </div>

        {/* Feature cards — 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5
                          border border-gray-100
                          hover:shadow-lg hover:border-[#8B7F4B]/30
                          transition-all duration-300 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${BRAND}18` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: BRAND }} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
