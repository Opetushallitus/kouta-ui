import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';

import { FormFieldInput } from './formFields';

export const UlkoinenTunniste = ({ disabled }) => {
  const { t } = useTranslation();
  return (
    <Box mb={2} maxWidth="400px">
      <Field
        label={t('yleiset.ulkoinenTunniste')}
        disabled={disabled}
        component={FormFieldInput}
        name="externalId"
      />
    </Box>
  );
};
