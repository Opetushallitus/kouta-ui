import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getTestIdProps } from '#/src/utils';
import getValintaperusteByFormValues from '#/src/utils/getValintaperusteByFormValues';
import createValintaperuste from '#/src/utils/kouta/createValintaperuste';
import Flex from '#/src/components/Flex';
import Submit from '#/src/components/Submit';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';

const CreateValintaperusteFooter = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const history = useHistory();

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

      history.push(
        `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`,
      );
    },
    [organisaatioOid, history],
  );

  const save = useSaveValintaperuste(submit);

  return (
    <Flex justifyEnd>
      <Submit
        onClick={save}
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default CreateValintaperusteFooter;
