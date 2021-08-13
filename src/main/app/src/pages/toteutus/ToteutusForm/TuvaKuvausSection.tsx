import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

export const TuvaKuvausSection = ({ language, name, koulutus }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box mb={2} {...getTestIdProps('toteutuksenKuvaus')}>
        <Field
          name={`kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        />
      </Box>
    </>
  );
};
