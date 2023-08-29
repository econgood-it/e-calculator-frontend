import { createContext, ReactElement, useContext, useState } from 'react';
import { User } from '../authentication/User';

interface IUserContext {
  user: User | undefined;
  updateUser: (user: User) => void;
}
const UserContext = createContext<IUserContext | undefined>(undefined);

type UserProviderProps = {
  children: ReactElement;
};

function UserProvider({ children }: UserProviderProps) {
  const storageKey = 'user';
  const userString = window.localStorage.getItem(storageKey);

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );

  function updateUser(user: User) {
    setUser(user);
    window.localStorage.setItem(storageKey, JSON.stringify(user));
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be within UserProvider');
  }

  return context;
};
export { UserProvider };
