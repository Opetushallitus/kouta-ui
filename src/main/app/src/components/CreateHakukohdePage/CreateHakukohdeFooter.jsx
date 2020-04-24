import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import createHakukohde from '../../utils/kouta/createHakukohde';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';

const CreateHakukohdeFooter = ({
  organisaatioOid,
  hakuOid,
  toteutusOid,
  history,
}) => {
  const { t } = useTranslation();

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

  const { save } = useSaveForm({
    form: 'createHakukohdeForm',
    submit,
    validate: validateHakukohdeForm,
  });

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaHakukohdeButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default withRouter(CreateHakukohdeFooter);
