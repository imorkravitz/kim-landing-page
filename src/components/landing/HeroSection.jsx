import React, { useEffect, useState } from 'react';
import { trackCTA } from '@/lib/analytics';
import img_515c2fe4e_KIM_LOGO2 from '../../assets/remote/515c2fe4e_KIM-LOGO2.webp';
import img_eeac41e3b_kim_t from '../../assets/remote/eeac41e3b_kim-t.webp';
import { Button } from "@/components/ui/button";
import { Star, GraduationCap } from 'lucide-react';
// @ts-ignore
import kim_pic from '../../assets/images/kim-whiteshirt-trasparent5.png';

/* ── WhatsApp mock chat card ── */
function WaChat({ messages, name, avatar, className = '' }) {
  return (
    <div className={`w-64 rounded-2xl overflow-hidden shadow-2xl ${className}`} style={{ fontFamily: 'Rubik, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#075E54' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: '#128C7E' }}>{avatar}</div>
        <div>
          <p className="text-white text-xs font-semibold leading-none">{name}</p>
          <p className="text-green-200 text-[10px] mt-0.5">מחובר/ת</p>
        </div>
        <div className="mr-auto flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-white/50" /><div className="w-1 h-1 rounded-full bg-white/50" /><div className="w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>
      {/* Chat bg */}
      <div className="px-3 py-3 space-y-2" style={{ background: '#ECE5DD', direction: 'rtl' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'kim' ? 'justify-start' : 'justify-end'}`}>
            <div className="max-w-[85%] px-3 py-1.5 rounded-xl text-[11px] leading-relaxed shadow-sm"
              style={{ background: m.from === 'kim' ? '#fff' : '#DCF8C6', color: '#333' }}>
              <p>{m.text}</p>
              <p className="text-[9px] text-gray-400 text-left mt-0.5">{m.time} {m.from !== 'kim' && '✓✓'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const leftChats = [
  {
    name: 'מיכל כ.',
    avatar: 'מ',
    messages: [
      { from: 'kim', text: 'בוקר טוב מיכל! איך הולך השבוע? 🌿', time: '09:12' },
      { from: 'user', text: 'קים!! ירדתי עוד 1.8 ק״ג השבוע 😭🎉 לא מאמינה', time: '09:15' },
      { from: 'user', text: 'ובלי להרגיש שאני על דיאטה בכלל. אוכלת הכל!', time: '09:15' },
      { from: 'kim', text: 'כל הכבוד!! זה בדיוק המטרה 🙌💚', time: '09:17' },
    ],
  },
  {
    name: 'שירה ל.',
    avatar: 'ש',
    messages: [
      { from: 'user', text: 'רציתי להגיד לך תודה ענקית 🙏 3 חודשים איתך ו-9 ק"ג פחות', time: '21:05' },
      { from: 'user', text: 'הרגשתי תמיד שיש מישהי שמאמינה בי ✨', time: '21:06' },
      { from: 'kim', text: 'זה כל הכיף שלי! את עשית את כל העבודה 💪', time: '21:09' },
    ],
  },
];

const rightChats = [
  {
    name: 'נועה א.',
    avatar: 'נ',
    messages: [
      { from: 'user', text: 'קים אני חייבת לספר לך!! לבשתי את השמלה שלא נכנסתי אליה 2 שנים 😭💃', time: '14:32' },
      { from: 'kim', text: 'וואו!! זה רגע שאי אפשר לשכוח 🥹🎊', time: '14:35' },
      { from: 'user', text: 'לא האמנתי שזה יקרה לי. תודה על הסבלנות 💛', time: '14:36' },
    ],
  },
  {
    name: 'רותם מ.',
    avatar: 'ר',
    messages: [
      { from: 'user', text: 'שבוע 6 ו-5 ק"ג פחות! וכל הבדיקות השתפרו 🩺', time: '08:50' },
      { from: 'kim', text: 'הכי חשוב שהגוף מרגיש טוב 🌱', time: '08:53' },
      { from: 'user', text: 'אף פעם לא חשבתי שדיאטה יכולה להרגיש כך... ממש תודה', time: '08:54' },
    ],
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-visible bg-[#e9e4ce]">

      {/* ── Floating WhatsApp chats – LEFT (desktop only) ── */}
      <div className="hidden lg:flex flex-col gap-5 absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20" style={{ opacity: 0.6 }}>
        {leftChats.map((c, i) => (
          <WaChat key={i} {...c}
            className={i % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[1.5deg]'}
          />
        ))}
      </div>

      {/* ── Floating WhatsApp chats – RIGHT (desktop only) ── */}
      <div className="hidden lg:flex flex-col gap-5 absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20" style={{ opacity: 0.6 }}>
        {rightChats.map((c, i) => (
          <WaChat key={i} {...c}
            className={i % 2 === 0 ? 'rotate-[2deg]' : 'rotate-[-1.5deg]'}
          />
        ))}
      </div>

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
                    src={img_eeac41e3b_kim_t}
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
                                    src={img_515c2fe4e_KIM_LOGO2}
                                    alt="KIM Logo"
                                    className="h-56 md:h-80 drop-shadow-lg filter contrast-110"
                                  />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#8B7F4B] leading-[1.1] mb-6">
              לנהל את התזונה שלכם,{" "}
              <span className="">
                לאכול הכל,{" "}
              </span>
              <span className="block whitespace-nowrap text-[#333333]">
                לרדת במשקל ולשמור על התוצאות.
              </span>
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
                    <span className="font-semibold text-base md:text-lg">בוגרת תואר ראשון בתזונה, האוניברסיטה העברית</span>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="mb-12 flex flex-col sm:flex-row gap-6 items-center sm:items-start ">
              <a 
                href="https://wa.link/ntdrz1"
              onClick={() => trackCTA('whatsapp_consult')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="bg-[#8B7F4B] text-white px-10 py-7 text-xl font-bold rounded-full shadow-[0_4px_6px_-1px_rgba(139,127,75,0.5)] hover:bg-[#968a56] hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.4)] active:translate-y-[1px] active:shadow-none transition-all duration-200 font-['Rubik']"
                >
                 לקביעת ייעוץ התאמה חינם
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