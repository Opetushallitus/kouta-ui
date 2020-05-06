import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import createHakukohde from '../../utils/kouta/createHakukohde';

const CreateHakukohdeFooter = ({
  organisaatioOid,
  hakuOid,
  toteutusOid,
  toteutus,
  haku,
}) => {
  const { t } = useTranslation();
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

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaHakukohdeButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default CreateHakukohdeFooter;
