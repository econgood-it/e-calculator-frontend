import { createContext, ReactElement, useContext } from 'react';
import { BalanceSheet } from '../dataTransferObjects/BalanceSheet';

interface IBalanceSheetContext {
  activeBalanceSheet: BalanceSheet;
}

const BalanceSheetContext = createContext<IBalanceSheetContext | undefined>(
  undefined
);

type BalanceSheetContextProviderProps = {
  activeBalanceSheet: BalanceSheet;
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
