import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormNameContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { HakuModel } from '#/src/types/hakuTypes';
import { getValuesForSaving } from '#/src/utils';
import createHaku from '#/src/utils/haku/createHaku';
import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';
import updateHaku from '#/src/utils/haku/updateHaku';
import validateHakuForm from '#/src/utils/haku/validateHakuForm';

type HakuFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  haku?: HakuModel;
  canUpdate?: boolean;
};

export const HakuFooter = ({
  formMode,
  organisaatioOid,
  haku = {},
  canUpdate,
}: HakuFooterProps) => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const unregisteredFields = useSelector(state => state?.unregisteredFields);
  const initialValues = useSelector(state => state.form?.[formName]?.initial);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn = formMode === FormMode.CREATE ? createHaku : updateHaku;

      const valuesForSaving = getValuesForSaving(
        values,
        form.registeredFields,
        unregisteredFields,
        initialValues
      );

      const { oid } = await dataSendFn({
        httpClient,
        apiUrls,
        haku: {
          organisaatioOid,
          ...haku,
          ...getHakuByFormValues(valuesForSaving),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
      } else {
        queryClient.invalidateQueries(ENTITY.HAKU);
      }
    },
    [
      organisaatioOid,
      form.registeredFields,
      formMode,
      haku,
      history,
      initialValues,
      unregisteredFields,
      queryClient,
    ]
  );

  const { save } = useSaveForm({
    form: formName,
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} canUpdate={canUpdate} />;
};
