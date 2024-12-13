import styled from 'styled-components';
import { Typography } from '@mui/material';

export const BigNumber = styled(Typography)<{ $color: string }>`
  font-size: 24px;
  color: ${(props) => props.$color};
`;
