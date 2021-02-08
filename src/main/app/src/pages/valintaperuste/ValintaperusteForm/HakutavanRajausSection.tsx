import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldRadioGroup } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

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
