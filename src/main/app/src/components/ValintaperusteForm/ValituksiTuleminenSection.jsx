import React from 'react';
import { Field } from 'redux-form';

import { FormFieldTextarea } from '../FormFields';
import useTranslation from '../useTranslation';

const ValituksiTuleminenSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={`ehto.${language}`}
      component={FormFieldTextarea}
      label={t('valintaperustelomake.kerroValituksiTulemisenVahimmaisehdoista')}
    />
  );
};

export default ValituksiTuleminenSection;
