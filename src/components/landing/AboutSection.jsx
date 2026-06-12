import React, { useRef } from 'react';
import { GraduationCap, Heart, Users, Award } from 'lucide-react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
// @ts-ignore
import kim_pic from '../../assets/images/kim-whiteshirt-trasparent7.png';

const BRAND   = '#8B7F4B';
const ease    = [0.25, 0.1, 0.25, 1];
const spring  = { type: 'spring', stiffness: 260, damping: 22 };

const highlights = [
  { icon: GraduationCap, label: 'בוגרת תואר ראשון בתזונה, האוניברסטיה העברית B.Sc' },
  { icon: Heart,         label: 'סטודנטית לרפואה'         },
  { icon: Users,         label: 'מעל 5,000 מטופלים מרוצים' },
  { icon: Award,         label: '12 שנות ניסיון'           },
];

// ── Animation variants ──────────────────────────────────────────────────────
// Stagger container — used on the whole text column
const textContainerV = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.18 } },
};

// Each paragraph / heading fades up with a blur-clear reveal
const textItemV = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.55, ease } },
};

// Cards stagger separately from the paragraphs (come in last)
const cardContainerV = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.0 } },
};
const cardItemV = {
  hidden:  { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { ...spring } },
};

export default function AboutSection() {
  const sectionRef = useRef(null);

  // Trigger once when 12 % of the section enters the viewport
  const isInView = useInView(sectionRef, { once: true, margin: '-12% 0px' });

  // Scroll-driven parallax on Kim's image — rises gently as you scroll past
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start end', 'end start'],
  });
  const rawY     = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imgY     = useSpring(rawY, { stiffness: 55, damping: 20 });
  const rawScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.92, 1, 1.04]);
  const imgScale = useSpring(rawScale, { stiffness: 55, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_691cc3bcb50ab4a43494e846/a8aac3756_k-11.png')`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-white via-white/95 to-white/70" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* ── Kim image ──────────────────────────────────────────────────── */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 64, filter: 'blur(12px)' }}
            animate={isInView
              ? { opacity: 1, x: 0, filter: 'blur(0px)' }
              : { opacity: 0, x: 64, filter: 'blur(12px)' }}
            transition={{ type: 'spring', stiffness: 58, damping: 17, delay: 0.05 }}
          >
            {/* Parallax wrapper: Y and scale driven by scroll position */}
            <motion.div
              className="relative"
              style={{ y: imgY, scale: imgScale }}
            >
              {/* Glow halo */}
              <motion.div
                className="absolute -inset-4 rounded-full blur-3xl"
                style={{ background: `${BRAND}28` }}
                animate={isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 1.1, delay: 0.3, ease }}
              />
              <img
                src={kim_pic}
                alt="קים גפסון"
                className="relative w-full max-w-ml rounded-3xl"
              />
            </motion.div>
          </motion.div>

          {/* ── Text column ────────────────────────────────────────────────── */}
          <motion.div
            className="text-right"
            variants={textContainerV}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Heading */}
            <motion.h2
              variants={textItemV}
              className="text-4xl md:text-5xl lg:text-6xl font-gveret leading-[1.1] mb-6"
              style={{ color: BRAND }}
            >
              מי עומדת מאחורי הכל?
            </motion.h2>

            {/* Paragraphs — each a separate stagger child */}
            <motion.p variants={textItemV}
              className="text-xl text-gray-700 mb-6 leading-relaxed">
              היי, אני <strong>קים גפסון קרביץ</strong> – דיאטנית קלינית, סטודנטית לרפואה,
              נשואה לאור ואמא לליאו וים.
            </motion.p>

            <motion.p variants={textItemV}
              className="text-gray-600 mb-6 leading-relaxed">
              בגיל 23 חוויתי שינוי חיים עמוק כשחליתי בסרטן מסוג הודג'קין לימפומה. מתוך
              התהליך הזה בחרתי להחלים – בגוף ובנפש – וליצור לעצמי אורח חיים מאוזן, נעים ומדויק.
            </motion.p>

            <motion.p variants={textItemV}
              className="text-gray-600 mb-6 leading-relaxed">
              בדרך למדתי שאיזון אמיתי לא נמצא בקיצוניות, אלא בהקשבה, בגמישות, ובהתאמה אישית.
              כך נולדה שיטת <strong>"תזונה מאפשרת"</strong> – גישה מקצועית וחומלת שמתבססת
              על עקרון האיזון בגישת 80:20.
            </motion.p>

            {/* Brand quote */}
            <motion.p
              variants={textItemV}
              className="font-semibold text-lg mb-8"
              style={{ color: BRAND }}
            >
              "את לא צריכה לבחור בין בריאות לבין הנאה. אפשר גם וגם."
            </motion.p>

            {/* ── Highlight cards — stagger + hover lift ─────────────────── */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={cardContainerV}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {highlights.map((item) => (
                <motion.div
                  key={item.label}
                  variants={cardItemV}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 cursor-default"
                  whileHover={{
                    y: -5,
                    scale: 1.035,
                    backgroundColor: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 14px 30px rgba(139,127,75,0.18)',
                    transition: { type: 'spring', stiffness: 320, damping: 18 },
                  }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
                >
                  {/* Icon badge */}
                  <motion.div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${BRAND}18` }}
                    whileHover={{
                      background: `${BRAND}28`,
                      rotate: [0, -6, 6, 0],
                      transition: { duration: 0.35 },
                    }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: BRAND }} />
                  </motion.div>
                  <span className="text-gray-700 font-medium text-sm text-right leading-snug">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
