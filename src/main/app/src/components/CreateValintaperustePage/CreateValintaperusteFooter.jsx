import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import validateValintaperusteForm from '../../utils/validateValintaperusteForm';
import createValintaperuste from '../../utils/kouta/createValintaperuste';
import useSaveForm from '../useSaveForm';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateValintaperusteFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...getValintaperusteByFormValues(values),
          organisaatioOid,
        },
      });

      history.push(`/valintaperusteet/${oid}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createValintaperusteForm',
    submit,
    validate: validateValintaperusteForm,
  });
  return (
    <Flex justifyEnd>
      <SaveButton
        onClick={save}
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseValintaperusteButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateValintaperusteFooter);
