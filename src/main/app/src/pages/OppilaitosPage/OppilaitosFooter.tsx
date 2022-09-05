import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { createOppilaitos } from '#/src/utils/oppilaitos/createOppilaitos';
import { getOppilaitosByFormValues } from '#/src/utils/oppilaitos/getOppilaitosByFormValues';
import { updateOppilaitos } from '#/src/utils/oppilaitos/updateOppilaitos';
import { validateOppilaitosForm } from '#/src/utils/oppilaitos/validateOppilaitosForm';

export const OppilaitosFooter = ({ oppilaitos, organisaatioOid, readOnly }) => {
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

  const save = useSaveForm({
    formName: ENTITY.OPPILAITOS,
    submit,
    validate: validateOppilaitosForm,
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.OPPILAITOS}
      entity={oppilaitos}
      save={save}
      canUpdate={!readOnly}
      esikatseluUrl={
        oppilaitos && apiUrls.url('konfo-ui.oppilaitos', organisaatioOid)
      }
    />
  );
};
