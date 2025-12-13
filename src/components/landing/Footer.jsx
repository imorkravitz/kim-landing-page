import React from 'react';
import { Instagram, MessageCircle, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-right">
          {/* Logo & Description */}
          <div>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_691cc3bcb50ab4a43494e846/515c2fe4e_KIM-LOGO2.png"
              alt="KIM Logo"
              className="h-96 mb-8 brightness-0 invert"
            />
            <p className="text-gray-400 leading-relaxed">
              תזונה מאפשרת – הקליניקה של קים גפסון. 
              ליווי מקצועי ואישי לאורח חיים בריא ומאוזן.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">קישורים מהירים</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a 
                  href="https://onelink.to/zter3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
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
              <li>
                <a 
                  href="https://wa.link/ntdrz1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  מענה אוטומטי 24/7
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.link/r2etxn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  שירות לקוחות
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">יצירת קשר</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>ילדי טהרן 5, ראשון לציון - הולמס פלייס</span>
              </li>
              <li>
                <a 
                  href="https://wa.link/r2etxn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  שירות לקוחות בוואטסאפ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} KIM - Your Health My Mission. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}