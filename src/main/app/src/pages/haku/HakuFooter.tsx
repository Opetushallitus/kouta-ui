import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useForm } from '#/src/hooks/form';
import { useSelector } from '#/src/hooks/reduxHooks';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { HakuModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createHaku } from '#/src/utils/haku/createHaku';
import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';
import { updateHaku } from '#/src/utils/haku/updateHaku';
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
  const navigate = useNavigate();
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

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(valuesForSaving),
        },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.HAKU, valuesForSaving.tila);
      }
      return { warnings: warnings };
    },
    [
      organisaatioOid,
      form.registeredFields,
      formMode,
      haku,
      navigate,
      initialValues,
      unregisteredFields,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateHakuForm,
  });

  return (
    <FormFooter
      hideEsikatselu
      entityType={ENTITY.HAKU}
      entity={haku}
      save={save}
      canUpdate={canUpdate}
    />
  );
};
