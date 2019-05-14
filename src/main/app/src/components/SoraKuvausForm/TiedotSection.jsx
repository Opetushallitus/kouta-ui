import React from 'react';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '../FormFields';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';

export const KieliversiotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <Field
          name={`${name}.nimi.${language}`}
          label={t('yleiset.nimi')}
          component={FormFieldInput}
        />
      </Spacing>
      <Field
        name={`${name}.kuvaus.${language}`}
        label={t('yleiset.kuvaus')}
        component={FormFieldEditor}
      />
    </>
  );
};

export default KieliversiotSection;
