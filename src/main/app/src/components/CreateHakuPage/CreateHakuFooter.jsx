import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import createHaku from '../../utils/kouta/createHaku';
import validateHakuForm from '../../utils/validateHakuForm';
import getHakuByFormValues from '../../utils/getHakuByFormValues';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const CreateHakuFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createHaku({
        httpClient,
        apiUrls,
        haku: { ...getHakuByFormValues(values), organisaatioOid },
      });

      history.push(`/haku/${oid}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <Flex justifyEnd>
      <SaveButton onClick={save} {...getTestIdProps('tallennaHakuButton')}>
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseHakuButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateHakuFooter);
