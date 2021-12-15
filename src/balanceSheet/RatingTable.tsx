import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import HoverRating from './HoverRating';

const RatingTable = () => {
  return (
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
          <TableRow
            key={'test'}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              A1.1
            </TableCell>
            <TableCell>
              Arbeitsbedingungen und gesellschaftliche Auswirkungen in der
              Zulieferkette
            </TableCell>
            <TableCell>
              <HoverRating />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RatingTable;
