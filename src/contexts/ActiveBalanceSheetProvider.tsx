import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import {
  BalanceSheet,
  BalanceSheetResponseSchema,
} from '../dataTransferObjects/BalanceSheet';
import { useApi } from './ApiContext';

import { Rating } from '../dataTransferObjects/Rating';
import { useAlert } from './AlertContext';
import { useTranslation } from 'react-i18next';
import { CompanyFactsRequestBody } from '../dataTransferObjects/CompanyFacts';

interface IActiveBalanceSheetContext {
  balanceSheet?: BalanceSheet;
  updateRating: (rating: Rating) => Promise<void>;
  updateRatings: (ratings: Rating[]) => Promise<void>;
  updateCompanyFacts: (companyFacts: CompanyFactsRequestBody) => Promise<void>;
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
    setBalanceSheet(BalanceSheetResponseSchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  const updateRatings = async (ratings: Rating[]) => {
    const response = await api.patch(`v1/balancesheets/${balanceSheetId}`, {
      ratings: ratings.map((r) => ({
        shortName: r.shortName,
        estimations: r.estimations,
      })),
    });
    setBalanceSheet(BalanceSheetResponseSchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  const updateCompanyFacts = async (companyFacts: CompanyFactsRequestBody) => {
    const response = await api.patch(`v1/balancesheets/${balanceSheetId}`, {
      companyFacts: companyFacts,
    });
    setBalanceSheet(BalanceSheetResponseSchema.parse(response.data));
    addSuccessAlert(t`Modifications saved`);
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets/${balanceSheetId}`);
      setBalanceSheet(BalanceSheetResponseSchema.parse(response.data));
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
