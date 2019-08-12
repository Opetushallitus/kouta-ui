import React from 'react';
import { Field } from 'redux-form';

import { FormFieldEditor } from '../FormFields';
import useTranslation from '../useTranslation';

const EsittelySection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <Field
      component={FormFieldEditor}
      name={`${name}.${language}`}
      label={t('oppilaitoksenOsaLomake.lisaaOppilaitoksenOsanEsittelyteksti')}
    />
  );
};

export default EsittelySection;
