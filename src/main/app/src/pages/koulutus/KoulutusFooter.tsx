import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormMode, useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue, useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { HttpClient } from '#/src/httpClient';
import { KoulutusModel } from '#/src/types/domainTypes';
import { KoulutusFormValues } from '#/src/types/koulutusTypes';
import { ApiUrls } from '#/src/urls';
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
  // Oletus TÄSSÄ, ei pelkästään FormFooterissa. Create-sivu ei anna canUpdatea, ja
  // lauseke canUpdate || isJulkinen muuttaisi undefinedin falseksi heti kun julkinen on
  // false - FormFooterin oletusparametri laukeaa vain undefinedille.
  canUpdate = true,
}: KoulutusFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // julkinen luetaan TÄSSÄ eikä sivulta. EditKoulutusPage luki sen aiemmin lomakkeen
  // ULKOPUOLELTA, mikä toimi vain koska redux-formin tila oli globaali.
  // react-final-formissa tila asuu lomakkeessa, joten lukijan pitää olla sen sisällä.
  const isJulkinen = useFieldValue<boolean>('julkinen');
  const form = useForm();
  const formName = useFormName();
  const formMode = useFormMode();
  const initialValues = form.initial;

  const dataSendFn =
    formMode === FormMode.CREATE ? createKoulutus : updateKoulutus;

  const submit = useCallback(
    async ({
      values,
      httpClient,
      apiUrls,
    }: {
      values: KoulutusFormValues;
      httpClient: HttpClient;
      apiUrls: ApiUrls;
    }) => {
      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        koulutus:
          formMode === FormMode.CREATE
            ? {
                ...getKoulutusByFormValues(valuesToSend),
              }
            : {
                ...koulutus,
                ...getKoulutusByFormValues(valuesToSend),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.KOULUTUS, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      dataSendFn,
      form, // getterit, ks. useForm
      formMode,
      navigate,
      initialValues,
      koulutus,
      organisaatioOid,
      queryClient,
    ]
  );

  useSaveForm({
    formName,
    submit,
    validate: validateKoulutusForm,
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.KOULUTUS}
      canUpdate={canUpdate || isJulkinen}
      entity={koulutus}
      esikatseluUrl={
        formMode === FormMode.EDIT
          ? apiUrls.url('konfo-ui.koulutus', koulutus?.oid)
          : undefined
      }
    />
  );
};

export default KoulutusFooter;
