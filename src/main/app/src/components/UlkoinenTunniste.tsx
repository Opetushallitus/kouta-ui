import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';

import { FormFieldInput } from './formFields';

export const UlkoinenTunniste = ({ disabled = false }) => {
  const { t } = useTranslation();
  return (
    <Box mb={2}>
      <Field
        label={t('yleiset.ulkoinenTunniste')}
        disabled={disabled}
        component={FormFieldInput}
        name="externalId"
      />
    </Box>
  );
};
