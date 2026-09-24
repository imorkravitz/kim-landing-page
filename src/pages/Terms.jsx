import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { BUSINESS } from '@/data/clinic';

const BRAND = '#8B7F4B';

/* Link and label colour.
   #8B7F4B is the brand hue, but it measures 4.01:1 on white: under the WCAG
   4.5:1 bar for body text. --brand-ink is the same hue darkened to 6.01:1
   and is the role the design system already defines for text. The lighter
   value stays available for fills, where it is never read as text. */
const INK = '#6D6339';


/**
 * תנאי שימוש ותקנון.
 *
 * ── What this page has to do, and why ─────────────────────────────────
 *
 * This is a consumer-facing site selling health services at a distance to
 * Israeli consumers. That puts it squarely inside חוק הגנת הצרכן,
 * התשמ"א-1981 and תקנות הגנת הצרכן (ביטול עסקה), התשע"א-2010, which are
 * not optional and cannot be contracted out of. The sections below exist
 * because those rules require them, not as boilerplate:
 *
 *  • Identity of the trader. עסקת מכר מרחוק requires the consumer be told
 *    who she is buying from, with a real address and a way to reach them.
 *    Those fields come from src/data/clinic.js and are marked ⚠️ there
 *    until filled; this page states plainly when they are missing rather
 *    than inventing them.
 *
 *  • Cancellation. The statutory window for a distance sale of a service
 *    is 14 days from the transaction or from receiving the terms document,
 *    whichever is later, AND not later than two days before the service is
 *    due to begin. A continuing-service subscription (עסקה מתמשכת) can be
 *    cancelled at any time going forward. Both are stated, because the
 *    programmes here are monthly standing orders.
 *
 *  • Digital kits are the exception and must be flagged: an information
 *    product delivered immediately and consumed on receipt is excluded
 *    from the statutory cancellation right, and the consumer has to be
 *    told that BEFORE she pays, not after.
 *
 *  • Medical disclaimer. Nutritional counselling is not medical treatment.
 *    Saying so protects the client first and the business second.
 *
 * ── What this page deliberately does NOT do ───────────────────────────
 *
 * It does not describe payment processing, card storage or chargebacks as
 * things this site performs, because it performs none of them. Checkout
 * happens entirely on the payment provider. Claiming otherwise in a legal
 * document would be a misstatement in the one place misstatements are most
 * expensive.
 *
 * ⚠️  This was written by an engineer reading the statutes, not by a
 * lawyer. Before this goes live it should be read by an Israeli consumer
 * lawyer, particularly the cancellation and refund section.
 */

const H2 = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 pt-4">{children}</h2>
);

