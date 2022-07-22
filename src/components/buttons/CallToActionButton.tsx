import { Button } from '@mui/material';
import styled from 'styled-components';

export const CallToActionButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.secondary.contrastText};
  &:hover {
    background-color: ${(props) => props.theme.palette.secondary.main};
    opacity: 0.4;
  }
`;
