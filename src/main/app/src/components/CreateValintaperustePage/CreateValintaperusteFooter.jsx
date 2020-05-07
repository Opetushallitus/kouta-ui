import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import getValintaperusteByFormValues from '#/src/utils/getValintaperusteByFormValues';
import createValintaperuste from '#/src/utils/kouta/createValintaperuste';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateValintaperusteFooter = ({ organisaatioOid }) => {
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

  return <FormFooter entity={ENTITY.VALINTAPERUSTE} save={save} />;
};

export default CreateValintaperusteFooter;
