import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldEditor } from '#/src/components/formFields';
import Box from '@opetushallitus/virkailija-ui-components/Box';

const KuvausSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Field
        name={`${name}.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
      />
    </Box>
  );
};

export default KuvausSection;
