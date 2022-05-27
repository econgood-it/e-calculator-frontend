import { createContext, ReactElement, useContext } from 'react';
import { User } from './User';

interface IUserContext {
  user: User;
}

const UserContext = createContext<IUserContext | undefined>(undefined);
type UserProviderProps = {
  user: User;
  children: ReactElement;
};

function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider
      value={{
        user: user,
      }}
    >
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
