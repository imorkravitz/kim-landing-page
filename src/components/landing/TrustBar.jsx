import React from 'react';
import { FlaskConical, Stethoscope, Smartphone, GraduationCap } from 'lucide-react';

const BRAND = '#8B7F4B';

const items = [
  { Icon: FlaskConical,  label: 'שיטה מבוססת מחקרים' },
  { Icon: Stethoscope,   label: 'צוות דיאטניות קליניות' },
  { Icon: Smartphone,    label: 'אפליקציה תומכת + מערכות AI' },
  { Icon: GraduationCap, label: 'בהובלת וניהול מלא של קים' },
];

/**
 * Horizontal credibility strip shown right after the hero story.
 * Communicates the professional differentiators in one glance,
 * before the visitor reaches problem/solution and pricing.
 */
export default function TrustBar() {
  return (
    <section
      dir="rtl"
      aria-label="למה לסמוך עלינו"
      className="py-6 md:py-8"
      style={{
        background: `${BRAND}0A`,
        borderTop: `1px solid ${BRAND}1A`,
        borderBottom: `1px solid ${BRAND}1A`,
      }}
    >
      <div className="container mx-auto px-6">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 list-none m-0 p-0">
          {items.map(({ Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2.5 text-center"
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${BRAND}14` }}
              >
                <Icon className="w-4 h-4" style={{ color: BRAND }} />
              </span>
              <span className="text-sm md:text-base font-semibold text-gray-800 leading-snug">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
