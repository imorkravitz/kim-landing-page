import React, { useEffect, useRef, useState, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Plus, ChevronDown, ShieldCheck } from 'lucide-react';
import img_6a474e22f_Untitleddesign7 from '../../assets/remote/6a474e22f_Untitleddesign7.avif';
import img_8fa64f760_1 from '../../assets/remote/8fa64f760_1.avif';
import img_df0c9358a_2 from '../../assets/remote/df0c9358a_2.avif';
import { trackCTA } from '@/lib/analytics';
import { activePlans, CANCELLATION } from '@/data/plans';
import { BUSINESS } from '@/data/clinic';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const shekel = (n) => n.toLocaleString('he-IL');

/* The project's standing ease-out. Already used in ScrollStorySection and
   TestimonialsSection, so reusing it keeps one rhythm across the page rather
   than introducing a fourth curve. Ease-out only: content arriving should
   decelerate into place, never accelerate away from the reader. */
const EASE_OUT = [0.22, 1, 0.36, 1];

/**
 * תוכניות הליווי.
 *
 * ── What this section had to solve ────────────────────────────────────
 *
 * The previous version showed three cards, each with its own near-identical
 * feature list, and prices of 439 / 399 / 409 per month. Three problems
 * followed from that, and they compounded:
 *
 * 1. The cards were visually interchangeable, so the eye had nothing to
 *    compare. There was no ladder, only three boxes.
 * 2. The twelve-month plan costs MORE per month than the six-month one.
 *    That is deliberate, because it is the only plan that includes a
 *    personal session with Kim and the closed group, but the page never
 *    said so. A reader who notices the inversion and finds no explanation
 *    concludes the pricing is arbitrary, which is a trust problem rather
 *    than a price problem.
 * 3. Only the monthly figure appeared. Signing a twelve-month standing
 *    order without seeing ₪4,908 anywhere reads as something being kept
 *    from you, and for a continuing-service transaction the total belongs
 *    in front of the customer before she commits.
 *
 * ── The structure that fixes it ───────────────────────────────────────
 *
 * Each card states only what it ADDS to the one before. The shared base
 * collapses into a single expandable row. The increments on the twelve
 * month plan are set larger than the rest, so the extra cost and the extra
 * value land in the same glance. See src/data/plans.js.
 *
 * ── Two paths, not one ────────────────────────────────────────────────
 *
 * The owner's instinct was to remove prices entirely, the way a competitor
 * does, and push everyone into a WhatsApp conversation. The risk there is
 * the visitor who had already decided: a woman tapping a payment link at
 * 23:40 did not want a conversation, and removing her path does not turn
 * her into a lead, it turns her into a closed tab.
 *
 * So both paths exist, and the free consultation is the louder of the two.
 * Nobody is forced to talk to a human, and nobody is forced not to.
 *
 * ── The guarantee ─────────────────────────────────────────────────────
 *
 * "הוראת קבע ל-12 חודשים" reads like a gym contract. The sentence that
 * dissolves that fear already existed on the page, inside the FAQ, one
 * section BELOW this one, which is to say after the moment of doubt. It is
 * now stated on every card.
 */
