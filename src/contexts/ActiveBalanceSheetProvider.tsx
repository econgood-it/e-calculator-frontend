import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { useApi } from './ApiProvider';

import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';
import { BalanceSheet } from '../models/BalanceSheet';
import { CompanyFactsPatchRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { z } from 'zod';

type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;

interface IActiveBalanceSheetContext {
  balanceSheet?: BalanceSheet;
  updateCompanyFacts: (
    companyFacts: CompanyFactsPatchRequestBody
  ) => Promise<void>;
}

const ActiveBalanceSheetContext = createContext<
  IActiveBalanceSheetContext | undefined
>(undefined);

type ActiveBalanceSheetProviderProps = {
  children: ReactElement;
};

export default function ActiveBalanceSheetProvider({
  children,
}: ActiveBalanceSheetProviderProps) {
  const { t } = useTranslation();
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | undefined>();
  const { addSuccessAlert } = useAlert();

  const api = useApi();
  const { balanceSheetId } = useParams();

  const updateCompanyFacts = async (
    companyFacts: CompanyFactsPatchRequestBody
  ) => {
    const response = await api.updateBalanceSheet(Number(balanceSheetId), {
      companyFacts: companyFacts,
    });
    setBalanceSheet(response);
    addSuccessAlert(t`Modifications saved`);
  };

  useEffect(() => {
    (async () => {
      if (balanceSheetId) {
        setBalanceSheet(await api.getBalanceSheet(Number(balanceSheetId)));
      }
    })();
  }, [balanceSheetId, api]);

  return (
    <ActiveBalanceSheetContext.Provider
      value={{
        balanceSheet,
        updateCompanyFacts,
      }}
    >
      {children}
    </ActiveBalanceSheetContext.Provider>
  );
}

export const useActiveBalanceSheet = (): IActiveBalanceSheetContext => {
  const context = useContext(ActiveBalanceSheetContext);
  if (context === undefined) {
    throw new Error(
      'useActiveBalanceSheet must be within ActiveBalanceSheetProvider'
    );
  }
  return context;
};
export { ActiveBalanceSheetProvider };
