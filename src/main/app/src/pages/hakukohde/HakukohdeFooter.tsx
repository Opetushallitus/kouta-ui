import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { HakukohdeModel } from '#/src/types/hakukohdeTypes';
import { HakuModel } from '#/src/types/hakuTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createHakukohde } from '#/src/utils/hakukohde/createHakukohde';
import { getHakukohdeByFormValues } from '#/src/utils/hakukohde/getHakukohdeByFormValues';
import { updateHakukohde } from '#/src/utils/hakukohde/updateHakukohde';
import { validateHakukohdeForm } from '#/src/utils/hakukohde/validateHakukohdeForm';

type HakukohdeFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  hakukohde?: HakukohdeModel;
  koulutustyyppi: string;
  haku: HakuModel;
  toteutus: ToteutusModel;
  canUpdate?: boolean;
  infoTextTranslationKey?: string;
};

export const HakukohdeFooter = ({
  formMode,
  organisaatioOid,
  hakukohde = {},
  koulutustyyppi,
  haku,
  toteutus,
  canUpdate,
  infoTextTranslationKey,
}: HakukohdeFooterProps) => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const unregisteredFields = useSelector(state => state?.unregisteredFields);
  const initialValues = useSelector(state => state.form?.[formName]?.initial);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE ? createHakukohde : updateHakukohde;

      const valuesForSaving = getValuesForSaving(
        values,
        form.registeredFields,
        unregisteredFields,
        initialValues
      );

      const { oid } = await dataSendFn({
        httpClient,
        apiUrls,
        hakukohde:
          formMode === FormMode.CREATE
            ? {
                ...getHakukohdeByFormValues(valuesForSaving),
                organisaatioOid,
                hakuOid: haku?.oid,
                toteutusOid: toteutus?.oid,
              }
            : {
                ...hakukohde,
                ...getHakukohdeByFormValues(valuesForSaving),
              },
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`
        );
      } else {
        afterUpdate(
          queryClient,
          history,
          ENTITY.HAKUKOHDE,
          valuesForSaving.tila
        );
      }
    },
    [
      organisaatioOid,
      form.registeredFields,
      formMode,
      haku,
      hakukohde,
      history,
      initialValues,
      toteutus,
      unregisteredFields,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateHakukohdeForm(koulutustyyppi),
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.HAKUKOHDE}
      entity={hakukohde}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={apiUrls.url('konfo-ui.toteutus', hakukohde?.toteutusOid)}
      infoTextTranslationKey={infoTextTranslationKey}
    />
  );
};
