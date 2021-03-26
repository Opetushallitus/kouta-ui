import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createOppilaitos from '#/src/utils/oppilaitos/createOppilaitos';
import getOppilaitosByFormValues from '#/src/utils/oppilaitos/getOppilaitosByFormValues';
import updateOppilaitos from '#/src/utils/oppilaitos/updateOppilaitos';
import { validateOppilaitosForm } from '#/src/utils/oppilaitos/validateOppilaitosForm';

const OppilaitosPageFooter = ({ oppilaitos, organisaatioOid, readOnly }) => {
  const queryClient = useQueryClient();
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

      queryClient.invalidateQueries(ENTITY.OPPILAITOS);
    },
    [oppilaitos, organisaatioOid, queryClient]
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
