import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { DE_TRANSLATIONS } from './translations/de';
import { EN_TRANSLATIONS } from './translations/en';

const resources = {
  de: { translation: DE_TRANSLATIONS },
  en: { translation: EN_TRANSLATIONS },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    detection: { caches: ['localStorage'] },
    debug: false,
  });

export default i18n;

export const useLanguage = (): string => {
  const { i18n } = useTranslation();
  return identifyLanguage(i18n);
};

const identifyLanguage = (i18nInstance: typeof i18n): string => {
  return i18nInstance.language.split('-')[0];
};
