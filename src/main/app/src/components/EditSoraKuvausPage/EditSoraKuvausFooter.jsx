import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getSoraKuvausByFormValues from '../../utils/getSoraKuvausByFormValues';
import updateSoraKuvaus from '../../utils/kouta/updateSoraKuvaus';
import useSaveForm from '../useSaveForm';
import validateSoraKuvausForm from '../../utils/validateSoraKuvausForm';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditSoraKuvausFooter = ({ soraKuvaus, history }) => {
  const { tila } = soraKuvaus;
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: { ...soraKuvaus, ...getSoraKuvausByFormValues(values) },
      });

      history.replace({
        state: {
          soraKuvausUpdatedAt: Date.now(),
        },
      });
    },
    [soraKuvaus, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'editSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaSoraKuvausButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={saveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseSoraKuvausButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default withRouter(EditSoraKuvausFooter);
