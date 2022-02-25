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
import { Topic } from '../dataTransferObjects/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { Trans, useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../configuration';
import { useLanguage } from '../i18n';
import { User } from '../authentication/User';
import { useState } from 'react';

type RatingTableProps = {
  initialTopics: Topic[];
  balanceSheetId: number;
  user: User;
};

const RatingTable = ({
  initialTopics,
  balanceSheetId,
  user,
}: RatingTableProps) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const { t } = useTranslation('rating-table');
  const language = useLanguage();

  const updateAspectEstimation = (
    shortNameOfParentTopic: string,
    shortName: string,
    estimations: number
  ) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) =>
        t.shortName === shortNameOfParentTopic
          ? {
              ...t,
              aspects: t.aspects.map((a) =>
                a.shortName === shortName
                  ? { ...a, estimations: estimations }
                  : a
              ),
            }
          : t
      )
    );
  };

  const onSave = async () => {
    await axios.patch(
      `${API_URL}/v1/balancesheets/${balanceSheetId}`,
      {
        ratings: topics
          .map((t) =>
            t.aspects.map((a) => {
              return { shortName: a.shortName, estimations: a.estimations };
            })
          )
          .flat(1),
      },
      {
        params: { lng: language, save: true },
        headers: { Authorization: `Bearer ${user.token}` },
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
              {topics.map((t) =>
                t.aspects.map((a) => (
                  <TableRow
                    key={a.shortName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {a.shortName}
                    </TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      {a.isPositive ? (
                        <PositiveRating
                          value={a.estimations}
                          setValue={(value) =>
                            updateAspectEstimation(
                              t.shortName,
                              a.shortName,
                              value
                            )
                          }
                        />
                      ) : (
                        <NegativeRating
                          value={a.estimations}
                          setValue={(value) =>
                            updateAspectEstimation(
                              t.shortName,
                              a.shortName,
                              value
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth={true}
          size={'large'}
          onClick={onSave}
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
