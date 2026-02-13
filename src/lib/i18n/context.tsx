"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, Locale } from "./translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <K extends keyof typeof translations>(
    category: K,
    key: keyof (typeof translations)[K],
  ) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = "drnoflu-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (savedLocale && ["fr", "en", "sw", "ln"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  const t = <K extends keyof typeof translations>(
    category: K,
    key: keyof (typeof translations)[K],
  ): string => {
    const categoryObj = translations[category];
    if (!categoryObj) return String(key);

    const translationObj = categoryObj[key] as
      | Record<Locale, string>
      | undefined;
    if (!translationObj) return String(key);

    return translationObj[locale] || translationObj.fr || String(key);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "fr", setLocale, t }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, setLocale } = useLocale();
  return { t, locale, setLocale };
}
