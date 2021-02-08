import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const KuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <Box {...getTestIdProps('toteutuksenKuvaus')}>
      <Field
        name={`${name}.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
      />
    </Box>
  );
};

export default KuvausSection;
