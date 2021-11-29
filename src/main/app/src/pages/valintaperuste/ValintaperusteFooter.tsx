import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue, useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import { postUpdate } from '#/src/utils/postUpdate';
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
        valintaperuste:
          formMode === FormMode.CREATE
            ? {
                ...valintaperuste,
                ...getValintaperusteByFormValues(values),
                organisaatioOid,
              }
            : {
                ...valintaperuste,
                ...getValintaperusteByFormValues(values),
              },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`
        );
      } else {
        postUpdate(queryClient, history, ENTITY.VALINTAPERUSTE, values.tila);
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

  const apiUrls = useUrls();
  const name = useFieldValue('kuvaus.nimi');

  return (
    <FormFooter
      entityType={ENTITY.VALINTAPERUSTE}
      entity={valintaperuste}
      entityName={name}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={apiUrls.url('konfo-ui.valintaperuste', valintaperuste?.id)}
    />
  );
};
