import React, { useCallback } from 'react';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';

import Box from '../Box';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import useSaveForm from '../useSaveForm';
import validateOppilaitoksenOsaForm from '../../utils/validateOppilaitoksenOsaForm';
import createOppilaitoksenOsa from '../../utils/kouta/createOppilaitoksenOsa';
import getOppilaitoksenOsaByFormValues from '../../utils/getOppilaitoksenOsaByFormValues';


const OppilaitoksenOsaPageFooter = ({
  oppilaitoksenOsa,
  organisaatioOid,
  oppilaitoksenOsaIsLoading = false,
  history,
}) => {
  const { t } = useTranslation();
  const tila = get(oppilaitoksenOsa, 'tila');

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await createOppilaitoksenOsa({
        httpClient,
        apiUrls,
        oppilaitoksenOsa: {
          ...(oppilaitoksenOsa || {}),
          ...getOppilaitoksenOsaByFormValues({ ...values, organisaatioOid }),
        },
      });

      history.replace({
        state: {
          oppilaitoksenOsaUpdatedAt: Date.now(),
        },
      });
    },
    [oppilaitoksenOsa, organisaatioOid, history],
  );

  const { save, saveAndPublish } = useSaveForm({
    form: 'oppilaitoksenOsa',
    submit,
    validate: validateOppilaitoksenOsaForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Button
        variant="outlined"
        onClick={save}
        disabled={oppilaitoksenOsaIsLoading}
        {...getTestIdProps('tallennaOppilaitoksenOsaButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <Box ml={2}>
          <Button
            onClick={saveAndPublish}
            disabled={oppilaitoksenOsaIsLoading}
            {...getTestIdProps('tallennaJaJulkaiseOppilaitoksenOsaButton')}
          >
            {t('yleiset.tallennaJaJulkaise')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default withRouter(OppilaitoksenOsaPageFooter);
