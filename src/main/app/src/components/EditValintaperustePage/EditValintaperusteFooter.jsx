import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import validateValintaperusteForm from '../../utils/validateValintaperusteForm';
import useSaveForm from '../useSaveForm';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditValintaperusteFooter = ({ valintaperuste, history }) => {
  const { tila } = valintaperuste;
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
          tila:
            valintaperuste.tila === JULKAISUTILA.JULKAISTU
              ? valintaperuste.tila
              : values.tila,
        },
      });

      history.replace({
        state: {
          valintaperusteUpdatedAt: Date.now(),
        },
      });
    },
    [valintaperuste, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'editValintaperusteForm',
    submit,
    validate: validateValintaperusteForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaValintaperusteButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={saveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseValintaperusteButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default withRouter(EditValintaperusteFooter);
