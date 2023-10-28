import Rating from '@mui/material/Rating';
import { ReactNode, useState } from 'react';
import { Badge, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling';
import GridContainer from '../layout/GridContainer';
import GridItem from '../layout/GridItem';

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
  label: ReactNode;
};

export default function PositiveRating<T extends FieldValues>({
  control,
  name,
  label,
}: PositiveRatingProps<T>) {
  const [hover, setHover] = useState(-1);
  const getLabel = (currentValue: number): string => {
    if (currentValue === 1) {
      return 'Erste Schritte';
    } else if (currentValue >= 2 && currentValue <= 3) {
      return 'Fortgeschritten';
    } else if (currentValue >= 4 && currentValue <= 6) {
      return 'Erfahren';
    } else if (currentValue >= 7 && currentValue <= 10) {
      return 'Vorbildlich';
    } else {
      return 'Basislinie';
    }
  };

  return (
    <Controller
      render={({ field, fieldState }) => {
        return (
          <GridContainer justifyContent={'space-between'}>
            <GridItem xs={12} sm={7}>
              <StyledRating
                aria-label={name}
                value={field.value}
                onChange={(e, newValue) => {
                  field.onChange(newValue);
                }}
                max={10}
                precision={1}
                IconContainerComponent={({ value, onClick, ...other }) => {
                  return (
                    <FontAwesomeRatingIcon
                      currentValue={field.value}
                      value={value}
                      props={other}
                      hover={hover}
                    />
                  );
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={4}>
              {field.value !== null && (
                <Chip label={getLabel(hover !== -1 ? hover : field.value)} />
              )}
            </GridItem>
          </GridContainer>
        );
      }}
      name={name}
      control={control}
    />
  );
}

function FontAwesomeRatingIcon({
  value,
  currentValue,
  props,
  hover,
}: {
  value: number;
  currentValue: number;
  props: any;
  hover: number;
}) {
  return (
    <>
      <Badge
        badgeContent={value}
        color="primary"
        invisible={hover !== -1 ? value !== hover : value !== currentValue}
      >
        <FontAwesomeIcon icon={faSeedling} {...props} />
      </Badge>
    </>
  );
}
