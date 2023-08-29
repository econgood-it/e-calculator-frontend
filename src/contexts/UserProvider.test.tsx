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
  beforeEach(() => {
    spyGetItem = jest.spyOn(window.localStorage, 'getItem');
    spySetItem = jest.spyOn(window.localStorage, 'setItem');
  });

  function Wrapper({ children }: { children: ReactElement }) {
    return <UserProvider>{children}</UserProvider>;
  }

  it('returns user from local storage', async () => {
    window.localStorage.setItem('user', JSON.stringify(UserMocks.default()));
    const { result } = renderHookWithTheme(() => useUser(), {
      wrapper: Wrapper,
    });
    expect(spyGetItem).toHaveBeenCalledWith('user');

    expect(result.current.user).toEqual(UserMocks.default());
  });

  it('updates user if setUser is called', async () => {
    const { result } = renderHookWithTheme(() => useUser(), {
      wrapper: Wrapper,
    });
    expect(result.current.user).toEqual(undefined);
    act(() => result.current.updateUser(UserMocks.default()));
    expect(spySetItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(UserMocks.default())
    );
    await waitFor(() =>
      expect(result.current.user).toEqual(UserMocks.default())
    );
  });
});
