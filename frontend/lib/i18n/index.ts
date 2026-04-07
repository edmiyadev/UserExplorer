import { es } from './es'
import { en } from './en'
import { useLanguage } from './context'

export type Locale = 'es' | 'en'

const translations = {
  es,
  en,
}

export function useTranslation() {
  const { locale } = useLanguage();
  return {
    t: translations[locale],
    locale,
  }
}

// Re-export for convenience
export { es, en }
export { LanguageProvider, useLanguage } from './context'