export default function PricingSection() {
  const sectionRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const reduce = useReducedMotion();

  /* Fires once when the section is genuinely on screen.
     Until now the funnel could only report which plan was CLICKED, never how
     many people reached the plans and left. Without this denominator the
     question "is the price the blocker" cannot be answered: a low click rate
     on a section nobody scrolls to means something entirely different from a
     low click rate on a section everybody reads. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setSeen(true);
          trackCTA('pricing_view', 'pricing');
          io.disconnect();
        }
      },
      /* Half the viewport rather than half the element: the section is taller
         than a phone screen, so a 50% element threshold could never fire. */
      { rootMargin: '0px 0px -40% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      aria-labelledby="pricing-heading"
      className="section-lg relative overflow-hidden bg-[var(--bg-tertiary)]"
    >
      {/* Decorative produce illustrations, kept from the previous design.
          aria-hidden and pointer-events-none: they are atmosphere, not content. */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-70"
           style={{ backgroundImage: seen ? `url(${img_6a474e22f_Untitleddesign7})` : 'none' }} />
      <div aria-hidden="true"
           className="absolute bottom-0 left-0 w-[30rem] h-[40rem] md:w-[44rem] md:h-[58rem] pointer-events-none opacity-80"
           style={{
             backgroundImage: seen ? `url(${img_8fa64f760_1})` : 'none',
             backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom left', backgroundSize: 'contain',
           }} />
      <div aria-hidden="true"
           className="absolute top-0 right-0 w-[15rem] h-[20rem] md:w-[22rem] md:h-[30rem] pointer-events-none opacity-80"
           style={{
             backgroundImage: seen ? `url(${img_df0c9358a_2})` : 'none',
             backgroundRepeat: 'no-repeat', backgroundPosition: 'top right', backgroundSize: 'contain',
           }} />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2
            id="pricing-heading"
            className="font-heading text-[clamp(1.9rem,6vw,3rem)] leading-[1.15] text-[var(--text-primary)] mb-4"
            style={{ textWrap: 'balance' }}
          >
            כמה זמן את רוצה שנהיה לידך?
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed" style={{ textWrap: 'pretty' }}>
            בכל התוכניות את מקבלת את אותו ליווי אישי. ההבדל הוא כמה זמן הוא נמשך,
            וכמה עמוק נספיק להיכנס.
          </p>
        </header>

        {/* auto-fit rather than a fixed 3-column grid: if a plan is switched
            off in plans.js the remaining two still fill the row properly. */}
        <ul
          className="grid gap-5 lg:gap-6 max-w-6xl mx-auto list-none items-stretch"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 19rem), 1fr))' }}
        >
          {activePlans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} reduce={reduce} />
          ))}
        </ul>

        <ClosingHelp />
      </div>
    </section>
  );
}

/* ── One plan ──────────────────────────────────────────────────────── */

