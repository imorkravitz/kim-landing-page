import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BRAND = '#8B7F4B';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const faqs = [
  {
    question: 'ניסיתי כבר כל דיאטה אפשרית. למה שהפעם זה יעבוד?',
    answer: 'כי זו לא עוד דיאטה. דיאטות נכשלות כי הן דורשות ממך להתאים את החיים לתפריט — אנחנו עושות הפוך: מתאימות את התזונה לחיים שלך. בלי רשימת איסורים, בלי "מותר ואסור" — עם ליווי צמוד שמלמד אותך איך לבחור נכון גם בערב שישי, גם במסעדה וגם ביום עמוס.',
  },
  {
    question: 'אין לי זמן לבשל, לשקול ולספור קלוריות. זה בכלל מתאים לי?',
    answer: 'בדיוק בשבילך זה נבנה. התפריט מותאם לשגרה האמיתית שלך — עבודה, ילדים, ארוחות בחוץ — בלי שקילת אוכל ובלי ספירת קלוריות. במקום זה: הכוונה פשוטה, פתרונות מהירים, וגמישות אמיתית לפי גישת 80:20.',
  },
  {
    question: 'איך נראה הליווי ביומיום?',
    answer: 'את מצלמת את הארוחות באפליקציה או שולחת בווצאפ, והדיאטנית שלך מגיבה עם פידבק אישי — מה עבד, מה אפשר לדייק, ואיך להמשיך. בנוסף יש מעקב שבועי קבוע ופגישות זום. את אף פעם לא לבד מול ההחלטות.',
  },
  {
    question: 'תוך כמה זמן אראה שינוי?',
    answer: 'רוב הלקוחות מרגישות שינוי כבר בשבועות הראשונים — יותר אנרגיה, פחות נפיחות, שקט מול האוכל. תהליך משמעותי ויציב לוקח בממוצע 3–6 חודשים, כי המטרה היא לא ירידה מהירה שחוזרת — אלא שינוי שנשאר.',
  },
  {
    question: 'יש לי מצב רפואי — הריון, סוכרת, IBS. אפשר להתאים לי תוכנית?',
    answer: 'כן. אנחנו דיאטניות קליניות ומתמחות בהתאמת תזונה למצבים רפואיים: הריון והנקה, סוכרת, קרוהן וקוליטיס, שחלות פוליציסטיות, אנדומטריוזיס ועוד. חשוב לדעת: איננו מטפלות בהפרעות אכילה, ובמקרה כזה נכוון אותך לגורם המתאים.',
  },
  {
    question: 'מה קורה אם אני "נופלת" באמצע או מפספסת פגישה?',
    answer: 'זה חלק מהתהליך, לא סוף שלו. ארוחה אחת או שבוע פחות מוצלח לא מוחקים כלום — הליווי בנוי בדיוק לרגעים האלה. ואם צריך לדחות פגישה? מתאמות מראש ומוצאות מועד חלופי. פשוט.',
  },
  {
    question: 'מה מדיניות הביטולים? ויש החזר מהביטוח?',
    answer: 'ניתן לבטל בכל עת — החיוב מופסק מהחודש הבא, בלי קנסות ובלי אותיות קטנות. אנחנו רוצות שתישארי כי טוב לך, לא כי התחייבת. ואם יש לך ייעוץ תזונתי בפוליסה הפרטית — נספק לך את כל המסמכים להחזר.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section dir="rtl" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">

        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 mb-4"
            style={{ textWrap: 'balance' }}
          >
            שאלות שכולן שואלות
          </h2>
          <p className="text-xl text-gray-500">
            כל מה שחשוב לדעת לפני שמתחילים — בגובה העיניים
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? `${BRAND}08` : '#ffffff',
                  border: `1px solid ${isOpen ? `${BRAND}33` : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: isOpen
                    ? '0 6px 24px rgba(139,127,75,0.10)'
                    : '0 1px 4px rgba(0,0,0,0.03)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-right cursor-pointer"
                >
                  <span
                    className="font-semibold text-base md:text-lg leading-snug transition-colors duration-200"
                    style={{ color: isOpen ? BRAND : '#111827' }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? BRAND : `${BRAND}12`,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown
                      className="w-4 h-4"
                      style={{ color: isOpen ? '#ffffff' : BRAND }}
                    />
                  </span>
                </button>

                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have a question — direct path to WhatsApp */}
        <div className="max-w-3xl mx-auto mt-10 text-center">
          <p className="text-gray-500 mb-4">
            לא מצאת את התשובה שלך? שאלי אותנו ישירות — עונות מהר.
          </p>
          <a href="https://wa.link/ntdrz1" target="_blank" rel="noopener noreferrer">
            <button
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                color: BRAND,
                background: `${BRAND}0E`,
                border: `1.5px solid ${BRAND}44`,
              }}
            >
              <WaIcon />
              דברי איתנו בווצאפ
            </button>
          </a>
        </div>

      </div>
    </section>
  );
}
