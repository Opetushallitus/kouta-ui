import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import createToteutus from '../../utils/kouta/createToteutus';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateToteutusFooter = ({
  organisaatioOid,
  koulutustyyppi,
  koulutusOid,
  koulutus,
}) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
          organisaatioOid,
          koulutusOid,
        },
      });

      history.push(`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history, koulutustyyppi, koulutusOid]
  );

  const save = useSaveToteutus(submit, { koulutustyyppi, koulutus });

  return <FormFooter entity={ENTITY.TOTEUTUS} save={save} />;
};

export default CreateToteutusFooter;
