import React, { useEffect, useRef, useState } from 'react';
import { 
  MessageCircle, 
  Smartphone, 
  Heart, 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';

export default function FeaturesSection() {
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

  const features = [
    {
      icon: MessageCircle,
      title: 'ליווי אישי מקצועי',
      description: 'דיאטנית קלינית מוסמכת, זמינה בוואטסאפ יומי ופגישות זום קבועות'
    },
    {
      icon: Smartphone,
      title: 'אפליקציה מדויקת',
      description: 'מעקב מנות בצילום, מדדי גוף, יעדים אישיים וגרפים מפורטים'
    },
    {
      icon: Heart,
      title: 'תמיכה רגשית',
      description: 'לא רק תזונה – גם תמיכה נפשית ומוטיבציה לאורך הדרך'
    },
    {
      icon: Calendar,
      title: 'גמישות מלאה',
      description: 'מותאם לסגנון החיים שלך – עבודה, משפחה, חברה'
    },
    {
      icon: BarChart3,
      title: 'מעקב מתקדם',
      description: 'כלים חכמים למעקב אחר התקדמות ושיפור מתמיד'
    },
    {
      icon: Users,
      title: 'קהילה תומכת',
      description: 'חלק מקהילה של נשים עם מטרות דומות ותמיכה הדדית'
    },
    {
      icon: Award,
      title: 'גישת 80:20',
      description: 'לא קיצורי דרך, מותאם לנשים עסוקות. 80% עקביות, 20% גמישות'
    },
    {
      icon: TrendingUp,
      title: 'תוצאות מוכחות',
      description: 'מאות נשים השיגו את המטרות שלהן עם השיטה שלנו'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28"
      style={{
        background: `linear-gradient(to bottom, #F5F3ED, #FFFFFF)`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            מה מייחד אותנו?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            ליווי מקצועי ואישי שמתאים בדיוק לסגנון החיים שלך
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white rounded-2xl p-6 text-right border border-gray-100 hover:shadow-lg hover:border-[#8B7F4B]/30 transition-all duration-500 group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-[#8B7F4B]/10 flex items-center justify-center mb-4 group-hover:bg-[#8B7F4B]/20 transition-colors">
                <feature.icon className="w-7 h-7 text-[#8B7F4B]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}