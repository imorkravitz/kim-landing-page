import React, { useState, useEffect, useRef } from "react";

export const TestimonialsColumn = ({
  className = "",
  testimonials,
  duration = 20 // ברירת מחדל איטית יותר לתנועה חלקה
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const columnRef = useRef(null);

  return (
    <div 
      className={`relative h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* הגדרת האנימציה בתוך הקומפוננטה כדי למנוע התנגשויות */}
      <style>{`
        @keyframes scrollVertical {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        .animate-scroll-vertical {
          animation: scrollVertical linear infinite;
          will-change: transform; /* אומר לדפדפן להתכונן לשינוי - מונע קטיעות */
        }
      `}</style>

      <div
        ref={columnRef}
        className="animate-scroll-vertical flex flex-col gap-6 pb-6"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isHovered ? "paused" : "running", // שליטה מלאה דרך ה-State
        }}
      >
        {/* אנו משכפלים את המערך פעם אחת כדי ליצור לופ אינסופי */}
        {[...Array(2)].map((_, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={`${groupIndex}-${i}`}
                // הסרתי את backdrop-blur ושיניתי ל-bg-white נקי יותר לביצועים
                // הוספתי transform-gpu כדי להכריח שימוש בכרטיס מסך
                className="transform-gpu p-4 rounded-3xl border border-[#8B7F4B]/20 bg-white shadow-lg shadow-[#8B7F4B]/5 max-w-xs w-full transition-transform duration-200"
              >
                <div className="mb-4 overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`הצלחה של ${role}`}
                    className="w-full h-auto object-cover block"
                    loading="eager" // חשוב! טוען את התמונות מיד כדי למנוע קפיצות בגובה
                    draggable="false" // מונע גרירה של התמונה עצמה
                  />
                </div>

                <div className="text-center">
                  <div className="text-sm text-[#8B7F4B] font-bold bg-[#8B7F4B]/10 rounded-full px-3 py-1 inline-block">
                    {role}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* שכבת הגנה למנוע קליקים בזמן גלילה מהירה (אופציונלי) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgb(255,255,255),inset_0_-10px_20px_rgb(255,255,255)] z-10" />
    </div>
  );
};