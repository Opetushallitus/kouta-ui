import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import createSoraKuvaus from '../../utils/kouta/createSoraKuvaus';
import validateSoraKuvausForm from '../../utils/validateSoraKuvausForm';
import getSoraKuvausByFormValues from '../../utils/getSoraKuvausByFormValues';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateSoraKuvausFooter = ({ history, organisaatioOid }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: { ...getSoraKuvausByFormValues(values), organisaatioOid },
      });

      history.push(`/sora-kuvaus/${id}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <Flex justifyEnd>
      <SaveButton
        onClick={save}
        {...getTestIdProps('tallennaSoraKuvausButton')}
      >
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseSoraKuvausButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateSoraKuvausFooter);
