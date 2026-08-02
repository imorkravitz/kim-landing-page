import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium underline-offset-4 hover:underline"
          style={{ color: BRAND }}
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לדף הבית
        </Link>

        <h1 className="text-3xl md:text-4xl font-heading text-gray-900 mb-8">
          הצהרת נגישות
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            אתר <strong>"תזונה מאפשרת"</strong> של{' '}
            <strong>קים גפסון קרביץ</strong> והצוות המקצועי
            שלה, רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשות והגולשים.
            אנו פועלים להנגשת האתר בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות
            (התאמות נגישות לשירות), תשע"ג-2013, ולתקן הישראלי (ת"י 5568) המבוסס
            על הנחיות WCAG 2.1 ברמה AA.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">התאמות הנגישות באתר</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>תפריט נגישות הכולל שינוי גודל טקסט, ניגודיות גבוהה, היפוך צבעים, הדגשת קישורים, סמן מוגדל, גופן קריא והגדלת מרווח שורות</li>
            <li>ההגדרות שנבחרו בתפריט הנגישות נשמרות בין עמודים ובין ביקורים</li>
            <li>קישור "דילוג לתוכן הראשי" בתחילת העמוד</li>
            <li>תמיכה בניווט ובהפעלה מלאה באמצעות מקלדת, כולל סימון ברור של מוקד ההתמקדות</li>
            <li>טקסט חלופי לתמונות משמעותיות</li>
            <li>מבנה כותרות היררכי וסמנטי ותגיות ARIA לקוראי מסך</li>
            <li>תמיכה בהעדפת "הפחתת תנועה" של מערכת ההפעלה</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">מגבלות נגישות ידועות</h2>
          <p>
            האתר כולל אזור סיפורי הצלחה המוצג באמצעות צילומי מסך של הודעות מלקוחות.
            תוכן הצילומים אינו נגיש במלואו לקוראי מסך. ניתן לקבל את תוכן ההמלצות
            בכתב בפנייה אלינו בערוצי הקשר המפורטים בהמשך.
          </p>
          <p>
            אנו ממשיכים לשפר את נגישות האתר באופן שוטף. אם מצאת רכיב שאינו נגיש,
            נשמח לדעת ונטפל בכך בהקדם.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">רכזת הנגישות ופרטי יצירת קשר</h2>
          <p>
            אחראית הנגישות באתר: <strong>קים גפסון קרביץ</strong>.
            <br />
            לפניות בנושא נגישות — כולל דיווח על תקלת נגישות או בקשה לקבלת מידע
            בדרך חלופית:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>דוא"ל:</strong>{' '}
              <a href="mailto:kimgafson@gmail.com" className="underline underline-offset-4" style={{ color: BRAND }}>
                kimgafson@gmail.com
              </a>
            </li>
            <li>
              <strong>ווצאפ:</strong>{' '}
              <a
                href="https://wa.link/r2etxn"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
                style={{ color: BRAND }}
              >
                שירות הלקוחות שלנו
              </a>
            </li>
          </ul>
          <p>
            נשתדל לטפל בפנייה בהקדם האפשרי, ובכל מקרה בתוך הזמן הקבוע בתקנות.
          </p>

          <p className="text-sm text-gray-500 pt-4">
            הצהרה זו עודכנה לאחרונה: אוגוסט 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
