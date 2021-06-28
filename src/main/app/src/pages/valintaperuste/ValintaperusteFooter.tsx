import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createValintaperuste from '#/src/utils/valintaperuste/createValintaperuste';
import { getValintaperusteByFormValues } from '#/src/utils/valintaperuste/getValintaperusteByFormValues';
import updateValintaperuste from '#/src/utils/valintaperuste/updateValintaperuste';
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
  const history = useHistory();
  const queryClient = useQueryClient();
  const form = useForm();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE
          ? createValintaperuste
          : updateValintaperuste;

      const { id } = await dataSendFn({
        httpClient,
        apiUrls,
        valintaperuste: {
          organisaatioOid,
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
        },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`
        );
      } else {
        queryClient.invalidateQueries(ENTITY.VALINTAPERUSTE);
      }
    },
    [formMode, organisaatioOid, valintaperuste, history, queryClient]
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

  return (
    <FormFooter
      entity={ENTITY.VALINTAPERUSTE}
      save={save}
      canUpdate={canUpdate}
    />
  );
};
