import React, { useEffect, useRef, useState } from 'react';
import { Check, Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function PricingSection() {
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

  const plans = [
    {
      name: 'בייסיק',
      ctaText: 'תרשמי אותי!',
      price: '439',
      duration: 'לחודש',
      commitment: 'הוראת קבע ל-3 חודשים*',
      subtitle: '(ללא תפיסת מסגרת)',
      description: 'תוכנית קצרה וממוקדת, החל מהיום הראשון. נציב מטרות יחד, נבנה תפריט מותאם, גמיש ומאפשר ונצא לדרך לשלושה חודשי איזון תזונתי ותוצאות!',
      featuresTitle: 'מה מקבלים?',
      features: [
        'פגישה אישית עם תזונאית אונליין בכל חודש (3 פגישות)',
        'מעקב וליווי אישי יומיומי וצמוד בוואטסאפ',
        '2 ערכות קיט לבחירתך במתנה',
        'הרצאת זום חודשית עם קים לכל הקהילה'
      ],
      bgColor: 'bg-[#f9f4eb]',
      headerColor: 'text-[#8B7F4B]',
      isPopular: false,
      paymentLink: 'https://meshulam.co.il/quick_payment?b=0650455637b3d3165c4edf567b80d7f7'
    },
    {
      name: 'גולד',
      ctaText: 'צרפי אותי!',
      price: '399',
      duration: 'לחודש',
      commitment: 'הוראת קבע ל-6 חודשים*',
      subtitle: '(ללא תפיסת מסגרת)',
      description: 'תוכנית תהליכית ואיכותית. מתאימה למי שמחפשת ללמוד לנהל את התזונה שלה בכל זמן ובכל סיטואציה. מפגישה לפגישה נדייק את החליפה התזונתית עבורך, נציב יעדים על ציר הזמן ונצעד יד ביד לתוצאות!',
      featuresTitle: 'מה מקבלים?',
      features: [
        'פגישה אישית עם תזונאית אונליין בכל חודש (6 פגישות)',
        'מעקב וליווי אישי יומיומי וצמוד בוואטסאפ',
        '2 ערכות קיט לבחירתך במתנה',
        'הרצאת זום חודשית עם קים לכל הקהילה'
      ],
      bgColor: 'bg-[#edead4]',
      headerColor: 'text-[#8B7F4B]',
      isPopular: true,
      popularText: 'Most Popular',
      paymentLink: 'https://meshulam.co.il/quick_payment?b=a4a8f69b137c30dbf763eb9b8576236a'
    },
    {
      name: 'נבחרת',
      ctaText: 'רוצה לנבחרת!',
      price: '409',
      duration: 'לחודש',
      commitment: 'הוראת קבע ל-12 חודשים*',
      subtitle: '(ללא תפיסת מסגרת)',
      description: 'תוכנית אישית וקהילתית. מתאים למי שאנרגיית הקבוצה עושה לה טוב. בנוסף לפגישות והליווי האישי עם התזונאית, תקבלי פגישת מיקוד תזונתית ואישית עם קים. התוכנית משלבת קבוצה ייעודית סגורה, למוטיבציה יומיומית, השראה, רעיונות ואתגרים שבועיים שיתנו לך פוש לתהליך!',
      featuresTitle: 'מה מקבלים?',
      features: [
        'פגישה אישית עם תזונאית אונליין בכל חודש (11 פגישות)',
        'מעקב וליווי אישי יומיומי וצמוד בוואטסאפ',
        'קבוצת וואטסאפ סגורה לקהילה עם התזונאית',
        '2 ערכות קיט לבחירתך במתנה',
        'פגישה אישית עם קים – ייעוץ על נושאים תזונתיים ואישיים לבחירתך',
        'הרצאת זום חודשית עם קים לכל הקהילה'
      ],
      bgColor: 'bg-[#cdc2ab]',
      headerColor: 'text-[#8B7F4B]',
      isPopular: false,
      paymentLink: 'https://meshulam.co.il/quick_payment?b=db202b67221edf8de0a441989beb51ce'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden bg-[#E5E0D1]"
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap');
          .font-handwriting {
            font-family: 'Amatic SC', cursive;
          }
        `}
      </style>
      
      {/* Background Texture/Image */}
      <div className="absolute inset-0 pointer-events-none bg-cover bg-center" 
           style={{ backgroundImage: 'url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/6a474e22f_Untitleddesign7.png")' }}>
      </div>

      {/* Bottom Left Decoration - Beet */}
      <div className="absolute bottom-0 left-0 w-[36rem] h-[48rem] md:w-[54rem] md:h-[72rem] pointer-events-none z-0 opacity-90"
           style={{ 
             backgroundImage: 'url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/8fa64f760_1.png")',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'bottom left',
             backgroundSize: 'contain'
           }}>
      </div>

      {/* Top Right Decoration - Flower */}
      <div className="absolute top-0 right-0 w-[18rem] h-[24rem] md:w-[27rem] md:h-[36rem] pointer-events-none z-0 opacity-90"
           style={{ 
             backgroundImage: 'url("https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/df0c9358a_2.png")',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'top right',
             backgroundSize: 'contain'
           }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 ">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_691cc3bcb50ab4a43494e846/4dfadad4e_KIM-LOGO.png"
            alt="KIM"
            className="h-80 md:h-96 mx-auto mb-10 opacity-100"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all duration-700 flex flex-col hover:shadow-2xl${
                plan.isPopular ? 'z-10 shadow-2xl ring-2 ring-[#8B7F4B]/20' : ''
              } ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card Content */}
              <div className={`p-8 h-full flex flex-col ${plan.bgColor} text-gray-800 relative`}>
                
                {/* Header */}
                <div className="text-center mb-6 relative">
                  <h3 className={`text-6xl md:text-7xl font-bold mb-1 font-gveret ${plan.headerColor} relative inline-block`}>
                    {plan.name}
                    {plan.name === 'גולד' && <span className="absolute -top-2 -left-6 text-4xl">*</span>}
                  </h3>
                  
                  <div className="flex flex-col items-center justify-center mt-4">
                    <div className="flex items-baseline gap-1 text-[#7D7046]">
                      <span className="text-3xl font-bold">₪</span>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-2xl font-bold">{plan.duration}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">{plan.commitment}</div>
                    <div className="text-xs text-gray-500">{plan.subtitle}</div>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-[#8B7F4B]/20 mb-6"></div>

                {/* Description */}
                <div className="mb-8 flex-grow">
                  <p className="text-right text-gray-700 leading-relaxed font-medium text-base md:text-lg">
                    {plan.description}
                  </p>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-[#8B7F4B]/20 mb-6"></div>

                {/* Features */}
                <div>
                  <h4 className={`text-2xl font-gveret ${plan.headerColor} mb-4 text-right font-bold `}>
                    {plan.featuresTitle}
                  </h4>
                  <ul className="space-y-3 text-right">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                        <span className="text-[#8B7F4B] mt-1.5">•</span>
                        <span className="flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button 
                      className="w-full py-6 rounded-full text-lg font-bold bg-[#8B7F4B] hover:bg-[#6d6339] text-white shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-5 h-5 ml-2" />
                      {plan.ctaText}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-12 text-base font-medium max-w-3xl mx-auto">
          *עלות תוכנית פרונטלית בתוספת 20 ₪ לחודש.
          <br />
          הקליניקה שלנו בכתובת ילדי טהרן 5, ראשון לציון - הולמס פלייס
        </p>
      </div>
    </section>
  );
}