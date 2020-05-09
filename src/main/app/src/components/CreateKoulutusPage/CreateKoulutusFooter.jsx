import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createKoulutus from '../../utils/kouta/createKoulutus';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const CreateKoulutusFooter = ({ organisaatioOid }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createKoulutus({
        httpClient,
        apiUrls,
        koulutus: { ...getKoulutusByFormValues(values), organisaatioOid },
      });

      history.push(`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history]
  );

  const { save } = useSaveForm({
    form: 'createKoulutusForm',
    submit,
    validate: values => validateKoulutusForm({ ...values, organisaatioOid }),
  });

  return <FormFooter entity={ENTITY.KOULUTUS} save={save} />;
};

export default CreateKoulutusFooter;
