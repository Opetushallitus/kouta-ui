import React from 'react';
import { Field } from 'redux-form';

import FormConfigField from '../../FormConfigField';
import Box from '../../Box';
import TekstiKuvausSection from './TekstiKuvausSection';
import { FormFieldInput, FormFieldTextarea } from '../../formFields';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const KuvausSection = ({ disabled, language, perusteId, name }) => {
  const { t } = useTranslation();

  return (
    <Box mb={-2}>
      <FormConfigField name="tekstiKuvaus">
        <Box mb={2}>
          <TekstiKuvausSection
            disabled={disabled}
            name={name}
            language={language}
            perusteId={perusteId}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="nimi">
        <Box mb={2} {...getTestIdProps('kuvauksenNimiInput')}>
          <Field
            disabled={disabled}
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('yleiset.kuvauksenNimi')}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="kuvaus">
        <Box mb={2} {...getTestIdProps('kuvausInput')}>
          <Field
            disabled={disabled}
            name={`${name}.kuvaus.${language}`}
            component={FormFieldTextarea}
            label={t('yleiset.kuvaus')}
          />
        </Box>
      </FormConfigField>
    </Box>
  );
};

export default KuvausSection;
