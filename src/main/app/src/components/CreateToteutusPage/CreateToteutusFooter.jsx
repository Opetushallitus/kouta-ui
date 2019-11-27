import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import createToteutus from '../../utils/kouta/createToteutus';
import useSaveForm from '../useSaveForm';
import validateToteutusForm from '../../utils/validateToteutusForm';

const CreateToteutusFooter = ({
  organisaatioOid,
  koulutustyyppi,
  history,
  koulutusOid,
}) => {
  const { t } = useTranslation();

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

  const { save } = useSaveForm({
    form: 'createToteutusForm',
    submit,
    validate: values => validateToteutusForm({...values, koulutustyyppi}),
  });

  return (
    <Flex justifyEnd>
      <Button onClick={save} {...getTestIdProps('tallennaToteutusButton')}>
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateToteutusFooter);
