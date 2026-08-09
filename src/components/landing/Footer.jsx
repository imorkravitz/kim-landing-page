import React from 'react';
import { trackCTA } from '@/lib/analytics';
import { Instagram, MessageCircle, Phone, MapPin, Smartphone } from 'lucide-react';

// @ts-ignore
import Logo from '../../assets/icons/KIM - LOGO 2.png';


export default function Footer() {
  return (
    /* text-white here was inherited from a dark-footer design and made every
       unstyled child invisible against the cream. The footer sets a real text
       colour and each column opts out where it needs to. */
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] section-md">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12 max-w-5xl mx-auto text-right">
          {/* Logo & Description */}
          <div>
            <img
              src={Logo}
              alt="קים גפסון — תזונה מאפשרת"
              width="180"
              height="72"
              className="h-16 w-auto mb-5 object-contain object-right"
            />
            <p className="leading-relaxed">
              תזונה מאפשרת – הקליניקה של קים גפסון.
              ליווי מקצועי ואישי לאורח חיים בריא ומאוזן.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">קישורים מהירים</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://onelink.to/zter3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--brand-ink)] transition-colors flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  הורדת אפליקציית Liveat
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/kimgafson/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--brand-ink)] transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  אינסטגרם
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">יצירת קשר</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.link/ntdrz1"
              onClick={() => trackCTA('whatsapp_consult')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--brand-ink)] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  צ'אט חכם בווצאפ — זמין 24/7
                </a>
              </li>
              <li>
                <a
                  href="https://wa.link/r2etxn"
              onClick={() => trackCTA('whatsapp_support')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--brand-ink)] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  שירות לקוחות — מענה אנושי
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* border-gray-800 was a near-black rule on cream — another leftover of
            the dark-footer origin. The subtle token reads as a divider instead
            of a slab. The old gray-500 measured 4.36:1 on this ground, under AA. */}
        <div className="border-t border-[var(--border-default)] mt-10 pt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-x-3 gap-y-2 flex-wrap">
            <a href="/Accessibility" className="inline-block py-2 underline underline-offset-4 hover:text-[var(--brand-ink)] transition-colors">
              הצהרת נגישות
            </a>
            <span aria-hidden="true">·</span>
            <a href="/Privacy" className="inline-block py-2 underline underline-offset-4 hover:text-[var(--brand-ink)] transition-colors">
              מדיניות פרטיות
            </a>
          </p>
          <p className="mt-3">© {new Date().getFullYear()} KIM - Your Health My Mission. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}