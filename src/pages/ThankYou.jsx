import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Smartphone, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { trackCTA } from '@/lib/analytics';

/**
 * Post-purchase landing page.
 *
 * The payment provider redirects here after a nutrition-programme purchase, so
 * this page is the first thing a new client sees as a client rather than a
 * visitor. Two things follow from that:
 *
 * 1. It claims nothing it cannot know. No order number, no plan name, no "a
 *    confirmation email is on its way" — the site never receives any of that.
 *    Payment, card details and order records all live with the provider. A
 *    confident-sounding detail that turns out to be wrong is worse than none
 *    at the exact moment someone has just handed over money.
 *
 * 2. It gives one clear next action instead of leaving her waiting. Telling a
 *    new client "we will be in touch" ends the moment on someone else's
 *    schedule; handing her the WhatsApp thread lets her start now.
 *
 * noindex, because a thank-you page in search results means strangers landing
 * on a purchase confirmation they never made.
 */
export default function ThankYou() {
  /* Fires once on arrival. This is the only place the site can observe that a
     purchase completed — the transaction itself happens on the provider — so
     it is what makes the funnel measurable end to end. */
  useEffect(() => {
    trackCTA('purchase_complete', 'thank_you_page');
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg-primary)] font-sans">
      <SEOHead
        title="תודה על ההצטרפות | תזונה מאפשרת, קים גפסון"
        description="ההרשמה הושלמה. הנה מה שקורה עכשיו."
        url="https://kimgafson.co.il/ThankYou"
        noindex
      />

      <main className="container mx-auto px-6 py-14 md:py-20 max-w-3xl">
        <section className="text-center">
          <span
            className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full
                       bg-[var(--brand-tint)] mb-6"
            aria-hidden="true"
          >
            <CheckCircle2 className="w-11 h-11 md:w-14 md:h-14 text-[var(--brand-ink)]" />
          </span>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-heading text-[var(--text-primary)] mb-4"
            style={{ textWrap: 'balance' }}
          >
            קיבלנו וברוכה הבאה
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            ההרשמה שלך הושלמה. מכאן זה כבר לא עוד ניסיון לבד יש לך צוות.
          </p>
        </section>

        {/* What happens next — three concrete steps, in order */}
        <section aria-labelledby="next-heading" className="mt-12 md:mt-16">
          <h2
            id="next-heading"
            className="text-2xl md:text-3xl font-heading text-[var(--text-primary)] mb-6 text-center"
          >
            מה קורה עכשיו
          </h2>

          <ol className="space-y-4 list-none">
            {[
              {
                n: '1',
                title: 'נתאם את הפגישה הראשונה',
                body: 'הדיאטנית שתלווה אותך תיצור איתך קשר לתיאום. אם נוח לך להקדים כתבי לנו בווצאפ ונסגור מיד.',
              },
              {
                n: '2',
                title: 'נבנה את התפריט סביב החיים שלך',
                body: 'בפגישה נעבור על השגרה, ההעדפות והמטרות שלך, ומשם נבנה תוכנית שמתאימה לך לא תפריט גנרי.',
              },
              {
                n: '3',
                title: 'מתחילות בליווי היומיומי',
                body: 'מצלמת ארוחות באפליקציה או שולחת בווצאפ, ומקבלת פידבק אישי לאורך הדרך.',
              },
            ].map((step) => (
              <li
                key={step.n}
                className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-[var(--bg-secondary)]
                           border border-[var(--border-subtle)]"
              >
                <span
                  className="w-9 h-9 shrink-0 rounded-full bg-[var(--brand-surface)] text-white
                             font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <span>
                  <span className="block font-bold text-[var(--text-primary)] mb-1">{step.title}</span>
                  <span className="block text-[var(--text-secondary)] leading-relaxed">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Actions she can take right now */}
        <section aria-labelledby="do-now-heading" className="mt-12 md:mt-16">
          <h2 id="do-now-heading" className="sr-only">פעולות מיידיות</h2>

          <a
            href="https://wa.link/r2etxn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('whatsapp_support', 'thank_you_page')}
            className="flex items-center justify-center gap-2.5 w-full min-h-[56px] rounded-full
                       text-white font-bold text-[17px] bg-[var(--wa-green-ink)]
                       hover:opacity-95 active:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            דברי איתנו בווצאפ ונתחיל
          </a>

          <a
            href="https://onelink.to/zter3n"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('app_download', 'thank_you_page')}
            className="mt-3 flex items-center justify-center gap-2.5 w-full min-h-[56px] rounded-full
                       font-bold text-[17px] text-[var(--brand-ink)] bg-[var(--surface-sunken)]
                       border border-[var(--border-brand)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Smartphone className="w-5 h-5" aria-hidden="true" />
            הורידי את אפליקציית Liveat
          </a>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6 leading-relaxed">
            אישור התשלום נשלח אלייך ישירות מספק הסליקה. לכל שאלה בנוגע לחיוב
            אנחנו כאן בווצאפ.
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4
                       hover:underline text-[var(--brand-ink)]"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            חזרה לדף הבית
          </Link>
        </div>
      </main>
    </div>
  );
}
