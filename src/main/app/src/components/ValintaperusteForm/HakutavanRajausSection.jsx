import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import { RadioGroup } from '../Radio';
import useTranslation from '../useTranslation';
import useKoodistoOptions from '../useKoodistoOptions';

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input} options={options} />
);

const HakutavanRajausSection = () => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.valitseHakutapa')}
      </Typography>

      <Field
        name="hakutapa"
        component={renderRadioGroupField}
        options={options}
      />
    </>
  );
};

export default HakutavanRajausSection;
