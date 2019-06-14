import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../FormFields';

const OsaamistaustaSection = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'osaamistausta' });
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldSelect}
      options={options}
      label={t('valintaperustelomake.valitseOsaamistausta')}
      isMulti
    />
  );
};

export default OsaamistaustaSection;