export default function Terms() {
  const hasBusinessDetails = Boolean(BUSINESS.taxId && BUSINESS.address);

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans">
      <SEOHead
        title="תנאי שימוש ותקנון | תזונה מאפשרת, קים גפסון"
        description="תנאי השימוש, תנאי ההתקשרות, מדיניות הביטולים וההחזרים של תזונה מאפשרת."
        url={`${BUSINESS.site}/Terms`}
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
          תנאי שימוש ותקנון
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            תנאים אלה חלים על השימוש באתר <strong>{BUSINESS.site.replace('https://', '')}</strong>{' '}
            ועל רכישת השירותים המוצעים בו. הם כתובים בלשון נקבה מטעמי נוחות
            ופונים לכל המגדרים כאחד.
          </p>

          {/* ── מי אנחנו ── */}
          <H2>פרטי בית העסק</H2>
          <ul className="list-disc pr-6 space-y-2">
            <li><strong>שם מסחרי:</strong> {BUSINESS.tradeName}</li>
            <li><strong>שם העוסק:</strong> {BUSINESS.legalName}</li>
            {BUSINESS.taxId && <li><strong>ח.פ. / עוסק מורשה:</strong> {BUSINESS.taxId}</li>}
            {BUSINESS.address && (
              <li><strong>כתובת:</strong> {BUSINESS.address}, {BUSINESS.city}</li>
            )}
            {BUSINESS.phone && <li><strong>טלפון:</strong> {BUSINESS.phone}</li>}
            <li>
              <strong>דוא"ל:</strong>{' '}
              <a href={`mailto:${BUSINESS.email}`} className="underline underline-offset-4" style={{ color: INK }}>
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <strong>שירות לקוחות בווצאפ:</strong>{' '}
              <a
                href={BUSINESS.whatsappSupport}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
                style={{ color: INK }}
              >
                מענה אנושי
              </a>
            </li>
          </ul>

          {!hasBusinessDetails && (
            /* Visible on purpose. A missing company number on a page that
               sells things is a real compliance gap, and a silent one is
               worse than an obvious one. */
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm">
              <strong>לתשומת לבך:</strong> פרטי הזיהוי המלאים של בית העסק
              (מספר ח.פ. או עוסק מורשה וכתובת רשומה) טרם הושלמו באתר.
              לקבלתם ניתן לפנות אלינו בדוא"ל או בווצאפ, והם יימסרו מיד.
            </p>
          )}

          {/* ── השירות ── */}
          <H2>מה השירות כולל</H2>
          <p>
            תוכניות הליווי כוללות פגישות אישיות עם דיאטנית קלינית מוסמכת
            מצוות הקליניקה, בניית תפריט מותאם אישית, מעקב שוטף ותמיכה בווצאפ,
            וכן גישה לאפליקציה התומכת. ההיקף המדויק של כל תוכנית מפורט בעמוד
            התוכניות ומהווה חלק מתנאים אלה.
          </p>
          <p>
            הליווי התזונתי ניתן על ידי דיאטניות קליניות הרשומות בפנקס
            הדיאטנים של משרד הבריאות. קים גפסון קרביץ היא מייסדת הקליניקה,
            בוגרת תואר ראשון במדעי התזונה מהאוניברסיטה העברית וסטודנטית
            לרפואה באוניברסיטת תל אביב.
          </p>
          {/* Stated explicitly because the team is not listed by name on the
              site. An option the visitor cannot see does not exist for her,
              and "our certified dietitians" with no way to check reads as a
              bare assertion. This turns it into a verifiable one. */}
          <p>
            פרטי הדיאטנית שתלווה אותך, לרבות שמה ותעודת ההסמכה שלה, יימסרו
            לך לפי בקשה. ניתן לפנות אלינו{' '}
            {BUSINESS.phone ? (
              <>
                בטלפון{' '}
                <a href={`tel:${BUSINESS.phone.replace(/-/g, '')}`} className="underline underline-offset-4" style={{ color: INK }}>
                  {BUSINESS.phone}
                </a>
                {' '}או{' '}
              </>
            ) : null}
            <a
              href={BUSINESS.whatsappSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: INK }}
            >
              בווצאפ
            </a>
            .
          </p>
          <p>
            אם יש לך כיסוי ביטוחי לייעוץ תזונתי, נספק את כל המסמכים הדרושים
            להגשת בקשה להחזר מחברת הביטוח, לרבות אישורים על הסמכת הדיאטנית
            וקבלות על התשלום.
          </p>

          {/* ── רפואי ── */}
          <H2>הבהרה רפואית</H2>
          <p>
            הליווי התזונתי אינו מהווה טיפול רפואי, אבחון רפואי או תחליף
            לייעוץ של רופאה. התכנים באתר, לרבות המחשבונים והמידע התזונתי,
            הם מידע כללי בלבד ואינם המלצה אישית.
          </p>
          <p>
            אם קיים מצב רפואי, הריון, הנקה, נטילת תרופות קבועה או הפרעת
            אכילה, יש להתייעץ עם רופאה לפני תחילת כל שינוי תזונתי. במצב
            חירום רפואי יש לפנות למוקד 101 או לחדר מיון.
          </p>
          <p>
            תוצאות התהליך משתנות מאישה לאישה ותלויות בגורמים רבים. שום דבר
            באתר אינו מהווה הבטחה לתוצאה מסוימת, לקצב ירידה במשקל או למשך זמן.
          </p>

          {/* ── תשלום ── */}
          <H2>תשלומים ותנאי עסקה</H2>
          <p>
            הרכישה והתשלום מתבצעים במלואם בממשק של ספק הסליקה החיצוני.
            האתר עצמו אינו מקבל, אינו מעבד ואינו שומר פרטי אמצעי תשלום.
          </p>
          <p>
            לפני אישור כל עסקה יוצגו לך בממשק התשלום, במפורש:{' '}
            <strong>מספר התשלומים</strong>, <strong>סכום כל תשלום</strong>,{' '}
            <strong>הסכום הכולל</strong> ומועדי החיוב. תוכניות הליווי החודשיות
            הן עסקה מתמשכת בהוראת קבע, והחיוב חוזר מדי חודש עד לביטול.
            המחירים כוללים מע"מ כחוק.
          </p>
          <p>
            אין לאשר תשלום לפני שקראת את הפירוט הזה. אם משהו במסך התשלום אינו
            תואם את מה שהוצג באתר, אל תשלימי את העסקה ופני אלינו.
          </p>

          {/* ── ביטולים ── */}
          <H2>ביטול עסקה והחזרים</H2>
          <p>
            הוראות אלה ניתנות בהתאם לחוק הגנת הצרכן, התשמ"א-1981 ולתקנות
            הגנת הצרכן (ביטול עסקה), התשע"א-2010. אין באמור כדי לגרוע
            מזכויותייך על פי דין.
          </p>

          <h3 className="font-bold text-gray-800 pt-2">תוכניות ליווי</h3>
          <ul className="list-disc pr-6 space-y-2">
            <li>
              ניתן לבטל בתוך <strong>14 ימים</strong> ממועד העסקה או ממועד
              קבלת מסמך פרטי העסקה, לפי המאוחר, ובלבד שהביטול נעשה לפחות
              שני ימים, שאינם ימי מנוחה, לפני מועד תחילת השירות.
            </li>
            <li>
              בעסקה מתמשכת בהוראת קבע ניתן לבטל בכל עת. הביטול ייכנס לתוקף
              בתוך שלושה ימי עסקים ממועד מסירת ההודעה, ולא ייגבו תשלומים
              נוספים לאחר מכן.
            </li>
            <li>
              בביטול לאחר שהשירות החל, תחויבי באופן יחסי עבור החלק שכבר
              ניתן בפועל, והיתרה תוחזר.
            </li>
            <li>
              בביטול שאינו עקב פגם או אי התאמה, ניתן לגבות דמי ביטול של עד
              5% ממחיר העסקה או 100 ש"ח, לפי הנמוך מביניהם.
            </li>
            <li>
              החזר כספי יבוצע באותו אמצעי תשלום שבו בוצעה העסקה, בתוך 14 ימים
              ממועד קבלת הודעת הביטול.
            </li>
          </ul>

          <h3 className="font-bold text-gray-800 pt-2">ערכות דיגיטליות</h3>
          <p>
            ערכות התוכן הדיגיטליות נמסרות מיד עם התשלום ובאמצעות קישור
            להורדה. בהתאם לתקנות, <strong>מוצר מידע דיגיטלי שנמסר ונצפה
            אינו ניתן לביטול או להחזר</strong>. חשוב לקרוא את תיאור הערכה
            לפני הרכישה. אם נתקלת בקובץ פגום או בקישור שאינו עובד, נחליף
            אותו מיד ללא עלות.
          </p>

          <h3 className="font-bold text-gray-800 pt-2">איך מבטלים</h3>
          <p>
            הודעת ביטול ניתן למסור בדוא"ל{' '}
            <a href={`mailto:${BUSINESS.email}`} className="underline underline-offset-4" style={{ color: INK }}>
              {BUSINESS.email}
            </a>{' '}
            או דרך{' '}
            <a
              href={BUSINESS.whatsappSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ color: INK }}
            >
              שירות הלקוחות בווצאפ
            </a>
            . יש לציין שם מלא ומספר טלפון. נאשר את קבלת הבקשה בכתב.
          </p>
          <p>
            <strong>ביטול בידי אדם עם מוגבלות, אזרח ותיק או עולה חדש:</strong>{' '}
            ניתן לבטל בתוך ארבעה חודשים ממועד העסקה, ובלבד שההתקשרות כללה שיחה
            בין הצדדים. ייתכן שנבקש תעודה מתאימה.
          </p>

          {/* ── קניין רוחני ── */}
          <H2>קניין רוחני</H2>
          <p>
            כל התכנים באתר, לרבות הטקסטים, התמונות, הסרטונים, התפריטים,
            הערכות הדיגיטליות ושיטת "תזונה מאפשרת", הם קניינה של
            {' '}{BUSINESS.legalName} ומוגנים בזכויות יוצרים.
          </p>
          <p>
            התפריטים והערכות מיועדים לשימושך האישי בלבד. אין להעתיק, להפיץ,
            לשתף, לפרסם או למכור אותם, ואין להעביר קישורי הורדה לאחרים.
          </p>

          {/* ── התנהלות ── */}
          <H2>שימוש באתר</H2>
          <p>
            האתר מוצע כפי שהוא. אנו משתדלות שהמידע בו יהיה מדויק ועדכני, אך
            ייתכנו טעויות סופר או אי דיוקים, ואיננו אחראיות לנזק שייגרם
            מהסתמכות על מידע כללי באתר בלי ליווי אישי.
          </p>
          <p>
            האתר מכיל קישורים לשירותים של צדדים שלישיים, ביניהם ווצאפ,
            אפליקציית Liveat וספק הסליקה. השימוש בהם כפוף לתנאים ולמדיניות
            הפרטיות שלהם, ואין לנו שליטה עליהם.
          </p>

          {/* ── פרטיות ── */}
          <H2>פרטיות</H2>
          <p>
            המידע הנאסף באתר ואופן הטיפול בו מפורטים ב
            <Link to="/Privacy" className="underline underline-offset-4" style={{ color: INK }}>
              מדיניות הפרטיות
            </Link>
            , המהווה חלק בלתי נפרד מתנאים אלה.
          </p>

          {/* ── כללי ── */}
          <H2>שינויים בתנאים</H2>
          <p>
            אנו רשאיות לעדכן תנאים אלה מעת לעת. עדכון לא יחול רטרואקטיבית על
            עסקה שכבר נכרתה. התאריך בתחתית העמוד מציין מתי בוצע העדכון האחרון.
          </p>

          <H2>דין וסמכות שיפוט</H2>
          <p>
            על תנאים אלה חלים דיני מדינת ישראל. סמכות השיפוט הבלעדית נתונה
            לבתי המשפט המוסמכים במחוז תל אביב או במקום מגורייך, לפי בחירתך.
          </p>

          <p className="text-sm text-gray-500 pt-4">
            תנאים אלה עודכנו לאחרונה: ספטמבר 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
