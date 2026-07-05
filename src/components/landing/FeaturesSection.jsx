import React, { useRef, useState, useEffect } from 'react';
import { MessageCircle, Smartphone, Heart, Users, Award, Calendar, UtensilsCrossed } from 'lucide-react';

const BRAND = '#8B7F4B';

const features = [
  {
    icon: MessageCircle,
    title: 'ליווי אישי מקצועי',
    desc: 'דיאטנית שמכירה אותך, מלווה אותך בווצאפ ונותנת מענה מקצועי לאורך הדרך.',
  },
  {
    icon: Calendar,
    title: 'תוכנית שמתאימה לחיים שלך',
    desc: 'מותאמת לשגרה שלך: עבודה, ילדים, מסעדות, חופשות וסופי שבוע.',
  },
  {
    icon: Smartphone,
    title: 'אפליקציה ומעקב אישי',
    desc: 'צילום ארוחות, מעקב התקדמות וכלים שיעזרו לך להבין טוב יותר את ההרגלים שלך.',
  },
  {
    icon: Heart,
    title: 'תמיכה גם ברגעים קשים',
    highlight: 'בלי שיפוטיות ובלי אשמה',
    desc: ' — כדי שלא תצטרכי להתחיל מחדש.',
  },
  {
    icon: Users,
    title: 'קהילה ותוכן מקצועי',
    desc: 'הרצאות חודשיות, קיטים דיגיטליים, מתכונים ורעיונות שיעזרו לך לגוון ולהתמיד.',
  },
  {
    icon: Award,
    title: 'גישת 80:20',
    desc: 'איזון אישי בין עקביות לגמישות — כדי להתקדם בלי לוותר על החיים.',
  },
  {
    icon: UtensilsCrossed,
    title: 'תפריט מותאם אישית',
    highlight: 'מותאם לאורך החיים',
    desc: ', ליכולות, למטרות ולאופי שלך.',
  },
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
    </section>
  );
}
