import React from 'react';
import SEOHead from '@/components/SEOHead';

const BRAND = '#8B7F4B';

/**
 * הצהרת נגישות — נדרשת לפי תקנות שוויון זכויות לאנשים עם מוגבלות
 * (התאמות נגישות לשירות), תשע"ג-2013.
 */
export default function Accessibility() {
  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">
      <SEOHead
        title="הצהרת נגישות | תזונה מאפשרת - קים גפסון"
        description="הצהרת הנגישות של אתר תזונה מאפשרת"
      />
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading text-gray-900 mb-8">
          הצהרת נגישות
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            אנו ב<strong>תזונה מאפשרת</strong> רואים חשיבות רבה במתן שירות שוויוני
            לכלל הגולשות והגולשים, ופועלים להנגשת האתר בהתאם לתקנות שוויון זכויות
            לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013, ולתקן הישראלי
            (ת"י 5568) המבוסס על הנחיות WCAG 2.1 ברמה AA.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">התאמות הנגישות באתר</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>ווידג'ט נגישות המאפשר שינוי גודל טקסט, ניגודיות, עצירת אנימציות ועוד</li>
            <li>תמיכה מלאה בניווט מקלדת</li>
            <li>טקסט חלופי לתמונות משמעותיות</li>
            <li>יחסי ניגודיות העומדים בדרישות AA</li>
            <li>תמיכה בהעדפת "הפחתת תנועה" של מערכת ההפעלה</li>
            <li>מבנה כותרות היררכי וסמנטי</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">נתקלת בבעיה?</h2>
          <p>
            אם נתקלת בקושי או בתקלה בנושא נגישות באתר, נשמח שתפני אלינו ונטפל
            בהקדם האפשרי:
          </p>
          <p>
            <strong>פנייה בווצאפ:</strong>{' '}
            <a
              href="https://wa.link/r2etxn"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: BRAND }}
            >
              שירות הלקוחות שלנו
            </a>
          </p>

          <p className="text-sm text-gray-400 pt-4">
            הצהרה זו עודכנה לאחרונה: יוני 2026
          </p>
        </div>
      </div>
    </div>
  );
}
