import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const KohdejoukonRajausSection = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldSelect}
      options={options}
      label={t('valintaperustelomake.valitseHaunKohdejoukko')}
    />
  );
};

export default KohdejoukonRajausSection;
