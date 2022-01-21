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

type RatingTableProps = {
  topics: Topic[];
};

const RatingTable = ({ topics }: RatingTableProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Einschätzung</TableCell>
                <TableCell>Thema/ Aspekt</TableCell>
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
                        <PositiveRating val={a.estimations} />
                      ) : (
                        <NegativeRating initialValue={a.estimations} />
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
          variant={'contained'}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Speichern
        </Button>
      </Grid>
    </Grid>
  );
};

export default RatingTable;
