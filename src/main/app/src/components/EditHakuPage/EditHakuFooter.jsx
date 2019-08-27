import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Flex from '../Flex';
import getHakuByFormValues from '../../utils/getHakuByFormValues';
import updateHaku from '../../utils/kouta/updateHaku';
import useSaveForm from '../useSaveForm';
import validateHakuForm from '../../utils/validateHakuForm';

const EditHakuFooter = ({ haku, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHaku({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakuUpdatedAt: Date.now(),
        },
      });
    },
    [haku, history],
  );

  const { save } = useSaveForm({
    form: 'editHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <Flex justifyEnd>
      <Button onClick={save} {...getTestIdProps('tallennaHakuButton')}>
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(EditHakuFooter);
