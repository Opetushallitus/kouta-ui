import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { FormFieldSelect } from '#/src/components/formFields';

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
