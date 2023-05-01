import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useApi } from './ApiContext';
import { Workbook } from '../models/Workbook';
import { WorkbookResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/workbook.dto';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';

const WorkbookContext = createContext<Workbook | undefined>(undefined);

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
        const response = await api.get(`v1/workbook`);
        setWorkbook(WorkbookResponseBodySchema.parse(response.data));
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

export const useWorkbook = (): Workbook | undefined => {
  return useContext(WorkbookContext);
};
export { WorkbookProvider };
