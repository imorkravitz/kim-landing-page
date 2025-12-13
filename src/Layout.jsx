import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen" dir="rtl">
      {children}
    </div>
  );
}