import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createOppilaitoksenOsa from '#/src/utils/oppilaitoksenOsa/createOppilaitoksenOsa';
import { getOppilaitoksenOsaByFormValues } from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByFormValues';
import updateOppilaitoksenOsa from '#/src/utils/oppilaitoksenOsa/updateOppilaitoksenOsa';
import { validateOppilaitoksenOsaForm } from '#/src/utils/oppilaitoksenOsa/validateOppilaitoksenOsaForm';

const OppilaitoksenOsaPageFooter = ({
  oppilaitoksenOsa,
  organisaatioOid,
  readOnly,
}) => {
  const queryClient = useQueryClient();

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

      queryClient.invalidateQueries(ENTITY.OPPILAITOKSEN_OSA);
    },
    [oppilaitoksenOsa, organisaatioOid, queryClient]
  );

  const save = useSaveForm({
    formName: ENTITY.OPPILAITOKSEN_OSA,
    submit,
    validate: validateOppilaitoksenOsaForm,
  });

  return (
    <FormFooter
      entity={ENTITY.OPPILAITOKSEN_OSA}
      save={save}
      canUpdate={!readOnly}
    />
  );
};

export default OppilaitoksenOsaPageFooter;
