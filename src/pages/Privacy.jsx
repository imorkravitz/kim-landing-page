import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const BRAND = '#8B7F4B';

/**
 * מדיניות פרטיות.
 *
 * Deliberately narrow, because the site's actual data footprint is narrow:
 * Google Analytics and nothing else. There are no forms, no accounts, and no
 * stored submissions — enquiries leave for WhatsApp, a third party. The text
 * below describes only that, rather than boilerplate about data the site
 * never touches.
 */
export default function Privacy() {
  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">
      <SEOHead
        title="מדיניות פרטיות | תזונה מאפשרת - קים גפסון"
        description="מדיניות הפרטיות של אתר תזונה מאפשרת — איזה מידע נאסף באתר ולמה"
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
          מדיניות פרטיות
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            אתר <strong>"תזונה מאפשרת"</strong> של{' '}
            <strong>קים גפסון קרביץ</strong> מכבד את פרטיות המשתמשים בו.
            מסמך זה מסביר איזה מידע נאסף באתר, לאיזו מטרה, ומה ניתן לעשות בנוגע אליו.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">מה האתר לא אוסף</h2>
          <p>
            נתחיל דווקא מכאן, כי זה עיקר התמונה:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>באתר <strong>אין טפסים</strong> ואין הרשמה — לא נדרש למסור שם, טלפון, דוא"ל או כל פרט מזהה אחר</li>
            <li>אין באתר חשבונות משתמש והתחברות</li>
            <li>האתר <strong>אינו שומר מידע רפואי</strong> ואינו מנהל מאגר מטופלות</li>
            <li>לא נמכר, מושכר או מועבר מידע לצדדים שלישיים למטרות שיווק</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">מה כן נאסף: נתוני שימוש סטטיסטיים</h2>
          <p>
            האתר עושה שימוש בשירות <strong>Google Analytics</strong> של חברת Google,
            כדי להבין כיצד משתמשים באתר ולשפר אותו. השירות אוסף נתונים סטטיסטיים,
            ובכלל זה:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>עמודים שנצפו, משך השהייה ועומק הגלילה בעמוד</li>
            <li>מקור ההגעה לאתר (לדוגמה: אינסטגרם, חיפוש בגוגל, או כניסה ישירה)</li>
            <li>סוג המכשיר, מערכת ההפעלה, הדפדפן ואזור גאוגרפי כללי</li>
            <li>לחיצות על כפתורי יצירת קשר</li>
          </ul>
          <p>
            לצורך כך נשמרות במכשירך <strong>עוגיות (Cookies)</strong> — קבצי טקסט קטנים
            המאפשרים לזהות ביקורים חוזרים באופן אנונימי. הנתונים משמשים במצטבר ולא
            נועדו לזהות אותך אישית.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">איך אפשר להימנע מכך</h2>
          <p>
            ניתן לחסום או למחוק עוגיות דרך הגדרות הדפדפן שלך, וכן להתקין את{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: BRAND }}
            >
              התוסף של Google לביטול המעקב
            </a>
            . חסימת עוגיות אינה פוגעת בשימוש באתר.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">פנייה בווצאפ</h2>
          <p>
            כפתורי יצירת הקשר באתר מפנים לשיחת ווצאפ. מרגע המעבר לווצאפ,
            השיחה מתנהלת בפלטפורמה של חברת Meta וכפופה{' '}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: BRAND }}
            >
              למדיניות הפרטיות של ווצאפ
            </a>
            . האתר עצמו אינו שומר עותק של השיחה או של פרטי הפונה.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">אבטחה</h2>
          <p>
            האתר מוגן בתעודת אבטחה (SSL), כך שהתעבורה בינך לבין האתר מוצפנת.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">שינויים במדיניות</h2>
          <p>
            אם בעתיד יתווספו לאתר רכיבים שאוספים מידע נוסף — למשל טופס יצירת קשר
            או כלי פרסום — מדיניות זו תעודכן בהתאם ותאריך העדכון ישתנה.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">יצירת קשר בנושא פרטיות</h2>
          <p>
            לכל שאלה או בקשה בנוגע לפרטיות ולמידע הנאסף באתר:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>דוא"ל:</strong>{' '}
              <a href="mailto:imkimgafson@gmail.com" className="underline underline-offset-4" style={{ color: BRAND }}>
                imkimgafson@gmail.com
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

          <p className="text-sm text-gray-500 pt-4">
            מדיניות זו עודכנה לאחרונה: אוגוסט 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
