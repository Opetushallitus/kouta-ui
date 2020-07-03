import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateOppilaitosForm from '#/src/utils/oppilaitos/validateOppilaitosForm';
import createOppilaitos from '#/src/utils/oppilaitos/createOppilaitos';
import updateOppilaitos from '#/src/utils/oppilaitos/updateOppilaitos';
import getOppilaitosByFormValues from '#/src/utils/oppilaitos/getOppilaitosByFormValues';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const OppilaitosPageFooter = ({ oppilaitos, organisaatioOid, readOnly }) => {
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
    [oppilaitos, organisaatioOid, history]
  );

  const { save } = useSaveForm({
    form: 'oppilaitos',
    submit,
    validate: validateOppilaitosForm,
  });

  return (
    <FormFooter entity={ENTITY.OPPILAITOS} save={save} canUpdate={!readOnly} />
  );
};

export default OppilaitosPageFooter;
