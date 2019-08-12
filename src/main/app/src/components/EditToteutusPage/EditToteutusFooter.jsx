import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import validateToteutusForm from '../../utils/validateToteutusForm';
import useSaveForm from '../useSaveForm';
import updateToteutus from '../../utils/kouta/updateToteutus';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditToteutusFooter = ({ toteutus, koulutustyyppi, history }) => {
  const { tila } = toteutus;
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...toteutus,
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
        },
      });

      history.replace({
        state: {
          toteutusUpdatedAt: Date.now(),
        },
      });
    },
    [toteutus, history, koulutustyyppi],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'editToteutusForm',
    submit,
    validate: validateToteutusForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaToteutusButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={saveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseToteutusButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default withRouter(EditToteutusFooter);
