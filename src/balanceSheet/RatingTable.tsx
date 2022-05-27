import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PositiveRating from './PositiveRating';
import NegativeRating from './NegativeRating';
import { Rating } from '../dataTransferObjects/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { Trans, useTranslation } from 'react-i18next';
import { useApi } from '../api/ApiContext';

type RatingTableProps = {
  ratings: Rating[];
  onRatingsUpdate: (ratings: Rating[]) => void;
  balanceSheetId: number;
};

const RatingTable = ({
  ratings,
  onRatingsUpdate,
  balanceSheetId,
}: RatingTableProps) => {
  const api = useApi();
  const { t } = useTranslation('rating-table');

  const updateAspectEstimation = (shortName: string, estimations: number) => {
    onRatingsUpdate(
      ratings.map((r) =>
        r.shortName === shortName
          ? {
              ...r,
              estimations: estimations,
            }
          : r
      )
    );
  };

  const onSaveClick = async () => {
    await api.patch(
      `v1/balancesheets/${balanceSheetId}`,
      {
        ratings: ratings.map((r) => {
          return { shortName: r.shortName, estimations: r.estimations };
        }),
      },
      {
        params: { save: true },
      }
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>
                  <Trans t={t}>Topic/ Aspect</Trans>
                </TableCell>
                <TableCell>
                  <Trans t={t}>Estimation</Trans>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratings.map((r) => (
                <TableRow
                  key={r.shortName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {r.shortName}
                  </TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>
                    {r.isPositive ? (
                      <PositiveRating
                        value={r.estimations}
                        onChange={(value) =>
                          updateAspectEstimation(r.shortName, value)
                        }
                      />
                    ) : (
                      <NegativeRating
                        initialValue={r.estimations}
                        onChange={(value) =>
                          updateAspectEstimation(r.shortName, value)
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={onSaveClick}
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          <Trans t={t}>Save</Trans>
        </Button>
      </Grid>
    </Grid>
  );
};

export default RatingTable;
