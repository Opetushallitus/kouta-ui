import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldEditor } from '#/src/components/formFields';

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
