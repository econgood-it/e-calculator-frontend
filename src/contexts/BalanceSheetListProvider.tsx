import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApi } from './ApiProvider';
import {
  BalanceSheetCreateRequestBody,
  BalanceSheetItem,
} from '../models/BalanceSheet';
import { useOrganizations } from './OrganizationProvider';
import { useNavigate } from 'react-router-dom';

interface IBalanceSheetListContext {
  balanceSheetItems: BalanceSheetItem[];
  setBalanceSheetItems: Dispatch<SetStateAction<BalanceSheetItem[]>>;
  createBalanceSheet: (
    balanceSheet: BalanceSheetCreateRequestBody
  ) => Promise<void>;
  deleteBalanceSheet: (id: number) => Promise<void>;
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
  const navigate = useNavigate();
  const api = useApi();
  useEffect(() => {
    (async () => {
      if (activeOrganization) {
        setBalanceSheetItems(await api.getBalanceSheets(activeOrganization.id));
      }
    })();
  }, [activeOrganization]);

  async function createBalanceSheet(
    balanceSheet: BalanceSheetCreateRequestBody
  ) {
    const newBalanceSheet = await api.createBalanceSheet(
      balanceSheet,
      activeOrganization?.id
    );
    setBalanceSheetItems((prevState) =>
      prevState.concat({ id: newBalanceSheet.id! })
    );
    navigate(
      `/organization/${activeOrganization?.id}/balancesheet/${newBalanceSheet.id}/overview`
    );
  }
  async function deleteBalanceSheet(id: number) {
    await api.deleteBalanceSheet(id);
    setBalanceSheetItems((prevState) => prevState.filter((b) => b.id !== id));
    navigate(`/organization/${activeOrganization?.id}`);
  }

  return (
    <BalanceSheetListContext.Provider
      value={{
        balanceSheetItems,
        setBalanceSheetItems,
        createBalanceSheet,
        deleteBalanceSheet,
      }}
    >
      {children}
    </BalanceSheetListContext.Provider>
  );
}

export const useBalanceSheetItems = (): IBalanceSheetListContext => {
  const context = useContext(BalanceSheetListContext);
  if (context === undefined) {
    throw new Error(
      'useBalanceSheetListContext must be within BalanceSheetListProvider'
    );
  }
  return context;
};
export { BalanceSheetListProvider };
