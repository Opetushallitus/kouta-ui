import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { Flex } from '#/src/components/Flex';
import { useIsSubmitting } from '#/src/hooks/form';

const FormFooter = ({ entity, save, canUpdate = true, submitProps = {} }) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  return (
    <Flex justifyEnd>
      <Button
        onClick={save}
        disabled={!canUpdate || isSubmitting}
        title={!canUpdate ? t(`${entity}lomake.eiMuokkausOikeutta`) : undefined}
        {...submitProps}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default FormFooter;
