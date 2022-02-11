import { ReactNode } from 'react';

const reactI18Next: any = jest.createMockFromModule('react-i18next');

reactI18Next.useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

reactI18Next.initReactI18next = { type: '3rdParty', init: jest.fn() };
reactI18Next.Trans = ({ children }: { children: ReactNode }) => children;

module.exports = reactI18Next;

export default {};
