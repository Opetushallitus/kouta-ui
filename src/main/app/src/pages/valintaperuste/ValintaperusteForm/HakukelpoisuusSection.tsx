import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldEditor } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
import { Box } from '#/src/components/virkailija';

export const HakukelpoisuusSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <Box marginBottom={2}>
      <Field
        name={`${name}.${language}`}
        component={FormFieldEditor}
        label={t('valintaperustelomake.hakukelpoisuus')}
      />
    </Box>
  );
};
