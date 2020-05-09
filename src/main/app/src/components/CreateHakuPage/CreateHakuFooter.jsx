import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createHaku from '../../utils/kouta/createHaku';
import validateHakuForm from '../../utils/validateHakuForm';
import getHakuByFormValues from '../../utils/getHakuByFormValues';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateHakuFooter = ({ organisaatioOid }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createHaku({
        httpClient,
        apiUrls,
        haku: { ...getHakuByFormValues(values), organisaatioOid },
      });

      history.push(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
    },
    [organisaatioOid, history]
  );

  const { save } = useSaveForm({
    form: 'createHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} />;
};

export default CreateHakuFooter;
