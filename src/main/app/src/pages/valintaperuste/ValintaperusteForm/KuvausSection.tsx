import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldInput } from '#/src/components/formFields';
import { SisaltoFields } from '#/src/components/SisaltoFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const KuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box marginBottom={2} {...getTestIdProps('nimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          required
          component={FormFieldInput}
          label={t('valintaperustelomake.kuvauksenNimi')}
        />
      </Box>
      <Box marginBottom={2} {...getTestIdProps('kuvaus')}>
        <Field
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('valintaperustelomake.kuvauksenTarkenne')}
        />
      </Box>
      <Box {...getTestIdProps('sisalto')}>
        <SisaltoFields name={`${name}.sisalto`} language={language} />
      </Box>
    </>
  );
};
