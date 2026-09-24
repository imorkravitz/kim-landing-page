import React from 'react';
import { useLocation } from 'react-router-dom';
import CookieConsent from '@/components/CookieConsent';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen" dir="rtl">
      {children}
      {/* Lives in the layout, not on one page: consent has to be asked
          wherever the visitor lands, and Instagram links land everywhere. */}
      <CookieConsent />
    </div>
  );
}