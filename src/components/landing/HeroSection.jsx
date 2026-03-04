import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, GraduationCap, Stethoscope } from 'lucide-react';
// @ts-ignore
import kim_pic from '../../assets/images/kim-whiteshirt-trasparent5.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#e9e4ce]">
          {/* Image on the left - Desktop */}
                <div className="absolute inset-y-0 left-0 w-1/2 hidden lg:flex items-end justify-center">
                  <img 
                    src={kim_pic}
                    alt="קים גפסון"
                    className="h-auto max-h-full w-auto object-contain"
                  />
                </div>

                {/* Image - Mobile */}
                <div className="lg:hidden flex justify-center pt-24 pb-4">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69274c44228d0da5d0b3bd04/eeac41e3b_kim-t.png"
                    alt="קים גפסון"
                    className="h-64 w-auto object-contain"
                  />
                </div>
      
      <div className="container mx-auto px-6 relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
          {/* Content - Right Side */}
                        <div className="text-right py-8 lg:py-20 order-1 lg:order-1">
            {/* Logo */}
            <div className="inline-block mb-8">
              <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_691cc3bcb50ab4a43494e846/515c2fe4e_KIM-LOGO2.png"
                                    alt="KIM Logo"
                                    className="h-56 md:h-80 drop-shadow-lg filter contrast-110"
                                  />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#8B7F4B] leading-[1.1] mb-6">
              לנהל את התזונה שלכם,{" "}
              <span className="block whitespace-nowrap text-[#333333]">
                לרדת במשקל ולשמור על התוצאות
              </span>
              <span className="block text-2xl md:text-3xl mt-3 text-[#8B7F4B]">בלי דיאטות קיצוניות</span>
            </h1>
            
            {/* Subtitle */}
            <div className="mb-8 space-y-6">
              <div>
                <p className="text-xl md:text-2xl text-[#333333] font-bold leading-relaxed mb-4">
                  ליווי תזונתי אישי ומקצועי של דיאטניות קליניות
                </p>
                
                {/* Credentials */}
                <div className="flex flex-col gap-3 bg-white/60 p-4 rounded-xl border border-[#8B7F4B]/10 backdrop-blur-sm inline-flex">
                  <div className="flex items-center gap-3 text-[#333333]">
                    <div className="bg-[#8B7F4B]/10 p-1.5 rounded-full shrink-0">
                      <GraduationCap className="w-5 h-5 text-[#8B7F4B]" />
                    </div>
                    <span className="font-semibold text-base md:text-lg">בוגרת החוג לתזונה, האוניברסיטה העברית</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#333333]">
                    <div className="bg-[#8B7F4B]/10 p-1.5 rounded-full shrink-0">
                      <Stethoscope className="w-5 h-5 text-[#8B7F4B]" />
                    </div>
                    <span className="font-semibold text-base md:text-lg">סטודנטית לרפואה, אוניברסיטת תל אביב</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-[#333333]">
                השיטה שתעזור לך לאכול בריא ומאוזן, ללא דיאטות קיצוניות
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-12 flex flex-col sm:flex-row gap-6 items-center sm:items-start ">
              <a 
                href="https://wa.link/ntdrz1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="bg-[#8B7F4B] text-white px-10 py-7 text-xl font-bold rounded-full shadow-[0_4px_6px_-1px_rgba(139,127,75,0.5)] hover:bg-[#968a56] hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.4)] active:translate-y-[1px] active:shadow-none transition-all duration-200 font-['Rubik']"
                >
                  קבעי ייעוץ חינם עכשיו
                </Button>
              </a>
              
              {/* Prominent Social Proof */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#8B7F4B]/20 rounded-2xl px-6 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-[#8B7F4B] text-[#8B7F4B]" />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-[#8B7F4B] leading-none">5,000+</div>
                    <div className="text-sm font-bold text-gray-800">סיפורי הצלחה</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="flex flex-wrap gap-8 justify-start border-t border-[#8B7F4B]/20 pt-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-[#8B7F4B]">12+</div>
                <div className="text-gray-600 text-sm font-medium leading-tight">שנות<br/>ניסיון</div>
              </div>
              <div className="w-px h-10 bg-[#8B7F4B]/20"></div>
              {/* <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-[#8B7F4B]">67K+</div>
                <div className="text-gray-600 text-sm font-medium leading-tight">עוקבים<br/>באינסטגרם</div>
              </div> */}
            </div>
          </div>

          {/* Empty div for grid balance on desktop */}
          <div className="hidden lg:block order-2"></div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-[#8B7F4B]/90 backdrop-blur-sm py-4 px-6">
          <div className="container mx-auto">
            <p className="text-white text-center text-lg md:text-xl font-medium">
              ליווי תזונתי אישי עם דיאטנית קלינית, אפליקציה תומכת וקהילה סגורה
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 rounded-full border-2 border-[#8B7F4B] flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#8B7F4B] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}