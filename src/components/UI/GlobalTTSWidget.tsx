import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ttsService, Language } from '../../utils/tts.service';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en',    label: 'English'  },
  { value: 'hi',    label: 'हिंदी'    },
  { value: 'hi-en', label: 'Hinglish' },
  { value: 'mr',    label: 'मराठी'   },
];

// Pages where the widget should appear
const TTS_ROUTES = ['/login', '/dashboard', '/ledger', '/profile', '/onboarding'];

export const GlobalTTSWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);
  const [language, setLanguage]   = useState<Language>('hi');
  const location  = useLocation();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Stop speech whenever the route changes
  useEffect(() => {
    ttsService.stop();
    setIsPlaying(false);
    setShowMenu(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const speakCurrentPage = (lang: Language) => {
    // Small delay so any pending React renders finish before we read the DOM
    setTimeout(() => {
      const text = ttsService.extractPageText();
      if (!text) return;
      ttsService.stop();
      setIsPlaying(true);
      ttsService.speak(text, lang, () => setIsPlaying(false));
    }, 100);
  };

  const handleFABClick = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      setShowMenu(prev => !prev);
    }
  };

  const handleLanguagePick = (lang: Language) => {
    setLanguage(lang);
    setShowMenu(false);
    speakCurrentPage(lang);
  };

  const visible = TTS_ROUTES.some(r => location.pathname.startsWith(r));
  if (!visible) return null;

  const currentLabel = LANGUAGES.find(l => l.value === language)?.label ?? 'हिंदी';

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Language picker dropdown */}
      {showMenu && (
        <div className="bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden w-44">
          <div className="px-3 py-2 bg-amber-50 border-b border-amber-100">
            <p className="text-xs font-semibold text-amber-800">🌐 भाषा चुनें / Select</p>
          </div>
          {LANGUAGES.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleLanguagePick(opt.value)}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                language === opt.value
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <span>{opt.label}</span>
              {language === opt.value && (
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* "Now reading" chip shown while playing */}
      {isPlaying && (
        <div className="bg-white rounded-full shadow border border-green-200 px-3 py-1 text-xs font-medium text-green-700 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {currentLabel}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleFABClick}
        title={isPlaying ? 'Stop reading' : 'Listen to this page'}
        aria-label={isPlaying ? 'Stop reading' : 'Read page aloud'}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
          isPlaying
            ? 'bg-green-600 text-white'
            : 'bg-white border-2 border-green-200 text-green-600 hover:border-green-400'
        }`}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            {[3, 5, 4, 6].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full"
                style={{
                  height: `${h * 14}%`,
                  animation: 'tts-bar 0.7s ease-in-out infinite alternate',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes tts-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};
