import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import updateSoraKuvaus from '#/src/utils/soraKuvaus/updateSoraKuvaus';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateSoraKuvausForm from '#/src/utils/soraKuvaus/validateSoraKuvausForm';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const EditSoraKuvausFooter = ({ soraKuvaus, canUpdate }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: {
          ...soraKuvaus,
          ...getSoraKuvausByFormValues(values),
        },
      });

      history.replace({
        state: {
          soraKuvausUpdatedAt: Date.now(),
        },
      });
    },
    [soraKuvaus, history]
  );

  const { save } = useSaveForm({
    form: 'editSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <FormFooter entity={ENTITY.SORA_KUVAUS} save={save} canUpdate={canUpdate} />
  );
};

export default EditSoraKuvausFooter;
