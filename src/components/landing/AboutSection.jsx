import React, { useRef } from 'react';
import { GraduationCap, Stethoscope, Users, Award } from 'lucide-react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
// @ts-ignore
import kimPortrait from '../../assets/images/kim_portrait.png';

const BRAND = '#8B7F4B';
const ease  = [0.22, 1, 0.36, 1];

/* ── Shared motion presets ── */
const itemV = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.65, ease } },
};

const staggerV = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

/* ── Credential strip data ── */
const credentials = [
  { Icon: GraduationCap, title: 'B.Sc תזונה',         sub: 'האוניברסיטה העברית' },
  { Icon: Stethoscope,   title: 'סטודנטית לרפואה',    sub: 'אונירסיטת תל אביב' },
  { Icon: Award,         title: '12 שנות ניסיון',     sub: '' },
  { Icon: Users,         title: '5,000+ מטופלות',     sub: '' },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' });

  /* Subtle scroll parallax on the portrait */
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start end', 'end start'],
  });
  const rawY   = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const imgY   = useSpring(rawY, { stiffness: 48, damping: 17 });

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Ambient background glow — very subtle */}
      <motion.div
        aria-hidden
        className="absolute left-0 top-0 w-2/3 h-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${BRAND}0B 0%, transparent 65%)`,
        }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.6, ease }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* ── Main bio grid: text 58% / photo 42% ── */}
        <div className="grid lg:grid-cols-[58fr_42fr] gap-10 lg:gap-16 items-start">

          {/* TEXT COLUMN — leads the section */}
          <motion.div
            className="text-right"
            variants={staggerV}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Bio heading — editorial size, not hero */}
            <motion.h2
              variants={itemV}
              className="font-heading text-3xl md:text-4xl leading-snug mb-6"
              style={{ color: BRAND, textWrap: 'balance' }}
            >
              מי עומדת מאחורי הכל?
            </motion.h2>

            {/* Intro — slightly larger for hierarchy */}
            <motion.p
              variants={itemV}
              className="text-base text-gray-600 leading-relaxed mb-5"
              style={{ textWrap: 'pretty' }}
            >
              היי, אני <strong>קים גפסון קרביץ</strong> בוגרת תואר בתזונה באוניברסיטה
              העברית וסטודנטית לרפואה באוניברסיטת תל אביב, נשואה לאור ואמא לליאו וים.
            </motion.p>

            {/* Story paragraph 1 */}
            <motion.p
              variants={itemV}
              className="text-gray-600 leading-relaxed mb-5"
              style={{ textWrap: 'pretty' }}
            >
              בגיל 23 חוויתי מהפך בחיים כשחליתי בסרטן מסוג הודג'קין לימפומה.
              מתוך התהליך הזה בחרתי להחלים בגוף ובנפש וליצור לעצמי אורח חיים בריא
              מאוזן ובלי לוותר על ההנאות.
            </motion.p>

            {/* Story paragraph 2 */}
            <motion.p
              variants={itemV}
              className="text-gray-600 leading-relaxed mb-8"
              style={{ textWrap: 'pretty' }}
            >
              בדרך למדתי שאיזון אמיתי לא נמצא בקיצוניות, אלא בהקשבה, בגמישות,
              ובהתאמה אישית. כך נולדה שיטת{' '}
              <strong className="text-gray-800">"תזונה מאפשרת"</strong> – גישה מקצועית
              שמתבססת על עקרון האיזון בגישת 80:20.
            </motion.p>

            {/* Pull quote — typographic, no side border */}
            <motion.figure variants={itemV} className="mb-0">
              <div
                className="w-10 h-px mb-4 mr-auto"
                style={{ background: `${BRAND}55` }}
                aria-hidden
              />
              <blockquote>
                <p
                  className="font-gveret text-xl md:text-2xl leading-relaxed italic"
                  style={{ color: BRAND }}
                >
                  "את לא צריכה לבחור בין בריאות לבין הנאה. אפשר גם וגם."
                </p>
              </blockquote>
            </motion.figure>
          </motion.div>

          {/* PHOTO COLUMN — companion, not centerpiece */}
          <motion.div
            className="flex justify-start lg:pt-2"
            initial={{ opacity: 0, x: -36, filter: 'blur(10px)' }}
            animate={isInView
              ? { opacity: 1, x: 0,   filter: 'blur(0px)' }
              : { opacity: 0, x: -36, filter: 'blur(10px)' }}
            transition={{ duration: 0.9, ease, delay: 0.08 }}
          >
            <motion.div
              className="relative w-full max-w-[360px]"
              style={{ y: imgY }}
            >
              {/* Soft warm aura behind portrait */}
              <motion.div
                aria-hidden
                className="absolute -bottom-10 inset-x-8"
                style={{
                  height: '60%',
                  background: `radial-gradient(ellipse at 50% 100%, ${BRAND}20 0%, transparent 72%)`,
                  filter: 'blur(24px)',
                }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.3, delay: 0.5, ease }}
              />

              {/* Portrait with bottom fade — blends into bg naturally */}
              <motion.img
                src={kimPortrait}
                alt="קים גפסון קרביץ – דיאטנית קלינית"
                className="relative w-full object-contain"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.85) 88%, transparent 96%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.85) 88%, transparent 96%)',
                  filter: 'drop-shadow(0 10px 40px rgba(139,127,75,0.16))',
                }}
                whileHover={{
                  filter: 'drop-shadow(0 24px 44px rgba(139,127,75,0.24))',
                  scale: 1.015,
                  transition: { duration: 0.45, ease: 'easeOut' },
                }}
              />
            </motion.div>
          </motion.div>

        </div>

        {/* ── Credentials strip — horizontal, factual, not card-grid ── */}
        <motion.div
          className="mt-14 md:mt-16"
          variants={staggerV}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Thin rule above credentials */}
          <motion.div
            variants={itemV}
            className="w-full h-px mb-8"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {credentials.map(({ Icon, title, sub }, i) => (
              <motion.div
                key={title}
                variants={itemV}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
                className="flex flex-col items-center text-center px-4 py-5 cursor-default"
                style={{
                  borderRight:
                    i < credentials.length
                      ? '1px solid rgba(0,0,0,0.07)'
                      : 'none',
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ background: `${BRAND}12` }}
                >
                  <Icon className="w-6 h-6" style={{ color: BRAND }} />
                </div>
                <p className="font-semibold text-gray-900 text-base leading-tight mb-0.5">
                  {title}
                </p>
                {sub && (
                  <p className="text-gray-400 text-xs leading-snug">{sub}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
