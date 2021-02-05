import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FormConfigFragment from '#/src/components/FormConfigFragment';
import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import TekstiKuvausSection from './TekstiKuvausSection';

const KuvausSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <Box mb={-2}>
      <FormConfigFragment name="tekstiKuvaus">
        <Box mb={2}>
          <TekstiKuvausSection
            disabled={disabled}
            name={name}
            language={language}
          />
        </Box>
      </FormConfigFragment>

      <Box mb={2} {...getTestIdProps('kuvauksenNimiInput')}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.kuvauksenNimi')}
        />
      </Box>

      <Box mb={2} {...getTestIdProps('kuvausInput')}>
        <Field
          disabled={disabled}
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.kuvaus')}
        />
      </Box>
    </Box>
  );
};

export default KuvausSection;
