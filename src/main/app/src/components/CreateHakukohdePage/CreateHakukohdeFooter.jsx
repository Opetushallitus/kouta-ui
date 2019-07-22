import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import createHakukohde from '../../utils/kouta/createHakukohde';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';

const SaveButton = styled(Button).attrs({ variant: 'outlined' })`
  margin-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

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

      history.push(`/hakukohde/${oid}/muokkaus`);
    },
    [organisaatioOid, hakuOid, toteutusOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'createHakukohdeForm',
    submit,
    validate: validateHakukohdeForm,
  });

  return (
    <Flex justifyEnd>
      <SaveButton onClick={save} {...getTestIdProps('tallennaHakukohdeButton')}>
        {t('yleiset.tallenna')}
      </SaveButton>
      <Button
        onClick={saveAndPublish}
        {...getTestIdProps('tallennaJaJulkaiseHakukohdeButton')}
      >
        {t('yleiset.tallennaJaJulkaise')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateHakukohdeFooter);
