import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import createToteutus from '../../utils/kouta/createToteutus';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';

const CreateToteutusFooter = ({
  organisaatioOid,
  koulutustyyppi,
  koulutusOid,
  koulutus,
}) => {
  const { t } = useTranslation();
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
    [organisaatioOid, history, koulutustyyppi, koulutusOid],
  );

  const save = useSaveToteutus(submit, { koulutustyyppi, koulutus });

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaToteutusButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default CreateToteutusFooter;
