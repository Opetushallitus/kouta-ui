import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const KuvausFieldsSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box mb={2} {...getTestIdProps('kuvauksenNimiInput')}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.kuvauksenNimi')}
          required
        />
      </Box>

      <Box {...getTestIdProps('kuvausInput')}>
        <Field
          disabled={disabled}
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.kuvaus')}
        />
      </Box>
    </>
  );
};
