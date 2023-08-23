import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApi } from './ApiContext';
import { BalanceSheetItem } from '../models/BalanceSheet';
import { useOrganizations } from './OrganizationContext';

interface IBalanceSheetListContext {
  balanceSheetItems: BalanceSheetItem[];
  setBalanceSheetItems: Dispatch<SetStateAction<BalanceSheetItem[]>>;
}

const BalanceSheetListContext = createContext<
  IBalanceSheetListContext | undefined
>(undefined);

type BalanceSheetListProviderProps = {
  children: ReactElement;
};
function BalanceSheetListProvider({ children }: BalanceSheetListProviderProps) {
  const [balanceSheetItems, setBalanceSheetItems] = useState<
    BalanceSheetItem[]
  >([]);
  const { activeOrganization } = useOrganizations();
  const api = useApi();
  useEffect(() => {
    (async () => {
      if (activeOrganization) {
        setBalanceSheetItems(await api.getBalanceSheets(activeOrganization.id));
      }
    })();
  }, [activeOrganization]);

  return (
    <BalanceSheetListContext.Provider
      value={{
        balanceSheetItems,
        setBalanceSheetItems,
      }}
    >
      {children}
    </BalanceSheetListContext.Provider>
  );
}

export const useBalanceSheetItems = (): [
  BalanceSheetItem[],
  Dispatch<SetStateAction<BalanceSheetItem[]>>
] => {
  const context = useContext(BalanceSheetListContext);
  if (context === undefined) {
    throw new Error(
      'useBalanceSheetListContext must be within BalanceSheetListProvider'
    );
  }
  return [context.balanceSheetItems, context.setBalanceSheetItems];
};
export { BalanceSheetListProvider };
