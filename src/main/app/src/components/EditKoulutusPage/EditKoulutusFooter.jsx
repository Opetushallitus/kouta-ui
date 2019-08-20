import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import updateKoulutus from '../../utils/kouta/updateKoulutus';
import useSaveForm from '../useSaveForm';
import validateKoulutusForm from '../../utils/validateKoulutusForm';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditKoulutusFooter = ({ koulutus, history }) => {
  const { tila } = koulutus;
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateKoulutus({
        httpClient,
        apiUrls,
        koulutus: {
          ...koulutus,
          ...getKoulutusByFormValues(values),
          tila:
            koulutus.tila === JULKAISUTILA.JULKAISTU
              ? koulutus.tila
              : values.tila,
        },
      });

      history.replace({
        state: {
          koulutusUpdatedAt: Date.now(),
        },
      });
    },
    [koulutus, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'editKoulutusForm',
    submit,
    validate: validateKoulutusForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaKoulutusButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={saveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseKoulutusButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default withRouter(EditKoulutusFooter);
