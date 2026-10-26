import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldEditor } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';

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
