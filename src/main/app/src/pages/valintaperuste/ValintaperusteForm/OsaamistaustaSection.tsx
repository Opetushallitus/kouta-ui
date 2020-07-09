import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { FormFieldSelect } from '#/src/components/formFields';

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
