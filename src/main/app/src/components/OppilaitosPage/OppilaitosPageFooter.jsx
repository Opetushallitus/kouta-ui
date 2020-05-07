import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateOppilaitosForm from '../../utils/validateOppilaitosForm';
import createOppilaitos from '../../utils/kouta/createOppilaitos';
import updateOppilaitos from '../../utils/kouta/updateOppilaitos';
import getOppilaitosByFormValues from '../../utils/getOppilaitosByFormValues';
import { FormFooter } from '#/src/components/FormPage';

const OppilaitosPageFooter = ({
  oppilaitos,
  organisaatioOid,
  oppilaitosIsLoading = false,
}) => {
  const history = useHistory();

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
    <FormFooter
      entity="oppilaitos"
      save={save}
      submitProps={{ disabled: oppilaitosIsLoading }}
    />
  );
};

export default OppilaitosPageFooter;
