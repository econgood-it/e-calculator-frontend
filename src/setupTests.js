import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cloneElement, isValidElement } from 'react';

expect.extend(matchers);

const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock react-i18next

const hasChildren = (node) =>
  node && (node.children || (node.props && node.props.children));

const getChildren = (node) =>
  node && node.children ? node.children : node.props && node.props.children;

const renderNodes = (reactNodes) => {
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

vi.mock('react-i18next', () => ({
  ...vi.importActual('react-i18next'),
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        language: 'en',
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) =>
    Array.isArray(children) ? renderNodes(children) : renderNodes([children]),
}));
