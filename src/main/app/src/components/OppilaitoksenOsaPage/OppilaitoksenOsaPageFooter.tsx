import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateOppilaitoksenOsaForm from '../../utils/validateOppilaitoksenOsaForm';
import createOppilaitoksenOsa from '../../utils/kouta/createOppilaitoksenOsa';
import getOppilaitoksenOsaByFormValues from '../../utils/getOppilaitoksenOsaByFormValues';
import updateOppilaitoksenOsa from '../../utils/kouta/updateOppilaitoksenOsa';
import { ENTITY } from '#/src/constants';
import { FormFooter } from '#/src/components/FormPage';

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
