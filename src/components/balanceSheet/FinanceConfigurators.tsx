import { Rating } from '../../models/Rating.ts';
import GridContainer from '../layout/GridContainer.tsx';
import GridItem from '../layout/GridItem.tsx';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';

export type RatingsConfiguratorProps = {
  initialRatings: Rating[];
  onRatingsChange: (ratings: Rating[]) => Promise<void>;
};

export function FinanceConfigurator({
  initialRatings,
  onRatingsChange,
}: RatingsConfiguratorProps) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [expanded, setExpanded] = useState(false);
  const options = useMemo(() => ['B1.1', 'B1.2'], []);
  const onConfigurationChange = useCallback(
    (selected: string) => {
      const notSelectedOptions = options.filter(
        (option) => option !== selected
      );
      setRatings((prevState: Rating[]) =>
        prevState.map((rating) => {
          if (rating.shortName === selected) {
            return {
              ...rating,
              weight: 1,
              isWeightSelectedByUser: false,
            };
          }
          if (notSelectedOptions.includes(rating.shortName)) {
            return {
              ...rating,
              weight: 0,
              isWeightSelectedByUser: true,
            };
          }
          return rating;
        })
      );
    },
    [setRatings, options]
  );
  const onSave = useCallback(async () => {
    await onRatingsChange(ratings);
    setExpanded(false);
  }, [ratings, onRatingsChange]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
          >
            Settings
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup onChange={(_, value) => onConfigurationChange(value)}>
              {options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  checked={
                    ratings.find((r) => r.shortName === option)?.weight !== 0
                  }
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={onSave}>
              <Trans>Save</Trans>
            </Button>
          </AccordionActions>
        </Accordion>
      </GridItem>
    </GridContainer>
  );
}
