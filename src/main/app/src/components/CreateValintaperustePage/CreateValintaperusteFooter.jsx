import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import validateValintaperusteForm from '../../utils/validateValintaperusteForm';
import createValintaperuste from '../../utils/kouta/createValintaperuste';
import useSaveForm from '../useSaveForm';

const CreateValintaperusteFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...getValintaperusteByFormValues(values),
          organisaatioOid,
        },
      });

      history.push(`/valintaperusteet/${id}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save } = useSaveForm({
    form: 'createValintaperusteForm',
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

export default withRouter(CreateValintaperusteFooter);
