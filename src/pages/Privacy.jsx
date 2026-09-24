import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { resetConsent } from '@/lib/consent';
import { BUSINESS } from '@/data/clinic';

const BRAND = '#8B7F4B';

/* Link and label colour.
   #8B7F4B is the brand hue, but it measures 4.01:1 on white: under the WCAG
   4.5:1 bar for body text. --brand-ink is the same hue darkened to 6.01:1
   and is the role the design system already defines for text. The lighter
   value stays available for fills, where it is never read as text. */
const INK = '#6D6339';


/**
 * Withdraw consent.
 *
 * תיקון 13 requires that consent be as easy to take back as it was to
 * give. A sentence telling the visitor to go clear her browser settings
 * does not meet that; a button that actually clears the stored decision
 * and brings the banner back does.
 *
 * It reports what happened rather than silently resetting, because a
 * button that appears to do nothing is indistinguishable from a broken one.
 */
function ConsentReset() {
  const [done, setDone] = React.useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => { resetConsent(); setDone(true); }}
        className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full
                   font-bold text-[16px] text-white transition-opacity
                   hover:opacity-95 active:opacity-90"
        style={{ background: INK }}
      >
        איפוס העדפת העוגיות
      </button>
      {done && (
        <p role="status" className="mt-3 text-sm font-medium" style={{ color: INK }}>
          ההעדפה נמחקה. הודעת העוגיות תוצג שוב כדי שתוכלי לבחור מחדש.
        </p>
      )}
    </div>
  );
}

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
        title="מדיניות פרטיות | תזונה מאפשרת, קים גפסון"
        description="מדיניות הפרטיות של אתר תזונה מאפשרת: איזה מידע נאסף באתר ולמה"
      />
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium underline-offset-4 hover:underline"
          style={{ color: INK }}
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
            <li>באתר <strong>אין טפסים</strong> ואין הרשמה, לא נדרש למסור שם, טלפון, דוא"ל או כל פרט מזהה אחר</li>
            <li>אין באתר חשבונות משתמש והתחברות</li>
            <li>האתר <strong>אינו שומר מידע רפואי</strong> ואינו מנהל מאגר מטופלות</li>
            <li>לא נמכר, מושכר או מועבר מידע לצדדים שלישיים למטרות שיווק</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">מה כן נאסף, ורק לאחר אישורך</h2>
          <p>
            שני כלי מדידה פועלים באתר, ו<strong>שניהם אינם פועלים כלל עד
            שאישרת אותם</strong> בהודעת העוגיות. אם דחית, או אם עדיין לא
            בחרת, לא נטען אף אחד מהם ולא נאסף עלייך דבר.
          </p>

          <h3 className="font-bold text-gray-800 pt-2">Google Analytics</h3>
          <p>
            שירות של חברת Google, שנועד להבין כיצד משתמשים באתר ולשפר אותו.
            נאספים נתונים סטטיסטיים, ובכלל זה:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>עמודים שנצפו, משך השהייה ועומק הגלילה בעמוד</li>
            <li>מקור ההגעה לאתר (לדוגמה: אינסטגרם, חיפוש בגוגל, או כניסה ישירה)</li>
            <li>סוג המכשיר, מערכת ההפעלה, הדפדפן ואזור גאוגרפי כללי</li>
            <li>לחיצות על כפתורי יצירת קשר</li>
          </ul>

          <h3 className="font-bold text-gray-800 pt-2">Meta Pixel</h3>
          <p>
            כלי של חברת Meta, המפעילה את פייסבוק ואינסטגרם. בשונה מכלי
            סטטיסטיקה, הוא מדווח ל־Meta על הביקור שלך באתר ועל לחיצות על
            כפתורי יצירת קשר, ומשמש למדידת יעילות פרסום ולהתאמת מודעות.
            משום כך הוא נטען רק אם אישרת, ולעולם לא לפני כן.{' '}
            <a
              href="https://www.facebook.com/privacy/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: INK }}
            >
              מדיניות הפרטיות של Meta
            </a>
          </p>
          <p>
            לצורך פעולתם נשמרות במכשירך <strong>עוגיות (Cookies)</strong>, קבצי
            טקסט קטנים המאפשרים לזהות ביקורים חוזרים. בנוסף נשמרת במכשירך
            העדפת העוגיות שלך עצמה, כדי שלא נשאל אותך שוב בכל כניסה. שמירה זו
            היא מקומית בלבד, אינה נשלחת לאיש, וחיונית לכיבוד בחירתך.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">שינוי הבחירה שלך</h2>
          <p>
            אפשר לחזור בך בכל רגע, באותה קלות שבה אישרת. לחיצה כאן תמחק את
            ההעדפה השמורה ותציג שוב את הודעת העוגיות, כדי שתוכלי לבחור מחדש.
          </p>
          <ConsentReset />

          <h2 className="text-xl font-bold text-gray-900 pt-2">דרכים נוספות להימנע מכך</h2>
          <p>
            ניתן לחסום או למחוק עוגיות דרך הגדרות הדפדפן שלך, וכן להתקין את{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: INK }}
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
              style={{ color: INK }}
            >
              למדיניות הפרטיות של ווצאפ
            </a>
            . האתר עצמו אינו שומר עותק של השיחה או של פרטי הפונה.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">אבטחה</h2>
          <p>
            האתר מוגן בתעודת אבטחה (SSL), כך שהתעבורה בינך לבין האתר מוצפנת.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">איזה דין חל</h2>
          <p>
            האתר מופעל מישראל, פונה לקהל ישראלי, מוצג בעברית בלבד והמחירים בו
            בשקלים. לכן חל עליו{' '}
            <strong>חוק הגנת הפרטיות, התשמ"א-1981, כפי שתוקן בתיקון 13</strong>,
            וכן חוק הגנת הצרכן.
          </p>
          <p>
            <strong>GDPR</strong> (התקנה האירופית) חל על עסק שמכוון את שירותיו
            לתושבות האיחוד האירופי. אתר זה אינו מכוון לשם, אינו מציע מחירים
            במטבע אירופי ואינו משווק באירופה, ולכן התקנה אינה חלה עליו ככלל.
            אם את פונה אלינו מהאיחוד האירופי ומבקשת לממש זכות מכוחה, נכבד
            את הבקשה בכל מקרה.
          </p>
          <p>
            <strong>CCPA</strong> (חוק הפרטיות של קליפורניה) חל על עסקים
            העומדים בסף מחזור או היקף נתונים גדול, או שעיקר הכנסתם ממכירת
            מידע אישי. אף אחד מאלה אינו מתקיים כאן, ולכן הוא אינו חל.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">הזכויות שלך</h2>
          <p>
            מאחר שהאתר אינו מנהל מאגר לקוחות ואינו אוסף פרטים מזהים, אין בו
            מידע אישי שלך לעיין בו או למחוק. ביחס למידע הסטטיסטי:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>את רשאית לסרב לאיסוף מלכתחילה, ולחזור בך בכל עת</li>
            <li>את רשאית לדעת מה נאסף, וזה מפורט למעלה במלואו</li>
            <li>
              אם התקשרת איתנו ונפתח עבורך תיק לקוחה, המידע הרפואי והתזונתי
              נשמר במערכות הקליניקה ולא באתר. לפנייה בנוגע אליו, לרבות
              עיון ותיקון, ניתן לכתוב אלינו בכתובת שלמטה.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">מי אחראי למידע</h2>
          <p>
            בעלת האתר והאחראית על המידע היא <strong>{BUSINESS.legalName}</strong>
            {BUSINESS.taxId ? `, ח.פ. ${BUSINESS.taxId}` : ''}
            {BUSINESS.address ? `, ${BUSINESS.address}, ${BUSINESS.city}` : ''}.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">שינויים במדיניות</h2>
          <p>
            אם בעתיד יתווספו לאתר רכיבים שאוספים מידע נוסף, למשל טופס יצירת קשר
            או כלי פרסום, מדיניות זו תעודכן בהתאם ותאריך העדכון ישתנה.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">יצירת קשר בנושא פרטיות</h2>
          <p>
            לכל שאלה או בקשה בנוגע לפרטיות ולמידע הנאסף באתר:
          </p>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              <strong>דוא"ל:</strong>{' '}
              <a href="mailto:imkimgafson@gmail.com" className="underline underline-offset-4" style={{ color: INK }}>
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
                style={{ color: INK }}
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
