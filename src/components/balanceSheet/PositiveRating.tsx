import Rating from '@mui/material/Rating';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@mui/material';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';
import { PointLabel } from './PointLabel.tsx';
import { EvaluationLevel } from '../../models/Workbook.ts';

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${(props) => props.theme.palette.primary.main};
  }
  & .MuiRating-iconHover {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

type PositiveRatingProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  evaluationLevels: readonly EvaluationLevel[];
};

export default function PositiveRating<T extends FieldValues>({
  control,
  name,
  evaluationLevels,
}: PositiveRatingProps<T>) {
  const [hover, setHover] = useState<number>(-1);

  const getLabel = (currentValue?: number): string => {
    const defaultValue = evaluationLevels.find((e) => e.level == 0)?.name ?? '';
    if (currentValue) {
      const foundLevel = evaluationLevels.find(
        (e) => currentValue >= e.pointsFrom && currentValue <= e.pointsTo
      );
      return foundLevel?.name ?? defaultValue;
    }
    return defaultValue;
  };

  return (
    <Controller
      render={({ field }) => {
        return (
          <GridContainer alignItems="center" spacing={1}>
            <GridItem xs={12} md={'auto'}>
              <StyledRating
                aria-label={name}
                value={field.value}
                onChange={(_, newValue) => {
                  field.onChange(newValue ?? 0);
                }}
                max={10}
                icon={<FontAwesomeIcon icon={faSeedling} />}
                emptyIcon={<FontAwesomeIcon icon={faSeedling} />}
                onChangeActive={(_, newHover) => {
                  setHover(newHover);
                }}
              />
            </GridItem>
            <GridItem minWidth={140}>
              <Chip label={getLabel(hover !== -1 ? hover : field.value)} />
            </GridItem>
            <GridItem minWidth={200}>
              <GridContainer justifyContent="flex-end">
                <PointLabel value={hover !== -1 ? hover : field.value} />
              </GridContainer>
            </GridItem>
          </GridContainer>
        );
      }}
      name={name}
      control={control}
    />
  );
}
