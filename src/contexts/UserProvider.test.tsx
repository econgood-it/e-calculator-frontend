import { renderHookWithTheme } from '../testUtils/rendering';
import '@testing-library/jest-dom';
import { ReactElement } from 'react';
import { UserMocks } from '../testUtils/user';
import { UserProvider, useUser } from './UserProvider';
import { act, waitFor } from '@testing-library/react';

jest.mock('../contexts/ApiProvider');

describe('UserProvider', () => {
  let spyGetItem: jest.SpyInstance;
  let spySetItem: jest.SpyInstance;
  let spyRemoveItem: jest.SpyInstance;
  beforeEach(() => {
    spyGetItem = jest.spyOn(window.localStorage, 'getItem');
    spySetItem = jest.spyOn(window.localStorage, 'setItem');
    spyRemoveItem = jest.spyOn(window.localStorage, 'removeItem');
    window.localStorage.clear();
  });

  function Wrapper({ children }: { children: ReactElement }) {
    return <UserProvider>{children}</UserProvider>;
  }

  it('returns user from local storage', async () => {
    window.localStorage.setItem('user', JSON.stringify(UserMocks.defaultOld()));
    const { result } = renderHookWithTheme(() => useUser(), {
      wrapper: Wrapper,
    });
    expect(spyGetItem).toHaveBeenCalledWith('user');

    expect(result.current.user).toEqual(UserMocks.defaultOld());
  });

  it('updates user if setUser is called', async () => {
    const { result } = renderHookWithTheme(() => useUser(), {
      wrapper: Wrapper,
    });
    expect(result.current.user).toEqual(undefined);
    act(() => result.current.updateUser(UserMocks.defaultOld()));
    expect(spySetItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(UserMocks.defaultOld())
    );
    await waitFor(() =>
      expect(result.current.user).toEqual(UserMocks.defaultOld())
    );
  });

  it('remove user from local storage on logout', async () => {
    window.localStorage.setItem('user', JSON.stringify(UserMocks.defaultOld()));
    const { result } = renderHookWithTheme(() => useUser(), {
      wrapper: Wrapper,
    });
    expect(spyGetItem).toHaveBeenCalledWith('user');

    act(() => {
      result.current.logout();
    });
    expect(spyRemoveItem).toHaveBeenCalledWith('user');
    expect(result.current.user).toEqual(undefined);
  });
});
