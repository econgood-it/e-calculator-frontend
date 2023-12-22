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
import { Rating } from '../models/Rating';
import { BalanceSheet } from '../models/BalanceSheet';
import { CompanyFactsPatchRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { z } from 'zod';

type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;

interface IActiveBalanceSheetContext {
  balanceSheet?: BalanceSheet;
  updateRatings: (ratings: Rating[]) => Promise<void>;
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

  const updateRatings = async (ratings: Rating[]) => {
    const response = await api.updateBalanceSheet(Number(balanceSheetId), {
      ratings: ratings.map((r) => ({
        shortName: r.shortName,
        estimations: r.estimations,
        weight: r.isWeightSelectedByUser ? r.weight : undefined,
      })),
    });
    setBalanceSheet(response);
    addSuccessAlert(t`Modifications saved`);
  };

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
  }, [balanceSheetId]);

  return (
    <ActiveBalanceSheetContext.Provider
      value={{
        balanceSheet,
        updateRatings,
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
