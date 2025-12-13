import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Heart, Users, Award } from 'lucide-react';
// @ts-ignore
import kim_pic from '../../assets/images/kim-whiteshirt-trasparent7.png';

export default function AboutSection() {
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

  const highlights = [
    {
      icon: GraduationCap,
      label: 'בוגרת החוג לתזונה B.Sc',
    },
    {
      icon: Heart,
      label: 'סטודנטית לרפואה',
    },
    {
      icon: Users,
      label: 'מעל 5,000 מטופלים מרוצים',
    },
    {
      icon: Award,
      label: '12 שנות ניסיון',
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_691cc3bcb50ab4a43494e846/a8aac3756_k-11.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-white via-white/95 to-white/70" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div 
            className={`flex justify-center lg:justify-start transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-[#8B7F4B]/20 rounded-full blur-3xl" />
              <img 
                src={kim_pic}
                alt="קים גפסון"
                className="relative w-full max-w-ml rounded-3xl"
              />
            </div>
          </div>

          {/* Content */}
          <div 
            className={`text-right transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-gveret text-[#8B7F4B] leading-[1.1] mb-6">
             מי עומדת מאחורי הכל?{" "}
              {/* הוספתי כאן את ה-class 'block' */}
              {/* <span className="block  whitespace-nowrap text-[#333333] font-['Heebo']">
                Your Health My Mission
              </span> */}
            </h2>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed font-calibri">
              היי, אני <strong>קים גפסון קרביץ</strong> – דיאטנית קלינית, סטודנטית לרפואה, נשואה לאור ואמא לליאו וים.
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed font-calibri">
              בגיל 23 חוויתי שינוי חיים עמוק כשחליתי בסרטן מסוג הודג'קין לימפומה. מתוך התהליך הזה בחרתי להחלים – בגוף ובנפש – וליצור לעצמי אורח חיים מאוזן, נעים ומדויק.
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed font-calibri">
              בדרך למדתי שאיזון אמיתי לא נמצא בקיצוניות, אלא בהקשבה, בגמישות, ובהתאמה אישית. כך נולדה שיטת <strong>"תזונה מאפשרת"</strong> – גישה מקצועית וחומלת שמתבססת על עקרון האיזון בגישת 80:20.
            </p>
            
            <p className="text-[#8B7F4B] font-semibold text-lg mb-8 font-calibri">
              "את לא צריכה לבחור בין בריאות לבין הנאה. אפשר גם וגם."
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div 
                  key={item.label}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#8B7F4B]/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#8B7F4B]" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}