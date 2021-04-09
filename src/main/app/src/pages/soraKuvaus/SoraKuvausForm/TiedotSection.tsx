import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';

export const KieliversiotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <div {...getTestIdProps('nimi')}>
        <Spacing marginBottom={2}>
          <Field
            name={`${name}.nimi.${language}`}
            label={t('yleiset.nimi')}
            component={FormFieldInput}
            required
          />
        </Spacing>
      </div>
      <div {...getTestIdProps('kuvaus')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          label={t('yleiset.kuvaus')}
          component={FormFieldEditor}
          required
        />
      </div>
    </>
  );
};

export default KieliversiotSection;
