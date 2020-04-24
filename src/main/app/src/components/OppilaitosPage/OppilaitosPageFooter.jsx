import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Box from '../Box';
import Submit from '../Submit';
import { getTestIdProps } from '../../utils';
import { useTranslation } from 'react-i18next';
import useSaveForm from '../useSaveForm';
import validateOppilaitosForm from '../../utils/validateOppilaitosForm';
import createOppilaitos from '../../utils/kouta/createOppilaitos';
import updateOppilaitos from '../../utils/kouta/updateOppilaitos';
import getOppilaitosByFormValues from '../../utils/getOppilaitosByFormValues';

const OppilaitosPageFooter = ({
  oppilaitos,
  organisaatioOid,
  oppilaitosIsLoading = false,
  history,
}) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const fn = oppilaitos ? updateOppilaitos : createOppilaitos;

      await fn({
        httpClient,
        apiUrls,
        oppilaitos: {
          organisaatioOid,
          ...(oppilaitos || {}),
          oid: organisaatioOid,
          ...getOppilaitosByFormValues(values),
        },
      });

      history.replace({
        state: {
          oppilaitosUpdatedAt: Date.now(),
        },
      });
    },
    [oppilaitos, organisaatioOid, history],
  );

  const { save } = useSaveForm({
    form: 'oppilaitos',
    submit,
    validate: validateOppilaitosForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Submit
        onClick={save}
        disabled={oppilaitosIsLoading}
        {...getTestIdProps('tallennaOppilaitosButton')}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Box>
  );
};

export default withRouter(OppilaitosPageFooter);
