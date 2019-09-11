import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Box from '../Box';
import Button from '../Button';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import useSaveForm from '../useSaveForm';
import validateOppilaitoksenOsaForm from '../../utils/validateOppilaitoksenOsaForm';
import createOppilaitoksenOsa from '../../utils/kouta/createOppilaitoksenOsa';
import getOppilaitoksenOsaByFormValues from '../../utils/getOppilaitoksenOsaByFormValues';
import updateOppilaitoksenOsa from '../../utils/kouta/updateOppilaitoksenOsa';

const OppilaitoksenOsaPageFooter = ({
  oppilaitoksenOsa,
  organisaatioOid,
  oppilaitoksenOsaIsLoading = false,
  history,
}) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const fn = oppilaitoksenOsa
        ? updateOppilaitoksenOsa
        : createOppilaitoksenOsa;

      await fn({
        httpClient,
        apiUrls,
        oppilaitoksenOsa: {
          organisaatioOid,
          ...(oppilaitoksenOsa || {}),
          oid: organisaatioOid,
          ...getOppilaitoksenOsaByFormValues(values),
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

  const { save } = useSaveForm({
    form: 'oppilaitoksenOsa',
    submit,
    validate: validateOppilaitoksenOsaForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Button
        onClick={save}
        disabled={oppilaitoksenOsaIsLoading}
        {...getTestIdProps('tallennaOppilaitoksenOsaButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default withRouter(OppilaitoksenOsaPageFooter);
