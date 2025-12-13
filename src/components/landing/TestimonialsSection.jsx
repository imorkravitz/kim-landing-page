// @ts-ignore
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TestimonialsColumn } from '@/components/ui/testimonials-column';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';

// @ts-ignore
import img1 from '../../assets/patientsSuccess/1.png';
// @ts-ignore
import img2 from '../../assets/patientsSuccess/2.png';
// @ts-ignore
import img3 from '../../assets/patientsSuccess/3.png';
// @ts-ignore
import img4 from '../../assets/patientsSuccess/4.png';
// @ts-ignore
import img5 from '../../assets/patientsSuccess/5.png';
// @ts-ignore
import img6 from '../../assets/patientsSuccess/6.png';
// @ts-ignore
import img7 from '../../assets/patientsSuccess/7.png';
// @ts-ignore
import img8 from '../../assets/patientsSuccess/8.png';
// @ts-ignore
import img9 from '../../assets/patientsSuccess/9.png';
// @ts-ignore
import img10 from '../../assets/patientsSuccess/10.png';
// @ts-ignore
import img11 from '../../assets/patientsSuccess/11.png';
// @ts-ignore
import img12 from '../../assets/patientsSuccess/12.png';
// @ts-ignore
import img13 from '../../assets/patientsSuccess/13.png';
// @ts-ignore
import img14 from '../../assets/patientsSuccess/14.png';
// @ts-ignore
import img15 from '../../assets/patientsSuccess/15.png';
// @ts-ignore
import img16 from '../../assets/patientsSuccess/16.png';
// @ts-ignore
import img17 from '../../assets/patientsSuccess/17.png';
// @ts-ignore
import img18 from '../../assets/patientsSuccess/18.png';
// @ts-ignore
import img19 from '../../assets/patientsSuccess/19.png';
// @ts-ignore
import img20 from '../../assets/patientsSuccess/20.png';
// @ts-ignore
import img21 from '../../assets/patientsSuccess/21.png';
// @ts-ignore
import img22 from '../../assets/patientsSuccess/22.png';
// @ts-ignore
import img23 from '../../assets/patientsSuccess/23.png';
// @ts-ignore
import img24 from '../../assets/patientsSuccess/24.png';
// @ts-ignore
import img25 from '../../assets/patientsSuccess/25.png';
// @ts-ignore
import img26 from '../../assets/patientsSuccess/26.png';
// @ts-ignore
import img27 from '../../assets/patientsSuccess/27.png';
// @ts-ignore
import img28 from '../../assets/patientsSuccess/28.png';
// @ts-ignore
import img29 from '../../assets/patientsSuccess/29.png';
// @ts-ignore
import img30 from '../../assets/patientsSuccess/30.png';
// @ts-ignore
import img31 from '../../assets/patientsSuccess/31.png';
// @ts-ignore
import img32 from '../../assets/patientsSuccess/32.png';
// @ts-ignore
import img33 from '../../assets/patientsSuccess/33.png';
// @ts-ignore
import img34 from '../../assets/patientsSuccess/34.png';
// @ts-ignore
import img35 from '../../assets/patientsSuccess/35.png';
// @ts-ignore
import img36 from '../../assets/patientsSuccess/36.png';
// @ts-ignore
import img37 from '../../assets/patientsSuccess/37.png';
// @ts-ignore
import img38 from '../../assets/patientsSuccess/38.png';
// @ts-ignore
import img39 from '../../assets/patientsSuccess/39.png';
// @ts-ignore
import img40 from '../../assets/patientsSuccess/40.png';
// @ts-ignore
import img41 from '../../assets/patientsSuccess/41.png';

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
    role: 'ירדה 12 ק"ג ב-4 חודשים',
  },
  {
    text: "",
    image: img2,
    role: "שיפור במדדי הדם",
  },
  {
    text: "",
    image: img3,
    role: "למדה לאכול נכון",
  },
  {
    text: "",
    image: img4,
    role: 'ירדה 8 ק"ג ב-3 חודשים',
  },
  {
    text: "",
    image: img5,
    role: "שינוי אורח חיים מלא",
  },
  {
    text: "",
    image: img6,
    role: "למדה להכין אוכל בריא",
  },
  {
    text: "",
    image: img7,
    role: 'ירדה 15 ק"ג ב-6 חודשים',
  },
  {
    text: "",
    image: img8,
    role: "התגברה על אכילה רגשית",
  },
  {
    text: "",
    image: img9,
    role: "שינתה את התזונה של כל המשפחה",
  },

  // --- תמונות חדשות (10-25) ---
  {
    text: "",
    image: img10,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img11,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img12,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img13,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img14,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img15,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img16,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img17,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img18,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img19,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img20,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img21,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img22,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img23,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img24,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img25,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img26,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img27,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img28,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img29,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img30,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img31,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img32,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img33,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img34,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img35,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img36,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img37,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img38,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img39,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img40,
    role: "תיאור ההצלחה",
  },
  {
    text: "",
    image: img41,
    role: "תיאור ההצלחה",
  },
];

const firstColumn = testimonials.slice(0, 14);   // תמונות 1-14 (14 פריטים)
const secondColumn = testimonials.slice(14, 28); // תמונות 15-28 (14 פריטים)
const thirdColumn = testimonials.slice(28);

export default function TestimonialsSection() {
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
            <div className="border border-[#8B7F4B]/30 bg-[#8B7F4B]/10 py-2 px-4 rounded-lg text-[#8B7F4B] font-medium">
              תוצאות
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            כשהמסגרת חכמה והליווי עקבי = <span className="text-[#8B7F4B]">רואים שינוי</span>
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            התוצאות מדברות בעד עצמן. צילומי מסך אמיתיים משיחות עם מטופלות שהצליחו לשנות את אורח החיים שלהן
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={30} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={35} />
        </div>

        <div className="text-center mt-12 flex flex-wrap gap-4 justify-center">
          <a href="https://wa.link/r2etxn" target="_blank" rel="noopener noreferrer">
            <
// @ts-ignore
            Button
              size="lg"
              className="bg-[#8B7F4B] text-white rounded-2xl px-8 py-6 text-lg font-medium shadow-[0_4px_6px_-1px_rgba(139,127,75,0.4)] hover:bg-[#6d6339] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
            >
              <WhatsAppIcon className="w-5 h-5 ml-2" />
              רוצה מסגרת דומה? התחילי עכשיו
            </Button>
          </a>
          <Link to={createPageUrl('SuccessStories')}>
            {/* <
// @ts-ignore
            Button
              size="lg"
              variant="outline"
              className="border-2 border-[#8B7F4B] text-[#8B7F4B] rounded-2xl px-8 py-6 text-lg font-medium shadow-none hover:bg-[#8B7F4B] hover:text-white hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
            >
              לכל סיפורי ההצלחה
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button> */}
          </Link>
        </div>
      </div>
    </section>
  );
}