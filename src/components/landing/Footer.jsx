import React from 'react';
import { trackCTA } from '@/lib/analytics';
import { Instagram, MessageCircle, Phone, MapPin, Smartphone } from 'lucide-react';

// @ts-ignore
import Logo from '../../assets/icons/KIM - LOGO 2.png';


export default function Footer() {
  return (
    <footer className="bg-[#f7f4e9] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl text-right">
          {/* Logo & Description */}
          <div>
            <img 
              src={Logo}
              alt="KIM Logo"
              className="h-90 mb-8"
            />
            <p className="text-gray-400 leading-relaxed">
              תזונה מאפשרת – הקליניקה של קים גפסון. 
              ליווי מקצועי ואישי לאורח חיים בריא ומאוזן.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-800">קישורים מהירים</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a 
                  href="https://onelink.to/zter3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  הורדת אפליקציית Liveat
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/kimgafson/profilecard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  אינסטגרם
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-800">יצירת קשר</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="https://wa.link/ntdrz1"
              onClick={() => trackCTA('whatsapp_consult')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
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
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  שירות לקוחות — מענה אנושי
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} KIM - Your Health My Mission. כל הזכויות שמורות.</p>
          <p className="mt-2">
            <a href="/Accessibility" className="underline underline-offset-4 hover:text-gray-300 transition-colors">
              הצהרת נגישות
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}