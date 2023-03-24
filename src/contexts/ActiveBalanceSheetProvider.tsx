import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { useApi } from './ApiContext';

import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';
import { Rating } from '../models/Rating';
import { BalanceSheet } from '../models/BalanceSheet';
import { BalanceSheetResponseBodySchema } from '@ecogood/e-calculator-schemas/dist/balance.sheet.dto';
import { CompanyFactsPatchRequestBodySchema } from '@ecogood/e-calculator-schemas/dist/company.facts.dto';
import { z } from 'zod';

type CompanyFactsPatchRequestBody = z.infer<
  typeof CompanyFactsPatchRequestBodySchema
>;

interface IActiveBalanceSheetContext {
  balanceSheet?: BalanceSheet;
  updateRating: (rating: Rating) => Promise<void>;
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

  const updateRating = async (rating: Rating) => {
    const response = await api.patch(`v1/balancesheets/${balanceSheetId}`, {
      ratings: [
        { shortName: rating.shortName, estimations: rating.estimations },
      ],
    });
    setBalanceSheet(BalanceSheetResponseBodySchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  const updateRatings = async (ratings: Rating[]) => {
    const response = await api.patch(`v1/balancesheets/${balanceSheetId}`, {
      ratings: ratings.map((r) => ({
        shortName: r.shortName,
        estimations: r.estimations,
      })),
    });
    setBalanceSheet(BalanceSheetResponseBodySchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  const updateCompanyFacts = async (
    companyFacts: CompanyFactsPatchRequestBody
  ) => {
    const response = await api.patch(`v1/balancesheets/${balanceSheetId}`, {
      companyFacts: companyFacts,
    });
    setBalanceSheet(BalanceSheetResponseBodySchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets/${balanceSheetId}`);
      setBalanceSheet(BalanceSheetResponseBodySchema.parse(response.data));
    })();
  }, [balanceSheetId]);

  return (
    <ActiveBalanceSheetContext.Provider
      value={{
        balanceSheet,
        updateRating,
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
