import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface Props {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-600 shadow-lg">
      <Globe size={18} className="text-blue-400" />
      <select 
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent border-none outline-none text-sm font-semibold cursor-pointer uppercase"
      >
        {Object.values(Language).map((lang) => (
          <option key={lang} value={lang} className="bg-slate-800 text-white">
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;