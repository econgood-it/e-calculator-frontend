import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BalanceSheetItem } from '../dataTransferObjects/BalanceSheet';
import { useApi } from './ApiContext';

interface IBalanceSheetContext {
  balanceSheetItems: BalanceSheetItem[];
  setBalanceSheetItems: Dispatch<SetStateAction<BalanceSheetItem[]>>;
}

const BalanceSheetContext = createContext<IBalanceSheetContext | undefined>(
  undefined
);

type BalanceSheetContextProviderProps = {
  children: ReactElement;
};

function BalanceSheetProvider({ children }: BalanceSheetContextProviderProps) {
  const [balanceSheetItems, setBalanceSheetItems] = useState<
    BalanceSheetItem[]
  >([]);
  const api = useApi();
  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets`);
      setBalanceSheetItems(response.data);
    })();
  }, []);

  return (
    <BalanceSheetContext.Provider
      value={{
        balanceSheetItems,
        setBalanceSheetItems,
      }}
    >
      {children}
    </BalanceSheetContext.Provider>
  );
}

export const useBalanceSheetItems = (): [
  BalanceSheetItem[],
  Dispatch<SetStateAction<BalanceSheetItem[]>>
] => {
  const context = useContext(BalanceSheetContext);
  if (context === undefined) {
    throw new Error(
      'useBalanceSheetContext must be within BalanceSheetProvider'
    );
  }
  return [context.balanceSheetItems, context.setBalanceSheetItems];
};
export { BalanceSheetProvider };
