import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Smartphone, Users } from 'lucide-react';

const BRAND   = '#8B7F4B';
const TERRA   = '#C49A7A';
const WA_GREEN = '#25D366';

/* ── motion presets ── */
const ease = [0.22, 1, 0.36, 1];

const fade = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-72px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated connector ── */
function Connector() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="flex justify-center my-1" aria-hidden>
      <svg width="28" height="52" viewBox="0 0 28 52" fill="none">
        <motion.path
          d="M14 2 L14 42 M4 32 L14 44 L24 32"
          stroke={BRAND}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
        />
      </svg>
    </div>
  );
}

/* ── WhatsApp icon ── */
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ── What Kim actually offers ── */
const pillars = [
  {
    Icon: MessageCircle,
    color: WA_GREEN,
    title: 'ליווי יומי ישיר',
    desc:  'ווצאפ ישיר עם הדיאטנית. פידבק אמיתי, תגובה מקצועית.',
  },
  {
    Icon: Smartphone,
    color: BRAND,
    title: 'אפליקציה תומכת שתעזור לך ללמוד על התזונה שלך',
    desc:  'צלמי כל ארוחה, עקבי אחר מדדים ויעדים, ושתפי ישירות עם הדיאטנית שלך.',
  },
  {
    Icon: Users,
    color: TERRA,
    title: 'קהילה + תפריט מותאם אישית + תוכן',
    desc:  'קבוצת נשים שמבינות אותך, תפריט אישי גמיש, והרצאות תזונה חיות לאורך הדרך.',
  },
];

/* ── Pain points ── */
const pains = [
  'את יודעת מה בריא — הבעיה היא להתמיד כשהחיים עמוסים',
  'כל ניסיון הרגיש כמו ויתור, לא כמו בחירה',
  'כוונות טובות נגמרו בארוחת שישי הראשונה',
];

export default function ProblemSolutionSection() {
  return (
    <section
      dir="rtl"
      className="relative min-h-[100vh] py-20 md:py-28"
      style={{ background: 'transparent' }}
    >
      <div className="container mx-auto px-6 max-w-3xl">

        {/* ── Heading ── */}
        <Reveal className="text-center mb-14">
          <motion.h2
            variants={fade}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-gveret text-gray-900 mb-3 leading-tight"
            style={{ textWrap: 'balance' }}
          >
            הדרך החכמה לתזונה{' '}
            <span style={{ color: BRAND }}>שאת מחפשת</span>
          </motion.h2>
          <motion.p variants={fade} className="text-lg text-gray-500">
            לא עוד מאמץ. שיטה שמתאימה לחיים האמיתיים שלך.
          </motion.p>
        </Reveal>

        {/* ── PROBLEM ── */}
        <Reveal>
          <motion.div
            variants={fade}
            className="rounded-3xl p-7 md:p-9"
            style={{
              background: 'rgba(0,0,0,0.035)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <p
              className="text-2xl md:text-[1.6rem] font-bold text-gray-800 leading-snug mb-6"
              style={{ textWrap: 'balance' }}
            >
              ניסית. הסתדרת שבוע. ואז הגיעה ישיבה, ארוחת שישי, יום עמוס — והכל התפרק.
            </p>
            <div className="flex flex-col gap-3">
              {pains.map((text) => (
                <motion.p
                  key={text}
                  variants={fade}
                  className="text-gray-500 text-base leading-relaxed flex items-start gap-3"
                >
                  <span
                    className="shrink-0 mt-[3px] text-xs font-black"
                    style={{ color: TERRA }}
                  >
                    ●
                  </span>
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </Reveal>

        <Connector />

        {/* ── SOLUTION ── */}
        <Reveal className="mb-1">
          <motion.div variants={fade} className="mb-5">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              מה שקים מביאה — מערכת שלמה
            </h3>
            <p className="text-gray-500 text-sm">
              לא תוכנית. ליווי אמיתי שמתחיל ביום הראשון.
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {pillars.map(({ Icon, color, title, desc }) => (
              <motion.div
                key={title}
                variants={fade}
                whileHover={{
                  y: -3,
                  boxShadow: `0 10px 32px rgba(0,0,0,0.10)`,
                  transition: { duration: 0.22, ease: 'easeOut' },
                }}
                className="flex items-start gap-5 p-5 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  willChange: 'transform',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">{title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Connector />

        {/* ── RESULT ── */}
        <Reveal>
          <motion.div
            variants={fade}
            className="rounded-3xl p-7 md:p-10 text-center"
            style={{
              background: `${BRAND}0C`,
              border: `1px solid ${BRAND}22`,
            }}
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug"
              style={{ textWrap: 'balance' }}
            >
              תזונה שמרגישה כמו חיים —{' '}
              <span style={{ color: BRAND }}>לא כמו דיאטה</span>
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md mx-auto">
              אלפי לקוחות מרוצים ששינו את מערכת היחסים שלהם עם האוכל. לא על ידי ויתור —
              על ידי ליווי שמתאים לאורח החיים שלהם.
            </p>
            <a
              href="https://wa.link/ntdrz1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 10px 28px rgba(37,211,102,0.38)`,
                  transition: { duration: 0.18 },
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full text-base font-bold cursor-pointer"
                style={{
                  background: WA_GREEN,
                  boxShadow: '0 4px 16px rgba(37,211,102,0.30)',
                }}
              >
                <WaIcon />
                דברי איתי בוואטסאפ
              </motion.button>
            </a>
          </motion.div>
        </Reveal>

      </div>
    </section>
  );
}
