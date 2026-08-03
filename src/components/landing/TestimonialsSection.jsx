import React from 'react';
import { trackCTA } from '@/lib/analytics';
import { motion } from 'framer-motion';
import { TestimonialsColumn } from '@/components/ui/testimonials-column';
import { Button } from "@/components/ui/button";

// @ts-ignore
import img1 from '../../assets/patientsSuccess/1.webp';
// @ts-ignore
import img2 from '../../assets/patientsSuccess/2.webp';
// @ts-ignore
import img3 from '../../assets/patientsSuccess/3.webp';
// @ts-ignore
import img4 from '../../assets/patientsSuccess/4.webp';
// @ts-ignore
import img5 from '../../assets/patientsSuccess/5.webp';
// @ts-ignore
import img6 from '../../assets/patientsSuccess/6.webp';
// @ts-ignore
import img7 from '../../assets/patientsSuccess/7.webp';
// @ts-ignore
import img8 from '../../assets/patientsSuccess/8.webp';
// @ts-ignore
import img9 from '../../assets/patientsSuccess/9.webp';
// @ts-ignore
import img10 from '../../assets/patientsSuccess/10.webp';
// @ts-ignore
import img11 from '../../assets/patientsSuccess/11.webp';
// @ts-ignore
import img12 from '../../assets/patientsSuccess/12.webp';
// @ts-ignore
import img13 from '../../assets/patientsSuccess/13.webp';
// @ts-ignore
import img14 from '../../assets/patientsSuccess/14.webp';
// @ts-ignore
import img15 from '../../assets/patientsSuccess/15.webp';
// @ts-ignore
import img16 from '../../assets/patientsSuccess/16.webp';
// @ts-ignore
import img17 from '../../assets/patientsSuccess/17.webp';
// @ts-ignore
import img18 from '../../assets/patientsSuccess/18.webp';
// @ts-ignore
import img19 from '../../assets/patientsSuccess/19.webp';
// @ts-ignore
import img20 from '../../assets/patientsSuccess/20.webp';
// @ts-ignore
import img21 from '../../assets/patientsSuccess/21.webp';
// @ts-ignore
import img22 from '../../assets/patientsSuccess/22.webp';
// @ts-ignore
import img23 from '../../assets/patientsSuccess/23.webp';
// @ts-ignore
import img24 from '../../assets/patientsSuccess/24.webp';
// @ts-ignore
import img25 from '../../assets/patientsSuccess/25.webp';
// @ts-ignore
import img26 from '../../assets/patientsSuccess/26.webp';
// @ts-ignore
import img27 from '../../assets/patientsSuccess/27.webp';
// @ts-ignore
import img28 from '../../assets/patientsSuccess/28.webp';
// @ts-ignore
import img29 from '../../assets/patientsSuccess/29.webp';
// @ts-ignore
import img30 from '../../assets/patientsSuccess/30.webp';
// @ts-ignore
import img31 from '../../assets/patientsSuccess/31.webp';
// @ts-ignore
import img32 from '../../assets/patientsSuccess/32.webp';
// @ts-ignore
import img33 from '../../assets/patientsSuccess/33.webp';
// @ts-ignore
import img34 from '../../assets/patientsSuccess/34.webp';
// @ts-ignore
import img35 from '../../assets/patientsSuccess/35.webp';
// @ts-ignore
import img36 from '../../assets/patientsSuccess/36.webp';
// @ts-ignore
import img37 from '../../assets/patientsSuccess/37.webp';
// @ts-ignore
import img38 from '../../assets/patientsSuccess/38.webp';
// @ts-ignore
import img39 from '../../assets/patientsSuccess/39.webp';
// @ts-ignore
import img40 from '../../assets/patientsSuccess/40.webp';
// @ts-ignore
import img41 from '../../assets/patientsSuccess/41.webp';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const testimonials = [
  // --- המלצות קיימות ---
  {
    text: "",
    image: img1,
    role: "",
  },
  {
    text: "",
    image: img2,
    role: "",
  },
  {
    text: "",
    image: img3,
    role: "",
  },
  {
    text: "",
    image: img4,
    role: "",
  },
  {
    text: "",
    image: img5,
    role: "",
  },
  {
    text: "",
    image: img6,
    role: "",
  },
  {
    text: "",
    image: img7,
    role: "",
  },
  {
    text: "",
    image: img8,
    role: "",
  },
  {
    text: "",
    image: img9,
    role: "",
  },

  // --- תמונות חדשות (10-25) ---
  {
    text: "",
    image: img10,
    role: "",
  },
  {
    text: "",
    image: img11,
    role: "",
  },
  {
    text: "",
    image: img12,
    role: "",
  },
  {
    text: "",
    image: img13,
    role: "",
  },
  {
    text: "",
    image: img14,
    role: "",
  },
  {
    text: "",
    image: img15,
    role: "",
  },
  {
    text: "",
    image: img16,
    role: "",
  },
  {
    text: "",
    image: img17,
    role: "",
  },
  {
    text: "",
    image: img18,
    role: "",
  },
  {
    text: "",
    image: img19,
    role: "",
  },
  {
    text: "",
    image: img20,
    role: "",
  },
  {
    text: "",
    image: img21,
    role: "",
  },
  {
    text: "",
    image: img22,
    role: "",
  },
  {
    text: "",
    image: img23,
    role: "",
  },
  {
    text: "",
    image: img24,
    role: "",
  },
  {
    text: "",
    image: img25,
    role: "",
  },
  {
    text: "",
    image: img26,
    role: "",
  },
  {
    text: "",
    image: img27,
    role: "",
  },
  {
    text: "",
    image: img28,
    role: "",
  },
  {
    text: "",
    image: img29,
    role: "",
  },
  {
    text: "",
    image: img30,
    role: "",
  },
  {
    text: "",
    image: img31,
    role: "",
  },
  {
    text: "",
    image: img32,
    role: "",
  },
  {
    text: "",
    image: img33,
    role: "",
  },
  {
    text: "",
    image: img34,
    role: "",
  },
  {
    text: "",
    image: img35,
    role: "",
  },
  {
    text: "",
    image: img36,
    role: "",
  },
  {
    text: "",
    image: img37,
    role: "",
  },
  {
    text: "",
    image: img38,
    role: "",
  },
  {
    text: "",
    image: img39,
    role: "",
  },
  {
    text: "",
    image: img40,
    role: "",
  },
  {
    text: "",
    image: img41,
    role: "",
  },
];

