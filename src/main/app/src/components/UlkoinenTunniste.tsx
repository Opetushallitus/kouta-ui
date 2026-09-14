import { useTranslation } from 'react-i18next';

import { Field } from '#/src/components/formFields/Field';
import { Box } from '#/src/components/virkailija';

import { FormFieldInput } from './formFields';

export const UlkoinenTunniste = ({ disabled = false }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Field
        label={t('yleiset.ulkoinenTunniste')}
        disabled={disabled}
        component={FormFieldInput}
        name="externalId"
      />
    </Box>
  );
};
