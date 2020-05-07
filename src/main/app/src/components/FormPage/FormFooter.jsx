import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '#/src/utils';
import Submit from '#/src/components/Submit';
import Flex from '#/src/components/Flex';

const FormFooter = ({ entity, save, canUpdate = true, submitProps = {} }) => {
  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <Submit
        onClick={save}
        disabled={!canUpdate}
        title={!canUpdate ? t(`${entity}lomake.eiMuokkausOikeutta`) : undefined}
        {...getTestIdProps(`tallenna${_.upperFirst(entity)}Button`)}
        {...submitProps}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default FormFooter;
