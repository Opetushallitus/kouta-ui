import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const TiedotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <div {...getTestIdProps('nimi')}>
        <Box marginBottom={2}>
          <Field
            name={`${name}.nimi.${language}`}
            label={t('yleiset.nimi')}
            component={FormFieldInput}
            required
          />
        </Box>
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
