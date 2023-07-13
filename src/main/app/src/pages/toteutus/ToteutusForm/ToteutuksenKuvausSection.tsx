import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

export const ToteutuksenKuvausSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Box mb={2}>
      <Field
        name={`kuvaus.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        required
      />
    </Box>
  );
};
