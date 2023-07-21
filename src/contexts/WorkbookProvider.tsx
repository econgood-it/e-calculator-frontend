import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useApi } from './ApiContext';
import { IWorkbook, Workbook } from '../models/Workbook';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';

const WorkbookContext = createContext<IWorkbook | undefined>(undefined);

type WorkbookProviderProps = {
  children: ReactElement;
};

export default function WorkbookProvider({ children }: WorkbookProviderProps) {
  const api = useApi();
  const { t } = useTranslation();
  const { addErrorAlert } = useAlert();
  const [workbook, setWorkbook] = useState<Workbook | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        setWorkbook(new Workbook(await api.getWorkbook()));
      } catch (e) {
        addErrorAlert(t`Failed to load workbook`);
      }
    })();
  }, [api]);

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
