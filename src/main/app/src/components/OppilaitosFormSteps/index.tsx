import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '#/src/components/Box';
import FormStepIcon from '#/src/components/FormStepIcon';
import { ENTITY, ICONS } from '#/src/constants';

const { OPPILAITOS, OPPILAITOKSEN_OSA } = ENTITY;

const OppilaitosFormSteps = ({ activeStep = 'oppilaitos' }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="center">
      <Box mx={-4} display="flex">
        <Box mx={2}>
          <FormStepIcon
            icon={ICONS[OPPILAITOS]}
            active={activeStep === OPPILAITOS}
          >
            {t('yleiset.oppilaitos')}
          </FormStepIcon>
        </Box>
        <Box mx={2}>
          <FormStepIcon
            icon={ICONS[OPPILAITOKSEN_OSA]}
            active={activeStep === OPPILAITOKSEN_OSA}
          >
            {t('yleiset.oppilaitoksenOsa')}
          </FormStepIcon>
        </Box>
      </Box>
    </Box>
  );
};

export default OppilaitosFormSteps;
