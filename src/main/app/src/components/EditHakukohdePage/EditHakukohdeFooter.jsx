import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import updateHakukohde from '../../utils/kouta/updateHakukohde';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';

const EditHakukohdeFooter = ({ hakukohde, history }) => {
  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHakukohde({
        httpClient,
        apiUrls,
        hakukohde: {
          ...hakukohde,
          ...getHakukohdeByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakukohdeUpdatedAt: Date.now(),
        },
      });
    },
    [hakukohde, history],
  );

  const { save } = useSaveForm({
    form: 'editHakukohdeForm',
    submit,
    validate: validateHakukohdeForm,
  });

  const { t } = useTranslation();

  return (
    <Flex justifyEnd>
      <Button onClick={save} {...getTestIdProps('tallennaHakukohdeButton')}>
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(EditHakukohdeFooter);
