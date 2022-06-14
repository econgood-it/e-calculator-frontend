import { createContext, ReactElement, useContext } from 'react';
import { BalanceSheetItem } from '../dataTransferObjects/BalanceSheet';

interface IBalanceSheetContext {
  activeBalanceSheet: BalanceSheetItem;
}

const BalanceSheetContext = createContext<IBalanceSheetContext | undefined>(
  undefined
);

type BalanceSheetContextProviderProps = {
  activeBalanceSheet: BalanceSheetItem;
  children: ReactElement;
};

function BalanceSheetProvider({
  activeBalanceSheet,
  children,
}: BalanceSheetContextProviderProps) {
  return (
    <BalanceSheetContext.Provider
      value={{
        activeBalanceSheet: activeBalanceSheet,
      }}
    >
      {children}
    </BalanceSheetContext.Provider>
  );
}

export const useBalanceSheetContext = () => {
  const context = useContext(BalanceSheetContext);
  if (context === undefined) {
    throw new Error(
      'useBalanceSheetContext must be within BalanceSheetProvider'
    );
  }
  return context;
};
export { BalanceSheetProvider };
