import LanguageDetector from 'i18next-browser-languagedetector';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n.use(initReactI18next).use(LanguageDetector).use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
});

export default i18n;
