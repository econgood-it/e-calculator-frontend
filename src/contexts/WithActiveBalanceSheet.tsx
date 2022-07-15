import { useEffect, useReducer } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import {
  BalanceSheet,
  BalanceSheetResponseSchema,
} from '../dataTransferObjects/BalanceSheet';
import { useApi } from './ApiContext';

import { Rating } from '../dataTransferObjects/Rating';

type ContextType = {
  balanceSheet?: BalanceSheet;
  updateRating: (rating: Rating) => void;
};

enum Kind {
  SetBalanceSheet,
  UpdateRating,
}

type Action =
  | {
      type: Kind.UpdateRating;
      rating: Rating;
    }
  | { type: Kind.SetBalanceSheet; balanceSheet: BalanceSheet };

const reducer = (
  balanceSheet: BalanceSheet | undefined,
  action: Action
): BalanceSheet | undefined => {
  if (action.type === Kind.UpdateRating) {
    return (
      balanceSheet && {
        ...balanceSheet,
        ratings: balanceSheet.ratings.map((r) => {
          return r.shortName === action.rating.shortName ? action.rating : r;
        }),
      }
    );
  }
  if (action.type === Kind.SetBalanceSheet) {
    return { ...action.balanceSheet };
  }
  return balanceSheet;
};

export default function WithActiveBalanceSheet() {
  const [balanceSheet, dispatch] = useReducer(reducer, undefined);

  const api = useApi();
  const { balanceSheetId } = useParams();

  const updateRating = async (rating: Rating) => {
    dispatch({ type: Kind.UpdateRating, rating: rating });
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(`v1/balancesheets/${balanceSheetId}`);
      dispatch({
        type: Kind.SetBalanceSheet,
        balanceSheet: BalanceSheetResponseSchema.parse(response.data),
      });
    })();
  }, [balanceSheetId]);

  return (
    <div>
      <Outlet context={{ balanceSheet, updateRating }} />
    </div>
  );
}

export function useActiveBalanceSheet() {
  return useOutletContext<ContextType>();
}
