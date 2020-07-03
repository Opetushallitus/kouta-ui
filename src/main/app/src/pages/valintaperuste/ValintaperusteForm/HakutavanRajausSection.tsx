import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { FormFieldRadioGroup } from '#/src/components/formFields';

const HakutavanRajausSection = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });

  return (
    <Field
      name={name}
      component={FormFieldRadioGroup}
      options={options}
      label={t('valintaperustelomake.valitseHakutapa')}
    />
  );
};

export default HakutavanRajausSection;
