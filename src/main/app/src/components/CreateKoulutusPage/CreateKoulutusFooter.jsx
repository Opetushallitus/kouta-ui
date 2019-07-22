import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import createKoulutus from '../../utils/kouta/createKoulutus';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateKoulutusFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createKoulutus({
        httpClient,
        apiUrls,
        koulutus: { ...getKoulutusByFormValues(values), organisaatioOid },
      });

      history.push(`/koulutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createKoulutusForm',
    submit,
    validate: validateKoulutusForm,
  });

  return (
    <Flex justifyEnd>
      <SaveButton onClick={save} {...getTestIdProps('tallennaKoulutusButton')}>
        {t('yleiset.tallenna')}
      </SaveButton>

      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseKoulutusButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateKoulutusFooter);
