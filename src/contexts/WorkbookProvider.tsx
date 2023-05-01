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

const WorkbookContext = createContext<Workbook | undefined>(undefined);

type WorkbookProviderProps = {
  children: ReactElement;
};

export default function WorkbookProvider({ children }: WorkbookProviderProps) {
  const api = useApi();
  const [workbook, setWorkbook] = useState<Workbook | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/workbook`);
      setWorkbook(WorkbookResponseBodySchema.parse(response.data));
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
