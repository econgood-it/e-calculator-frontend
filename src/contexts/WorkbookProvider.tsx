import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useApi } from './ApiProvider';
import { IWorkbook, Workbook } from '../models/Workbook';
import { useTranslation } from 'react-i18next';

const WorkbookContext = createContext<IWorkbook | undefined>(undefined);

type WorkbookProviderProps = {
  children: ReactElement;
};

export default function WorkbookProvider({ children }: WorkbookProviderProps) {
  const api = useApi();
  const { t } = useTranslation();
  const [workbook, setWorkbook] = useState<Workbook | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        setWorkbook(new Workbook(await api.getWorkbook()));
      } catch (e) {
        console.log(t`Failed to load workbook`);
      }
    })();
  }, [api, t]);

  return (
    <WorkbookContext.Provider value={workbook}>
      {children}
    </WorkbookContext.Provider>
  );
}

export const useWorkbook = (): IWorkbook | undefined => {
  return useContext(WorkbookContext);
};
export { WorkbookProvider };
