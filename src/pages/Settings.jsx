import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Sparkles, Volume2, Eye, Shield, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { useAtmosphere } from '../context/AtmosphereContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { WORLD_LANGUAGES } from '../data/languages';
import { POETRY_STYLES, LENGTHS } from '../data/options';

export default function Settings() {
  const {
    themeMode, setThemeMode,
    atmosphereMode, toggleAtmosphereMode,
    reducedMotion, setReducedMotion
  } = useAtmosphere();
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [defaultLang, setDefaultLang] = useState(() => localStorage.getItem('poetica_default_lang') || 'English');
  const [defaultStyle, setDefaultStyle] = useState(() => localStorage.getItem('poetica_default_style') || 'Free Verse');
  const [defaultLength, setDefaultLength] = useState(() => localStorage.getItem('poetica_default_length') || 'Medium');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => localStorage.getItem('poetica_autosave_setting') !== 'false');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('poetica_default_lang', defaultLang);
    localStorage.setItem('poetica_default_style', defaultStyle);
    localStorage.setItem('poetica_default_length', defaultLength);
    localStorage.setItem('poetica_autosave_setting', String(autoSaveEnabled));
    toast.success('Sanctuary preferences saved');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-[#854479] dark:text-[#EBD8EE]" />
            <span>Sanctuary Settings</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#4D3652] dark:text-[#E2CFE6]">
            Personalize your poetry environment, visual ambience, default rhythms, and privacy.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Aesthetic & Theme Section */}
          <div className="p-6 sm:p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#854479] dark:text-[#EBD8EE]" />
              <span>Appearance & Atmosphere</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Theme Mode
                </label>
                <select
                  value={themeMode}
                  onChange={(e) => setThemeMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  <option value="light">Dreamy Light Pastel</option>
                  <option value="dark">Nocturnal Velvet Dark</option>
                  <option value="auto">Auto (System Preference)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Atmosphere Environment
                </label>
                <select
                  value={atmosphereMode}
                  onChange={(e) => toggleAtmosphereMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  <option value="auto">Auto (Derive from Poem)</option>
                  <option value="manual">Manual Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Animations
                </label>
                <select
                  value={reducedMotion ? 'reduced' : 'full'}
                  onChange={(e) => setReducedMotion(e.target.value === 'reduced')}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  <option value="full">Full Atmospheric Motion</option>
                  <option value="reduced">Reduced Motion (Calm Stillness)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Poetry Studio Defaults */}
          <div className="p-6 sm:p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#854479] dark:text-[#EBD8EE]" />
              <span>Poetry Creation Defaults</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Default Poetry Language
                </label>
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  {WORLD_LANGUAGES.map(l => (
                    <option key={l.code} value={l.name}>{l.name} ({l.nativeName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Default Style
                </label>
                <select
                  value={defaultStyle}
                  onChange={(e) => setDefaultStyle(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  {POETRY_STYLES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                  Default Poem Length
                </label>
                <select
                  value={defaultLength}
                  onChange={(e) => setDefaultLength(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
                >
                  {LENGTHS.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#35233F] dark:text-[#FDFBF7]">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded text-[#854479] focus:ring-[#854479]"
                />
                <span>Automatically save unfinished poem drafts to local device</span>
              </label>
            </div>
          </div>

          {/* Privacy & Author Presence */}
          <div className="p-6 sm:p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-lg space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#854479] dark:text-[#EBD8EE]" />
              <span>Privacy & Security</span>
            </h2>

            <p className="text-xs sm:text-sm font-medium text-[#3E2745] dark:text-[#F5EEF7] leading-relaxed">
              POETICA never uses private poems to train public models. API keys are kept safely isolated on the backend server.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-bold shadow-md hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
