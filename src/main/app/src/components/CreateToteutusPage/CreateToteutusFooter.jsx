import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import createToteutus from '../../utils/kouta/createToteutus';
import useSaveForm from '../useSaveForm';
import validateToteutusForm from '../../utils/validateToteutusForm';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

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

      history.push(`/toteutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history, koulutustyyppi, koulutusOid],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createToteutusForm',
    submit,
    validate: validateToteutusForm,
  });

  return (
    <Flex justifyEnd>
      <SaveButton onClick={save} {...getTestIdProps('tallennaToteutusButton')}>
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseToteutusButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateToteutusFooter);
