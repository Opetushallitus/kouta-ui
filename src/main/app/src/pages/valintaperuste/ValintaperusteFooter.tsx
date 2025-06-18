import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createValintaperuste } from '#/src/utils/valintaperuste/createValintaperuste';
import { getValintaperusteByFormValues } from '#/src/utils/valintaperuste/getValintaperusteByFormValues';
import { updateValintaperuste } from '#/src/utils/valintaperuste/updateValintaperuste';
import { validateValintaperusteForm } from '#/src/utils/valintaperuste/validateValintaperusteForm';

type ValintaperusteFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  valintaperuste?: any;
  canUpdate?: boolean;
};

export const ValintaperusteFooter = ({
  formMode,
  organisaatioOid,
  valintaperuste = {},
  canUpdate,
}: ValintaperusteFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE
          ? createValintaperuste
          : updateValintaperuste;

      const { id, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        valintaperuste:
          formMode === FormMode.CREATE
            ? {
                ...valintaperuste,
                ...getValintaperusteByFormValues(values),
              }
            : {
                ...valintaperuste,
                ...getValintaperusteByFormValues(values),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(
          `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`
        );
      } else {
        afterUpdate(queryClient, navigate, ENTITY.VALINTAPERUSTE, values.tila);
      }
      return { warnings: warnings };
    },
    [formMode, organisaatioOid, valintaperuste, navigate, queryClient]
  );

  const formName = useFormName();

  const save = useSaveForm({
    formName,
    submit,
    validate: values =>
      validateValintaperusteForm(
        {
          organisaatioOid,
          ...values,
        },
        form.registeredFields
      ),
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.VALINTAPERUSTE}
      entity={valintaperuste}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={apiUrls.url('konfo-ui.valintaperuste', valintaperuste?.id)}
    />
  );
};
