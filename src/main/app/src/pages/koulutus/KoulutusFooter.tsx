import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormMode, useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSelector } from '#/src/hooks/reduxHooks';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { KoulutusModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createKoulutus } from '#/src/utils/koulutus/createKoulutus';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import { updateKoulutus } from '#/src/utils/koulutus/updateKoulutus';
import { validateKoulutusForm } from '#/src/utils/koulutus/validateKoulutusForm';

type KoulutusFooterProps = {
  organisaatioOid: string;
  koulutus?: KoulutusModel;
  canUpdate?: boolean;
};

export const KoulutusFooter = ({
  organisaatioOid,
  koulutus,
  canUpdate,
}: KoulutusFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const formMode = useFormMode();
  const unregisteredFields = useSelector(state => state?.unregisteredFields);
  const initialValues = useSelector(state => state.form?.[formName]?.initial);

  const dataSendFn =
    formMode === FormMode.CREATE ? createKoulutus : updateKoulutus;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const valuesForSaving = getValuesForSaving(
        values,
        form.registeredFields,
        unregisteredFields,
        initialValues
      );
      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        koulutus:
          formMode === FormMode.CREATE
            ? {
                ...getKoulutusByFormValues(valuesForSaving),
              }
            : {
                ...koulutus,
                ...getKoulutusByFormValues(valuesForSaving),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`);
      } else {
        afterUpdate(
          queryClient,
          navigate,
          ENTITY.KOULUTUS,
          valuesForSaving.tila
        );
      }
      return { warnings: warnings };
    },
    [
      dataSendFn,
      form.registeredFields,
      formMode,
      navigate,
      initialValues,
      koulutus,
      organisaatioOid,
      unregisteredFields,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateKoulutusForm,
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.KOULUTUS}
      save={save}
      canUpdate={canUpdate}
      entity={koulutus}
      esikatseluUrl={
        FormMode.EDIT && apiUrls.url('konfo-ui.koulutus', koulutus?.oid)
      }
    />
  );
};

export default KoulutusFooter;
