import React, { useState, useEffect } from 'react';
import { X, RotateCcw, MousePointer2, Link2, ZoomIn, ZoomOut, Keyboard } from 'lucide-react';

const AccessibilityIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="4" r="2"/>
    <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>
  </svg>
);

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 100,
    boldText: false,
    highContrast: false,
    invertColors: false,
    highlightLinks: false,
    bigCursor: false,
    readableFont: false,
    lineHeight: false
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    const classes = {
      'accessibility-bold': settings.boldText,
      'accessibility-high-contrast': settings.highContrast,
      'accessibility-invert': settings.invertColors,
      'accessibility-highlight-links': settings.highlightLinks,
      'accessibility-big-cursor': settings.bigCursor,
      'accessibility-readable-font': settings.readableFont,
      'accessibility-line-height': settings.lineHeight
    };

    Object.entries(classes).forEach(([className, isActive]) => {
      if (isActive) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    });
  }, [settings]);

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      boldText: false,
      highContrast: false,
      invertColors: false,
      highlightLinks: false,
      bigCursor: false,
      readableFont: false,
      lineHeight: false
    });
  };

  const options = [
    { key: 'highContrast', label: 'ניגודיות גבוהה', icon: '◐' },
    { key: 'highlightLinks', label: 'הדגשת קישורים', icon: <Link2 className="w-5 h-5" /> },
    { key: 'bigCursor', label: 'סמן גדול', icon: <MousePointer2 className="w-5 h-5" /> },
    { key: 'readableFont', label: 'גופן קריא', icon: 'A' },
    { key: 'lineHeight', label: 'מרווח שורות', icon: '≡' },
    { key: 'boldText', label: 'הדגשת טקסט', icon: 'B' },
    { key: 'invertColors', label: 'היפוך צבעים', icon: '◑' },
  ];

  return (
    <>
      <style>{`
        .accessibility-bold * { font-weight: bold !important; }
        .accessibility-high-contrast { filter: contrast(1.4) !important; }
        .accessibility-invert { filter: invert(1) hue-rotate(180deg) !important; }
        .accessibility-invert img { filter: invert(1) hue-rotate(180deg) !important; }
        .accessibility-highlight-links a { 
          outline: 3px solid #0066cc !important; 
          background-color: #ffff00 !important;
          color: #000 !important;
        }
        .accessibility-big-cursor, .accessibility-big-cursor * { 
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M4 4l16 8-7 2-2 7z'/%3E%3C/svg%3E") 4 4, auto !important; 
        }
        .accessibility-readable-font * { 
          font-family: Arial, Helvetica, sans-serif !important; 
          letter-spacing: 0.05em !important;
        }
        .accessibility-line-height * { line-height: 2 !important; }
      `}</style>
      
      <div className="fixed bottom-32 md:bottom-24 left-4 z-50">
        {/* Main Button - Enable Style */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 border-4 border-white"
          aria-label="תפריט נגישות"
        >
          <AccessibilityIcon className="w-8 h-8 md:w-9 md:h-9 text-white" />
        </button>

        {isOpen && (
          <div className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl overflow-hidden w-80 md:w-96 border border-gray-200 animate-in slide-in-from-bottom-2" dir="rtl">
            {/* Header */}
            <div className="bg-[#1a73e8] text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AccessibilityIcon className="w-6 h-6" />
                <h3 className="font-bold text-lg">תפריט נגישות</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size Controls */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">גודל טקסט</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 80) }))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 hover:border-[#1a73e8] hover:bg-blue-50 flex items-center justify-center transition-all"
                    aria-label="הקטן טקסט"
                  >
                    <ZoomOut className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-bold w-14 text-center bg-white px-2 py-1 rounded border">{settings.fontSize}%</span>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 150) }))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 hover:border-[#1a73e8] hover:bg-blue-50 flex items-center justify-center transition-all"
                    aria-label="הגדל טקסט"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Options Grid */}
            <div className="p-3 grid grid-cols-3 gap-2">
              {options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSettings(prev => ({ ...prev, [option.key]: !prev[option.key] }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    settings[option.key] 
                      ? 'bg-[#1a73e8] border-[#1a73e8] text-white' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#1a73e8] hover:bg-blue-50'
                  }`}
                  aria-label={option.label}
                >
                  <span className="text-2xl mb-1">
                    {typeof option.icon === 'string' ? option.icon : option.icon}
                  </span>
                  <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                <span>איפוס הגדרות</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#1a73e8]/5 text-center">
              <span className="text-xs text-gray-500">נגישות מופעלת באמצעות Enable</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}