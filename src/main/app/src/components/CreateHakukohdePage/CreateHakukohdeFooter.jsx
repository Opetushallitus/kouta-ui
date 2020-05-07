import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import createHakukohde from '../../utils/kouta/createHakukohde';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateHakukohdeFooter = ({
  organisaatioOid,
  hakuOid,
  toteutusOid,
  toteutus,
  haku,
}) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ httpClient, apiUrls, values }) => {
      const { oid } = await createHakukohde({
        httpClient,
        apiUrls,
        hakukohde: {
          ...getHakukohdeByFormValues(values),
          organisaatioOid,
          hakuOid,
          toteutusOid,
        },
      });

      history.push(
        `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
      );
    },
    [organisaatioOid, hakuOid, toteutusOid, history],
  );

  const save = useSaveHakukohde(submit, { haku, toteutus });

  return <FormFooter entity={ENTITY.HAKUKOHDE} save={save} />;
};

export default CreateHakukohdeFooter;
