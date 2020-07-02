import React from 'react';
import { Field } from 'redux-form';

import { FormFieldEditor } from '../formFields';
import { useTranslation } from 'react-i18next';

const EsittelySection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <Field
      component={FormFieldEditor}
      name={`${name}.${language}`}
      label={t('oppilaitoslomake.lisaaOppilaitoksenEsittelyteksti')}
    />
  );
};

export default EsittelySection;
