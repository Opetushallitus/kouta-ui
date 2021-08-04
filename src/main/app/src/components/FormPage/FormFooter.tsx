import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { Box } from '#/src/components/virkailija';
import { useIsSubmitting } from '#/src/hooks/form';

const FormFooter = ({ entity, save, canUpdate = true, submitProps = {} }) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        onClick={save}
        disabled={!canUpdate || isSubmitting}
        title={!canUpdate ? t(`${entity}lomake.eiMuokkausOikeutta`) : undefined}
        {...submitProps}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default FormFooter;
