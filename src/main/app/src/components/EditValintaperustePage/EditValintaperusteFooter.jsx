import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import validateValintaperusteForm from '../../utils/validateValintaperusteForm';
import useSaveForm from '../useSaveForm';

const EditValintaperusteFooter = ({ valintaperuste, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
        },
      });

      history.replace({
        state: {
          valintaperusteUpdatedAt: Date.now(),
        },
      });
    },
    [valintaperuste, history],
  );

  const { save } = useSaveForm({
    form: 'editValintaperusteForm',
    submit,
    validate: validateValintaperusteForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        onClick={save}
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(EditValintaperusteFooter);
