import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

const resources = {
  de: {
    translation: {
      'Balance sheet {{id}}': 'Bilanz {{id}}',
      'Company Facts': 'Fakten zum Unternehmen',
      Ratings: 'Selbsteinschätzung',
      Suppliers: 'Lieferanten',
      'Financial service providers': 'Finanzdienstleister',
      Employees: 'Mitarbeiter*innen',
      'Customers and other companies': 'Kunden und andere Firmen',
      'Social environment': 'Gesellschaft',
      Delete: 'Löschen',
      'Total purchases from suppliers': 'Gesamt-Ausgaben an Lieferanten',
      'Enter the 5 most important industry sectors whose products or services you use':
        'Geben Sie die 5 wichtigsten Wirtschaftszweige an, deren Produkte oder Dienstleistungen Sie nutzen.',
      Costs: 'Kosten',
      Save: 'Speichern',
      Edit: 'Bearbeiten',
      'Modifications saved': 'Änderungen gespeichert',
      'Balance sheet': 'Bilanz',
      'Login failed': 'Login fehlgeschlagen',
      'ECG Calculator': 'GWÖ Rechner',
      'Create balance sheet': 'Bilanz erstellen',
      'Number expected': 'Zahl erwartet',
      'Number should be positive': 'Zahl sollte positiv sein',
      'Choose a region': 'Wählen Sie eine Region',
      'Add supplier': 'Lieferant hinzufügen',
    },
  },
  en: {
    translation: {
      'Balance sheet {{id}}': 'Balance sheet {{id}}',
      'Company Facts': 'Company Facts',
      Ratings: 'Ratings',
      Suppliers: 'Suppliers',
      'Financial service providers': 'Financial service providers',
      Employees: 'Employees',
      'Customers and other companies': 'Customers and other companies',
      'Social environment': 'Social environment',
      Delete: 'Delete',
      'Total purchases from suppliers': 'Total purchases from suppliers',
      'Enter the 5 most important industry sectors whose products or services you use':
        'Enter the 5 most important industry sectors whose products or services you use.',
      Costs: 'Costs',
      Save: 'Save',
      Edit: 'Edit',
      'Modifications saved': 'Modifications saved',
      'Balance sheet': 'Balance sheet',
      'Login failed': 'Login failed',
      'ECG Calculator': 'ECG Calculator',
      'Create balance sheet': 'Create balance sheet',
      'Number expected': 'Number expected',
      'Number should be positive': 'Number should be positive',
      'Choose a region': 'Choose a region',
      'Add supplier': 'Add supplier',
    },
  },
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
  return getLanguage(i18n);
};

export const getLanguage = (i18nInstance: typeof i18n): string => {
  return i18nInstance.language.split('-')[0];
};
