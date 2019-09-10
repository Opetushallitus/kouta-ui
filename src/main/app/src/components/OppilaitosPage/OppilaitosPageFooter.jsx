import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Box from '../Box';
import Button from '../Button';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import useSaveForm from '../useSaveForm';
import validateOppilaitosForm from '../../utils/validateOppilaitosForm';
import createOppilaitos from '../../utils/kouta/createOppilaitos';
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
      await createOppilaitos({
        httpClient,
        apiUrls,
        oppilaitos: {
          organisaatioOid,
          ...(oppilaitos || {}),
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
      <Button
        onClick={save}
        disabled={oppilaitosIsLoading}
        {...getTestIdProps('tallennaOppilaitosButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default withRouter(OppilaitosPageFooter);
