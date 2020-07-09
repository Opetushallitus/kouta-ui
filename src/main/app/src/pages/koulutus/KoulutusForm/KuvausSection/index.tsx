import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import FormConfigFragment from '#/src/components/FormConfigFragment';
import Box from '#/src/components/Box';
import TekstiKuvausSection from './TekstiKuvausSection';
import { FormFieldInput, FormFieldTextarea } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

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
          component={FormFieldTextarea}
          label={t('yleiset.kuvaus')}
        />
      </Box>
    </Box>
  );
};

export default KuvausSection;
