import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
 * Accessibility widget aligned with IS 5568 (WCAG 2.1 AA).
 *
 * CRITICAL LAYOUT NOTE — why this component portals itself:
 * A CSS `filter` on an ancestor makes that ancestor the containing block for
 * every `position: fixed` descendant. Applying the invert/contrast filters to
 * <body> therefore un-pinned every floating control (this widget included) and
 * dropped them to the bottom of an 18,000px page — leaving a user who enabled
 * invert with no way to switch it back off. Two defences:
 *   1. Filters are applied to #root, and this widget is portalled to <body> so
 *      it sits OUTSIDE the filtered subtree and stays reachable, always.
 *   2. Invert uses a blend-mode overlay instead of a filter, so no containing
 *      block is created and the other fixed controls keep working normally.
 */
export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULTS);
  const [portalNode, setPortalNode] = useState(null);
  const [overlayNode, setOverlayNode] = useState(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  /* Portal target: a direct child of <body>, i.e. a sibling of #root, so no
     filter applied to the page content can ever affect this widget. */
  useEffect(() => {
    const ensure = (id, before) => {
      let n = document.getElementById(id);
      if (!n) {
        n = document.createElement('div');
        n.id = id;
        document.body.appendChild(n);
      }
      return n;
    };
    // Overlay lives in its OWN body-level node. It must NOT sit inside
    // #a11y-root: that element has a z-index, which creates a stacking
    // context, and mix-blend-mode only blends against a backdrop inside the
    // same context — the overlay would have blended against nothing and
    // painted an opaque white sheet over the whole page.
    setOverlayNode(ensure('a11y-invert-root'));
    setPortalNode(ensure('a11y-root'));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch { /* storage blocked — fall back to defaults */ }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    /* Applied to #root (page content), never to <body>, so this widget —
       which lives outside #root — is never filtered or un-pinned. */
    const target = document.getElementById('root') || document.body;

    const classes = {
      'accessibility-bold': settings.boldText,
      'accessibility-high-contrast': settings.highContrast,
      'accessibility-highlight-links': settings.highlightLinks,
      'accessibility-readable-font': settings.readableFont,
      'accessibility-line-height': settings.lineHeight,
    };
    Object.entries(classes).forEach(([className, isActive]) => {
      target.classList.toggle(className, isActive);
    });

    // Cursor must cover the whole window, and carries no filter risk
    document.body.classList.toggle('accessibility-big-cursor', settings.bigCursor);

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
    const t = setTimeout(() => panelRef.current?.querySelector('button')?.focus(), 50);
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

  const widget = (
    <>
      <style>{`
        .accessibility-bold * { font-weight: bold !important; }
        .accessibility-high-contrast { filter: contrast(1.4); }
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

        /* Invert via blend mode, NOT filter: keeps position:fixed working */
        #a11y-invert-overlay {
          position: fixed;
          inset: 0;
          background: #fff;
          mix-blend-mode: difference;
          pointer-events: none;
          z-index: 9998;
        }
        /* Widget sits above the overlay, so its own colours stay true */
        #a11y-root { position: relative; z-index: 9999; }

        /* WCAG 2.4.7 Focus Visible */
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

      `}</style>

      <div className="fixed bottom-[72px] md:bottom-24 left-4">
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

            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl transition-all font-medium"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>איפוס הגדרות</span>
              </button>
            </div>

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

  return (
    <>
      {overlayNode && settings.invertColors
        ? createPortal(<div id="a11y-invert-overlay" aria-hidden="true" />, overlayNode)
        : null}
      {portalNode ? createPortal(widget, portalNode) : null}
    </>
  );
}
