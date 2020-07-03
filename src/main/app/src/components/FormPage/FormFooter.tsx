import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { getTestIdProps } from '#/src/utils';
import Flex from '#/src/components/Flex';
import Button from '#/src/components/Button';
import { useIsDirty, useIsSubmitting } from '#/src/hooks/form';

const FormFooter = ({ entity, save, canUpdate = true, submitProps = {} }) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  const isDirty = useIsDirty();
  return (
    <Flex justifyEnd>
      <Button
        onClick={save}
        disabled={!canUpdate || isSubmitting || !isDirty}
        title={!canUpdate ? t(`${entity}lomake.eiMuokkausOikeutta`) : undefined}
        {...getTestIdProps(`tallenna${_.upperFirst(entity)}Button`)}
        {...submitProps}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default FormFooter;
