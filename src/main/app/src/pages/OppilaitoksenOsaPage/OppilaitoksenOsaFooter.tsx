import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { createOppilaitoksenOsa } from '#/src/utils/oppilaitoksenOsa/createOppilaitoksenOsa';
import { getOppilaitoksenOsaByFormValues } from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByFormValues';
import { updateOppilaitoksenOsa } from '#/src/utils/oppilaitoksenOsa/updateOppilaitoksenOsa';
import { validateOppilaitoksenOsaForm } from '#/src/utils/oppilaitoksenOsa/validateOppilaitoksenOsaForm';

export const OppilaitoksenOsaFooter = ({
  oppilaitoksenOsa,
  organisaatioOid,
  readOnly,
}) => {
  const queryClient = useQueryClient();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const fn = oppilaitoksenOsa?.lastModified
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

      queryClient.invalidateQueries(ENTITY.OPPILAITOKSEN_OSA);
    },
    [oppilaitoksenOsa, organisaatioOid, queryClient]
  );

  const save = useSaveForm({
    formName: ENTITY.OPPILAITOKSEN_OSA,
    submit,
    validate: validateOppilaitoksenOsaForm,
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.OPPILAITOKSEN_OSA}
      entity={oppilaitoksenOsa}
      save={save}
      canUpdate={!readOnly}
      esikatseluUrl={
        oppilaitoksenOsa &&
        apiUrls.url('konfo-ui.oppilaitoksenOsa', organisaatioOid)
      }
    />
  );
};
