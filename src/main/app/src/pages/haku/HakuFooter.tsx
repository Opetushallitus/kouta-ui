import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useForm } from '#/src/hooks/form';
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

  const initialValues = form.initial;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn = formMode === FormMode.CREATE ? createHaku : updateHaku;

      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(valuesToSend),
        },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.HAKU, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      organisaatioOid,
      form, // getterit, ks. useForm
      formMode,
      haku,
      navigate,
      initialValues,
      queryClient,
    ]
  );

  useSaveForm({
    formName,
    submit,
    validate: validateHakuForm,
  });

  return (
    <FormFooter
      hideEsikatselu
      entityType={ENTITY.HAKU}
      entity={haku}
      canUpdate={canUpdate}
    />
  );
};
