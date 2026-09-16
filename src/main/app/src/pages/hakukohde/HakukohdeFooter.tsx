import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import {
  ToteutusModel,
  HakuModel,
  HakukohdeModel,
} from '#/src/types/domainTypes';
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
  haku?: HakuModel;
  toteutus?: ToteutusModel;
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const initialValues = form.initial;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE ? createHakukohde : updateHakukohde;

      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        hakukohde:
          formMode === FormMode.CREATE
            ? {
                ...getHakukohdeByFormValues(valuesToSend),
                hakuOid: haku?.oid,
                toteutusOid: toteutus?.oid,
              }
            : {
                ...hakukohde,
                ...getHakukohdeByFormValues(valuesToSend),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.HAKUKOHDE, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      organisaatioOid,
      form, // getterit, ks. useForm
      formMode,
      haku,
      hakukohde,
      navigate,
      initialValues,
      toteutus,
      queryClient,
    ]
  );

  useSaveForm({
    formName,
    submit,
    validate: validateHakukohdeForm(koulutustyyppi),
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.HAKUKOHDE}
      entity={hakukohde}
      canUpdate={canUpdate}
      esikatseluUrl={apiUrls.url('konfo-ui.toteutus', hakukohde?.toteutusOid)}
      infoTextTranslationKey={infoTextTranslationKey}
    />
  );
};
