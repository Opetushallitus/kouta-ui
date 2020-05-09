import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createSoraKuvaus from '../../utils/kouta/createSoraKuvaus';
import validateSoraKuvausForm from '../../utils/validateSoraKuvausForm';
import getSoraKuvausByFormValues from '../../utils/getSoraKuvausByFormValues';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateSoraKuvausFooter = ({ organisaatioOid }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: { ...getSoraKuvausByFormValues(values), organisaatioOid },
      });

      history.push(
        `/organisaatio/${organisaatioOid}/sora-kuvaus/${id}/muokkaus`
      );
    },
    [history, organisaatioOid]
  );

  const { save } = useSaveForm({
    form: 'createSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return <FormFooter entity={ENTITY.SORA_KUVAUS} save={save} />;
};

export default CreateSoraKuvausFooter;
