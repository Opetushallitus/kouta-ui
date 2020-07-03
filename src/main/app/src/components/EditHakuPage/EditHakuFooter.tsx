import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import getHakuByFormValues from '#/src/utils/getHakuByFormValues';
import updateHaku from '#/src/utils/kouta/updateHaku';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateHakuForm from '#/src/utils/validateHakuForm';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY } from '#/src/constants';

const EditHakuFooter = ({ haku, canUpdate }) => {
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHaku({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakuUpdatedAt: Date.now(),
        },
      });
    },
    [haku, history]
  );

  const { save } = useSaveForm({
    form: 'editHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} canUpdate={canUpdate} />;
};

export default EditHakuFooter;
