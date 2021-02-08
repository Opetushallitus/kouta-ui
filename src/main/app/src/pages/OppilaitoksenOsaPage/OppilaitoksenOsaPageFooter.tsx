import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createOppilaitoksenOsa from '#/src/utils/oppilaitoksenOsa/createOppilaitoksenOsa';
import getOppilaitoksenOsaByFormValues from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByFormValues';
import updateOppilaitoksenOsa from '#/src/utils/oppilaitoksenOsa/updateOppilaitoksenOsa';
import validateOppilaitoksenOsaForm from '#/src/utils/oppilaitoksenOsa/validateOppilaitoksenOsaForm';

const OppilaitoksenOsaPageFooter = ({
  oppilaitoksenOsa,
  organisaatioOid,
  readOnly,
}) => {
  const history = useHistory();

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
    [oppilaitoksenOsa, organisaatioOid, history]
  );

  const { save } = useSaveForm({
    form: 'oppilaitoksenOsa',
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
