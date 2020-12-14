import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';

import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';
import updateHaku from '#/src/utils/haku/updateHaku';
import validateHakuForm from '#/src/utils/haku/validateHakuForm';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import createHaku from '#/src/utils/haku/createHaku';
import { getValuesForSaving } from '#/src/utils';
import { useForm } from '#/src/hooks/form';
import { useFormName } from '#/src/contexts/contextHooks';
import { HakuModel } from '#/src/types/hakuTypes';

type HakuFooterProps = {
  formMode: FormMode;
  haku: HakuModel;
  canUpdate?: boolean;
};

export const HakuFooter = ({ formMode, haku, canUpdate }: HakuFooterProps) => {
  const history = useHistory();

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
          ...haku,
          ...getHakuByFormValues(valuesForSaving),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${haku.organisaatioOid}/haku/${oid}/muokkaus`
        );
      } else {
        queryCache.invalidateQueries(ENTITY.HAKU);
      }
    },
    [
      form.registeredFields,
      formMode,
      haku,
      history,
      initialValues,
      unregisteredFields,
    ]
  );

  const { save } = useSaveForm({
    form: formName,
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} canUpdate={canUpdate} />;
};
