import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, MousePointer2, Link2, ZoomIn, ZoomOut, FileText } from 'lucide-react';

const AccessibilityIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="4" r="2"/>
    <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>
  </svg>
);

const DEFAULTS = {
  fontSize: 100,
  boldText: false,
  highContrast: false,
  invertColors: false,
  highlightLinks: false,
  bigCursor: false,
  readableFont: false,
  lineHeight: false,
};

const STORAGE_KEY = 'a11y-settings';

/**
 * Accessibility widget aligned with IS 5568 (Israeli standard, based on
 * WCAG 2.1 AA) and the service-accessibility regulations (2013).
 *
 * Compliance-relevant behaviour:
 *  • Settings persist across pages and sessions (localStorage)
 *  • Full keyboard operation: Escape closes, focus moves into the panel on
 *    open and returns to the trigger on close, focus is trapped while open
 *  • State is announced: aria-expanded on the trigger, aria-pressed on each
 *    toggle, role="dialog" + aria-modal on the panel
 *  • Direct link to the accessibility statement, as the regulations require
 */
export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULTS);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  /* Restore saved preferences — required so a user doesn't reconfigure
     accessibility on every visit */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch { /* storage blocked — fall back to defaults */ }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    const classes = {
      'accessibility-bold': settings.boldText,
      'accessibility-high-contrast': settings.highContrast,
      'accessibility-invert': settings.invertColors,
      'accessibility-highlight-links': settings.highlightLinks,
      'accessibility-big-cursor': settings.bigCursor,
      'accessibility-readable-font': settings.readableFont,
      'accessibility-line-height': settings.lineHeight,
    };

    Object.entries(classes).forEach(([className, isActive]) => {
      document.body.classList.toggle(className, isActive);
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch { /* storage blocked — settings still apply for this session */ }
  }, [settings]);

  /* Escape to close + focus trap while the panel is open */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Move focus into the panel so keyboard users land where they opened
    const t = setTimeout(() => {
      panelRef.current?.querySelector('button')?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(t);
    };
  }, [isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const resetSettings = () => setSettings(DEFAULTS);

  const options = [
    { key: 'highContrast',   label: 'ניגודיות גבוהה',  icon: '◐' },
    { key: 'highlightLinks', label: 'הדגשת קישורים',   icon: <Link2 className="w-5 h-5" aria-hidden="true" /> },
    { key: 'bigCursor',      label: 'סמן גדול',        icon: <MousePointer2 className="w-5 h-5" aria-hidden="true" /> },
    { key: 'readableFont',   label: 'גופן קריא',       icon: 'A' },
    { key: 'lineHeight',     label: 'מרווח שורות',     icon: '≡' },
    { key: 'boldText',       label: 'הדגשת טקסט',      icon: 'B' },
    { key: 'invertColors',   label: 'היפוך צבעים',     icon: '◑' },
  ];

  return (
    <>
      <style>{`
        .accessibility-bold * { font-weight: bold !important; }
        .accessibility-high-contrast { filter: contrast(1.4) !important; }
        .accessibility-invert { filter: invert(1) hue-rotate(180deg) !important; }
        .accessibility-invert img, .accessibility-invert video { filter: invert(1) hue-rotate(180deg) !important; }
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

        /* WCAG 2.4.7 Focus Visible — a clearly visible focus ring everywhere.
           Removing focus outlines is one of the most-cited accessibility faults. */
        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible,
        [tabindex]:focus-visible {
          outline: 3px solid #1a73e8 !important;
          outline-offset: 2px !important;
          border-radius: 2px;
        }

        /* WCAG 2.4.1 Bypass Blocks — skip link, visible only on keyboard focus */
        .skip-to-content {
          position: absolute;
          right: 1rem;
          top: -100px;
          z-index: 9999;
          background: #1a73e8;
          color: #fff;
          padding: 0.75rem 1.25rem;
          border-radius: 0 0 0.5rem 0.5rem;
          font-weight: 700;
          transition: top 0.15s ease-in-out;
        }
        .skip-to-content:focus { top: 0; }
      `}</style>

      {/* Skip link — first focusable element on the page */}
      <a href="#main-content" className="skip-to-content">
        דילוג לתוכן הראשי
      </a>

      <div className="fixed bottom-[72px] md:bottom-24 left-4 z-50">
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 border-4 border-white"
          aria-label="תפריט נגישות"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <AccessibilityIcon className="w-8 h-8 md:w-9 md:h-9 text-white" />
        </button>

        {isOpen && (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
            className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl overflow-hidden w-80 md:w-96 border border-gray-200 animate-in slide-in-from-bottom-2"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-[#1a73e8] text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AccessibilityIcon className="w-6 h-6" />
                <h3 id="a11y-title" className="font-bold text-lg">תפריט נגישות</h3>
              </div>
              <button
                onClick={closePanel}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                aria-label="סגירת תפריט הנגישות"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Font size */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium" id="a11y-fontsize-label">גודל טקסט</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 80) }))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 hover:border-[#1a73e8] hover:bg-blue-50 flex items-center justify-center transition-all"
                    aria-label="הקטנת גודל הטקסט"
                  >
                    <ZoomOut className="w-5 h-5 text-gray-600" aria-hidden="true" />
                  </button>
                  <span
                    className="text-sm font-bold w-14 text-center bg-white px-2 py-1 rounded border"
                    role="status"
                    aria-live="polite"
                    aria-labelledby="a11y-fontsize-label"
                  >
                    {settings.fontSize}%
                  </span>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 150) }))}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 hover:border-[#1a73e8] hover:bg-blue-50 flex items-center justify-center transition-all"
                    aria-label="הגדלת גודל הטקסט"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-600" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Toggles */}
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
                  aria-pressed={settings[option.key]}
                >
                  <span className="text-2xl mb-1" aria-hidden="true">{option.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Reset */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all font-medium"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>איפוס הגדרות</span>
              </button>
            </div>

            {/* Accessibility statement — required to be reachable */}
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <a
                href="/Accessibility"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline underline-offset-4 py-2"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                הצהרת הנגישות של האתר
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
