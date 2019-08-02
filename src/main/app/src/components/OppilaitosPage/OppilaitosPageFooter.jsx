import React, { useCallback } from 'react';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';

import Box from '../Box';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
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
  const tila = get(oppilaitos, 'tila');

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await createOppilaitos({
        httpClient,
        apiUrls,
        oppilaitos: {
          ...(oppilaitos || {}),
          ...getOppilaitosByFormValues({ ...values, organisaatioOid }),
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

  const { save, saveAndPublish } = useSaveForm({
    form: 'oppilaitos',
    submit,
    validate: validateOppilaitosForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Button
        variant="outlined"
        onClick={save}
        disabled={oppilaitosIsLoading}
        {...getTestIdProps('tallennaOppilaitosButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <Box ml={2}>
          <Button
            onClick={saveAndPublish}
            disabled={oppilaitosIsLoading}
            {...getTestIdProps('tallennaJaJulkaiseOppilaitosButton')}
          >
            {t('yleiset.tallennaJaJulkaise')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default withRouter(OppilaitosPageFooter);
