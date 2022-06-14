import { cloneElement, isValidElement, ReactNode } from 'react';

const hasChildren = (node: any) =>
  node && (node.children || (node.props && node.props.children));

const getChildren = (node: any) =>
  node && node.children ? node.children : node.props && node.props.children;

const renderNodes = (reactNodes: any): any => {
  if (typeof reactNodes === 'string') {
    return reactNodes;
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = isValidElement(child);

    if (typeof child === 'string') {
      return child;
    }
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return cloneElement(child, { ...child.props, key: i }, inner);
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce(
        (str, childKey) => `${str}${child[childKey]}`,
        ''
      );
    }

    return child;
  });
};

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

reactI18Next.Trans = ({ children }: { children: ReactNode }) =>
  Array.isArray(children) ? renderNodes(children) : renderNodes([children]);

module.exports = reactI18Next;

export default {};
