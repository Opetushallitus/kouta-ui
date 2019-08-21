import React, { useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import Flex from '../Flex';
import getHakuByFormValues from '../../utils/getHakuByFormValues';
import updateHaku from '../../utils/kouta/updateHaku';
import useSaveForm from '../useSaveForm';
import validateHakuForm from '../../utils/validateHakuForm';

const PublishButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const EditHakuFooter = ({ haku, history }) => {
  const { tila } = haku;
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHaku({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
          tila: haku.tila === JULKAISUTILA.JULKAISTU ? haku.tila : values.tila,
        },
      });

      history.replace({
        state: {
          hakuUpdatedAt: Date.now(),
        },
      });
    },
    [haku, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'editHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaHakuButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <PublishButton
          onClick={saveAndPublish}
          {...getTestIdProps('tallennaJaJulkaiseHakuButton')}
        >
          {t('yleiset.tallennaJaJulkaise')}
        </PublishButton>
      ) : null}
    </Flex>
  );
};

export default withRouter(EditHakuFooter);
