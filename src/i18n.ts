import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: 'en',
    detection: { caches: ['localStorage'] },
    debug: true,
  });

export default i18n;

export const useLanguage = (): string => {
  const { i18n } = useTranslation();
  return getLanguage(i18n);
};

export const getLanguage = (i18nInstance: typeof i18n): string => {
  return i18nInstance.language.split('-')[0];
};
