import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'כמה זמן לוקח התהליך?',
      answer: 'התהליך מותאם אישית לכל אחת. בממוצע, תהליך משמעותי לוקח בין 3-6 חודשים, אבל כבר מהשבועות הראשונים תראי שינוי. אנחנו מאמינות בשינוי מתמשך ולא בדיאטות בזק.'
    },
    {
      question: 'האם התוכנית מתאימה להריון, סוכרת או IBS?',
      answer: 'בהחלט! אנחנו מתמחות בהתאמת תפריטים למצבים רפואיים שונים כולל הריון והנקה, סוכרת, IBD (קרוהן/קוליטיס), שחלות פוליציסטיות, אנדומטריוזיס ועוד. חשוב לציין - איננו מטפלות בהפרעות אכילה.'
    },
    {
      question: 'מה קורה אם אני מפספסת פגישה?',
      answer: 'אנחנו מבינות שהחיים קורים! אם את צריכה לדחות פגישה, פשוט תאמי מראש ונמצא מועד חלופי. אנחנו גמישות ומתאימות את עצמנו לסגנון החיים שלך.'
    },
    {
      question: 'איך עובד הליווי היומי?',
      answer: 'את מצלמת את המנות שלך באפליקציית Liveat או שולחת בוואטסאפ, והדיאטנית שלך מגיבה, מכוונת ונותנת פידבק. בנוסף, יש שקילה שבועית קבועה ופגישות זום חודשיות.'
    },
    {
      question: 'מה המדיניות לביטולים והחזרים?',
      answer: 'ניתן לבטל בכל עת. במקרה של ביטול, החיוב יופסק החל מהחודש הבא. אנחנו רוצות שתהיי פה כי את רוצה, לא בגלל התחייבות.'
    },
    {
      question: 'האם יש אפשרות לכיסוי ביטוחי?',
      answer: 'כן! ללקוחות עם ייעוץ תזונתי בפוליסה פרטית יש אפשרות להחזר. אנחנו נספק לך את כל המסמכים הדרושים להגשה.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-xl text-gray-500">
            כל מה שרציתם לדעת על התהליך והליווי
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#8B7F4B] transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}