function PlanCard({ plan, index, reduce }) {
  const [openBase, setOpenBase] = useState(false);
  const baseId = useId();
  const featured = Boolean(plan.popular);

  return (
    <motion.li
      /* whileInView, not a class toggled by an observer: a class-gated reveal
         leaves the card at opacity 0 if the transition never runs, which is
         exactly what happens in a headless render or a background tab.
         `once` so the cards never re-animate when scrolling back up. */
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: reduce ? 0 : index * 0.08 }}
      className={`relative flex flex-col rounded-3xl bg-[var(--surface-card)] overflow-hidden
                  ${featured
                    ? 'ring-2 ring-[var(--brand-surface)] shadow-[var(--elev-3)]'
                    : 'ring-1 ring-[var(--border-default)] shadow-[var(--elev-1)]'}`}
    >
      {featured && (
        <p className="bg-[var(--brand-surface)] text-white text-center text-sm font-bold py-2 px-3">
          {plan.popularLabel}
        </p>
      )}

      <div className="flex flex-col flex-1 p-6 md:p-7">

        {/* ── Identity ── */}
        <h3 className="font-heading text-3xl text-[var(--brand-ink)] mb-1">{plan.name}</h3>
        <p className="text-[15px] font-semibold text-[var(--brand-ink)] mb-3">
          {plan.months} חודשים
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6" style={{ textWrap: 'pretty' }}>
          {plan.fit}
        </p>

        {/* ── What this plan adds ──
            The first plan has nothing to add, so it shows its base openly
            instead. Every later plan leads with its increment, which is the
            only thing the reader is actually choosing between. */}
        {plan.adds.length > 0 ? (
          <div className="mb-5">
            <p className="text-sm font-bold text-[var(--text-primary)] mb-3">
              כל מה שב{plan.inheritsFrom}, ובנוסף:
            </p>
            <ul className="space-y-2.5 list-none">
              {plan.adds.map((add) => (
                <li key={add.text} className="flex items-start gap-2.5">
                  <Plus
                    className={`shrink-0 mt-0.5 ${add.emphasis ? 'w-5 h-5' : 'w-4 h-4 mt-1'} text-[var(--brand-surface)]`}
                    aria-hidden="true"
                  />
                  <span className={add.emphasis
                    ? 'text-[17px] font-bold text-[var(--text-primary)] leading-snug'
                    : 'text-[15px] text-[var(--text-secondary)] leading-snug'}>
                    {add.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* The shared base, folded away. It is identical in every plan, so
                repeating it at full size three times is what made the cards
                indistinguishable in the first place. */}
            <button
              type="button"
              onClick={() => setOpenBase((v) => !v)}
              aria-expanded={openBase}
              aria-controls={baseId}
              className="mt-4 w-full flex items-center justify-between gap-2 min-h-[44px] text-right
                         text-sm font-medium text-[var(--brand-ink)] rounded-lg px-1
                         hover:bg-[var(--brand-tint)] transition-colors"
            >
              <span>וגם כל הבסיס שבכל התוכניות</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openBase ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            <BaseList id={baseId} items={plan.base} open={openBase} reduce={reduce} />
          </div>
        ) : (
          <div className="mb-5">
            <p className="text-sm font-bold text-[var(--text-primary)] mb-3">מה כלול:</p>
            <ul className="space-y-2.5 list-none">
              {plan.base.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 mt-1 shrink-0 text-[var(--brand-surface)]" aria-hidden="true" />
                  <span className="text-[15px] text-[var(--text-secondary)] leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Price ──
            mt-auto pins this block to the bottom of every card regardless of
            how much content sits above it, so the three prices line up across
            the row without needing the height-matching hook the old version
            carried. */}
        <div className="mt-auto pt-5 border-t border-[var(--border-subtle)]">
          <p className="flex items-baseline gap-1.5 text-[var(--text-primary)]">
            <span className="text-4xl font-bold">{shekel(plan.pricePerMonth)}</span>
            <span className="text-2xl font-bold">₪</span>
            <span className="text-base text-[var(--text-secondary)]">לחודש</span>
          </p>
          <p className="text-[15px] text-[var(--text-secondary)] mt-1">
            סה"כ {shekel(plan.total)} ₪ על פני {plan.months} חודשים
          </p>

          {/* The slot is reserved on every card from md up, where the three
              cards sit side by side, even though only one plan carries a note.
              Without it that card's price block is taller, and because the
              block is bottom-anchored the extra height pushes its ₪ figure
              ~26px above the other two. Measured: price blocks at 698 / 698 /
              672. In a section whose entire job is comparing three numbers at
              a glance, having them off a common baseline is the kind of
              misalignment the eye registers as sloppiness without naming it.
              Below md the cards stack and nothing needs reserving. */}
          <div className="mt-2 md:min-h-[2.4rem]">
            {plan.priceNote && (
              <p className="text-[13px] text-[var(--text-muted)] leading-snug">
                {plan.priceNote}
              </p>
            )}
          </div>

          <p className="flex items-start gap-2 mt-3 text-[13px] text-[var(--text-secondary)] leading-snug">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[var(--brand-surface)]" aria-hidden="true" />
            <span>{CANCELLATION}</span>
          </p>
        </div>

        {/* ── Two ways forward ──
            The consultation is the primary action and the payment link is the
            secondary one, but the secondary is a real button rather than a
            buried link: the visitor who has already decided should not have to
            hunt for the way to pay. */}
        <div className="mt-5 space-y-2.5">
          <a
            href={BUSINESS.whatsappConsult}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA(`consult_${plan.id}`, 'pricing')}
            className="flex items-center justify-center gap-2.5 w-full min-h-[52px] rounded-full
                       text-white font-bold text-[16px] bg-[var(--wa-green-ink)]
                       hover:opacity-95 active:opacity-90 transition-opacity"
          >
            <WhatsAppIcon className="w-5 h-5" />
            לבדוק אם זו התוכנית שלי
          </a>
          <a
            href={plan.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA(`program_select_${plan.id}`, 'pricing')}
            className="flex items-center justify-center w-full min-h-[48px] rounded-full
                       font-bold text-[15px] text-[var(--brand-ink)] bg-[var(--surface-sunken)]
                       border border-[var(--border-brand)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            יודעת מה אני רוצה, להרשמה
          </a>
        </div>
      </div>
    </motion.li>
  );
}

/* ── The shared base, expandable ───────────────────────────────────── */

function BaseList({ id, items, open, reduce }) {
  /* Height, animated by Framer Motion rather than by CSS.
   *
   * The obvious CSS-only version of this is the grid-rows 0fr-to-1fr trick,
   * and it was tried here first. It silently collapses: the inner element
   * needs overflow:hidden so the list clips while closing, and an element
   * with overflow other than visible is a scroll container, whose automatic
   * minimum size in a grid track is zero. `1fr` then has no free space to
   * distribute and the row computes to 0px however tall the content is.
   * Measured in the browser: inline style grid-template-rows:1fr, content
   * 145px, computed row 0px.
   *
   * Motion measures the content instead, so `auto` is a real target. It also
   * makes the panel interruptible: tapping twice quickly reverses from the
   * current height rather than snapping. */
  return (
    <motion.div
      id={id}
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.26, ease: EASE_OUT }}
      style={{ overflow: 'hidden' }}
    >
      <ul className="space-y-2.5 list-none pt-3">
        {items.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 mt-1 shrink-0 text-[var(--brand-surface)]" aria-hidden="true" />
            <span className="text-[15px] text-[var(--text-secondary)] leading-snug">{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── For anyone still undecided ────────────────────────────────────── */

function ClosingHelp() {
  return (
    <div className="max-w-2xl mx-auto mt-10 md:mt-14 text-center">
      <p className="text-lg md:text-xl text-[var(--text-primary)] font-semibold mb-2" style={{ textWrap: 'balance' }}>
        לא בטוחה איזו מתאימה לך?
      </p>
      <p className="text-[var(--text-secondary)] leading-relaxed mb-5" style={{ textWrap: 'pretty' }}>
        זה בדיוק מה שייעוץ ההתאמה נועד לו. נשאל כמה שאלות על השגרה והמטרות שלך,
        ונגיד לך בכנות מה מתאים, גם אם זו התוכנית הקצרה. בלי התחייבות ובלי עלות.
      </p>
      <a
        href={BUSINESS.whatsappConsult}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTA('whatsapp_consult', 'pricing_footer')}
        className="inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 rounded-full
                   text-white font-bold text-[17px] bg-[var(--wa-green-ink)]
                   hover:opacity-95 active:opacity-90 transition-opacity"
      >
        <WhatsAppIcon className="w-5 h-5" />
        לייעוץ התאמה חינם
      </a>
      {BUSINESS.phone && (
        <p className="text-sm text-[var(--text-secondary)] mt-4">
          מעדיפה לדבר?{' '}
          <a
            href={`tel:${BUSINESS.phone.replace(/-/g, '')}`}
            onClick={() => trackCTA('phone_call', 'pricing_footer')}
            /* inline-block + vertical padding so the tap target clears 44px.
               WCAG exempts links inline in a sentence, but this is a tel: link
               on a page where 90% of visitors are holding a phone, and the
               exemption is about what is legal, not about what is tappable. */
            className="inline-block py-3 font-semibold text-[var(--brand-ink)] underline underline-offset-4"
          >
            {BUSINESS.phone}
          </a>
        </p>
      )}
    </div>
  );
}
