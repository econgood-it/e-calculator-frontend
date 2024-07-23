import { Matrix, MatrixRating } from '../../models/Matrix';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { StakeholderIcon } from '../lib/StakeholderIcon';

type MatrixViewProps = {
  matrix: Matrix;
};

export function MatrixView({ matrix }: MatrixViewProps) {
  return (
    <GridContainer spacing={3}>
      {matrix.ratings.map((r) => (
        <GridItem key={r.shortName} xs={12} sm={3}>
          <MatrixRatingView matrixRating={r} />
        </GridItem>
      ))}
    </GridContainer>
  );
}

const BigNumber = styled(Typography)<{ $color: string }>`
  font-size: 60px;
  color: ${(props) => props.$color};
`;

export const ShortNameAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.secondary.contrastText};
`;

export const StakeholderAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.primary.main};
`;

type MatrixRatingViewProps = {
  matrixRating: MatrixRating;
};

export function MatrixRatingView({ matrixRating }: MatrixRatingViewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const numberToValueMapping: { [key: string]: string } = {
    '1': t`Human dignity`,
    '2': t`Solidarity and social justice`,
    '3': t`Environmental sustainability`,
    '4': t`Transparency and co-determination`,
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <AvatarGroup max={2}>
            <ShortNameAvatar>{matrixRating.shortName}</ShortNameAvatar>
            <StakeholderAvatar>
              <StakeholderIcon
                stakeholderKey={matrixRating.shortName.at(0)!}
                color={theme.palette.primary.contrastText}
              />
            </StakeholderAvatar>
          </AvatarGroup>
        }
        title={matrixRating.name}
        subheader={numberToValueMapping[matrixRating.shortName.at(1)!]}
      />
      <CardContent>
        <GridContainer justifyContent="space-around">
          <GridItem xs={12}>
            <Divider>
              <Chip label={<Trans>Score reached</Trans>} />
            </Divider>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer justifyContent={'center'}>
              <GridItem>
                <BigNumber
                  $color={theme.palette.secondary.main}
                >{`${matrixRating.points} / ${matrixRating.maxPoints}`}</BigNumber>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12}>
            <Divider>
              <Chip label={<Trans>Percentage reached</Trans>} />
            </Divider>
          </GridItem>
          <GridItem xs={12}>
            <GridContainer justifyContent={'center'}>
              <GridItem>
                {matrixRating.percentageReached !== undefined &&
                !matrixRating.notApplicable ? (
                  <BigNumber
                    $color={theme.palette.primary.main}
                  >{`${matrixRating.percentageReached} %`}</BigNumber>
                ) : (
                  <Typography
                    mt={3}
                    color={theme.palette.primary.main}
                    variant="body1"
                  >
                    {matrixRating.notApplicable ? (
                      <Trans>Not considered in weighting</Trans>
                    ) : (
                      <Trans>No reasonable specification</Trans>
                    )}
                  </Typography>
                )}
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </CardContent>
    </Card>
  );
}