/* Desktop: three columns, 14 / 14 / 13 */
const firstColumn  = testimonials.slice(0, 14);
const secondColumn = testimonials.slice(14, 28);
const thirdColumn  = testimonials.slice(28);

/* Mobile shows only two columns, so slicing the same way would strand the
   third column's 13 testimonials — a third of the social proof, invisible to
   the phone traffic that makes up most visitors. Interleave instead: every
   testimonial appears, and the two content types (progress charts vs
   before/after photos) stay mixed across both columns rather than clumping. */
const mobileFirstColumn  = testimonials.filter((_, i) => i % 2 === 0);
const mobileSecondColumn = testimonials.filter((_, i) => i % 2 === 1);

/* Keep pixel speed constant as column length changes: a taller column must
   take proportionally longer or it whips past. */
const perItem = 0.6;
const mobileDurationFor = (col) => Math.round(col.length * perItem);

function useIsDesktop() {
  const query = '(min-width: 768px)';
  // Initialised synchronously — this is a client-only SPA, so reading
  // matchMedia up front avoids a flash of the wrong column set on load.
  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setIsDesktop(mq.matches);
    // Both signals: the media-query change event is the precise one, and a
    // plain resize listener is the fallback for environments (and orientation
    // changes on some mobile browsers) where that event doesn't fire.
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    sync();
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);
  return isDesktop;
}

export default function TestimonialsSection() {
  const isDesktop = useIsDesktop();
  return (
    <section id="results" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F5F3ED]/50 to-white backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-gray-900 mb-6">
            כשהמסגרת חכמה והליווי עקבי - <span className="text-[#8B7F4B]">השינוי מגיע</span>
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            התוצאות מדברות בעד עצמן.<br></br> צילומי מסך ושיתופים של לקוחות מרוצות שהצליחו לשנות את אורח החיים שלהןד
          </p>
        </motion.div>

        {/* Two columns on mobile: one column moved too little content past the
            viewport before a visitor scrolled on, so the social proof didn't land.
            Third column stays desktop-only to keep cards readable. */}
        <div className="flex justify-center gap-3 md:gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px] md:max-h-[740px] overflow-hidden">
          {isDesktop ? (
            <>
              <TestimonialsColumn testimonials={firstColumn}  duration={14} className="flex-1 max-w-xs" />
              <TestimonialsColumn testimonials={secondColumn} duration={17} className="flex-1 max-w-xs" />
              <TestimonialsColumn testimonials={thirdColumn}  duration={20} className="hidden lg:block flex-1 max-w-xs" />
            </>
          ) : (
            <>
              <TestimonialsColumn
                testimonials={mobileFirstColumn}
                mobileDuration={mobileDurationFor(mobileFirstColumn)}
                className="flex-1 max-w-xs"
              />
              <TestimonialsColumn
                testimonials={mobileSecondColumn}
                mobileDuration={mobileDurationFor(mobileSecondColumn) + 2}
                className="flex-1 max-w-xs"
              />
            </>
          )}
        </div>

        <div className="text-center mt-12 flex flex-wrap gap-4 justify-center">
          <a href="https://wa.link/ntdrz1"
              onClick={() => trackCTA('whatsapp_consult')} target="_blank" rel="noopener noreferrer">
            <
// @ts-ignore
            Button
              size="lg"
 className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full text-base font-bold cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: '#25D366',
                boxShadow: '0 4px 16px rgba(37,211,102,0.30)',
              }}            >
              <WhatsAppIcon className="w-5 h-5 ml-2" />
             לקביעת ייעוץ התאמה חינם
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}