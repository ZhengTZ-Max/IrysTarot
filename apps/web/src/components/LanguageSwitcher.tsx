'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          language === 'zh'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-white/20 text-cyan-200 hover:bg-white/30'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-white/20 text-cyan-200 hover:bg-white/30'
        }`}
      >
        EN
      </button>
    </div>
  );
}
