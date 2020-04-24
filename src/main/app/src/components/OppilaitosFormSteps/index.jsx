import React from 'react';

import Box from '../Box';
import FormStepIcon from '../FormStepIcon';
import { useTranslation } from 'react-i18next';

const OppilaitosFormSteps = ({ activeStep = 'oppilaitos' }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="center">
      <Box mx={-4} display="flex">
        <Box mx={2}>
          <FormStepIcon
            icon="account_balance"
            active={activeStep === 'oppilaitos'}
          >
            {t('yleiset.oppilaitos')}
          </FormStepIcon>
        </Box>
        <Box mx={2}>
          <FormStepIcon
            icon="add_circle_outline"
            active={activeStep === 'oppilaitoksenOsa'}
          >
            {t('yleiset.oppilaitoksenOsa')}
          </FormStepIcon>
        </Box>
      </Box>
    </Box>
  );
};

export default OppilaitosFormSteps;
