import React, { useCallback } from 'react';

import _ from 'lodash';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode, KOULUTUSTYYPPI } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { KoulutusModel, ToteutusModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import { createToteutus } from '#/src/utils/toteutus/createToteutus';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import { updateToteutus } from '#/src/utils/toteutus/updateToteutus';
import { validateToteutusForm } from '#/src/utils/toteutus/validateToteutusForm';

import { useTarjoajatHierarkia } from './useTarjoajatHierarkia';

type ToteutusFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  koulutustyyppi: KOULUTUSTYYPPI;
  toteutus?: ToteutusModel;
  koulutus?: KoulutusModel;
  canUpdate?: boolean;
};

export const ToteutusFooter = ({
  formMode,
  toteutus,
  koulutustyyppi,
  organisaatioOid,
  koulutus,
  canUpdate,
}: ToteutusFooterProps) => {
  const { hierarkia = [] } = useTarjoajatHierarkia(
    organisaatioOid,
    toteutus?.tarjoajat
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const initialValues = form.initial;

  const dataSendFn =
    formMode === FormMode.CREATE ? createToteutus : updateToteutus;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        toteutus:
          formMode === FormMode.CREATE
            ? {
                ...getToteutusByFormValues({
                  ...valuesToSend,
                  koulutustyyppi,
                }),
                koulutusOid: koulutus?.oid,
              }
            : {
                ..._.omit(toteutus, '_enrichedData'),
                ...getToteutusByFormValues({
                  ...valuesToSend,
                  koulutustyyppi,
                }),
                tarjoajat: getTarjoajaOids({
                  hierarkia,
                  existingTarjoajat: toteutus?.tarjoajat,
                  newTarjoajat: values?.tarjoajat,
                }),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.TOTEUTUS, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      dataSendFn,
      form, // getterit, ks. useForm
      formMode,
      hierarkia,
      navigate,
      initialValues,
      koulutus,
      koulutustyyppi,
      organisaatioOid,
      toteutus,
      queryClient,
    ]
  );

  const validate = useCallback(
    (values, registeredFields) =>
      validateToteutusForm(
        { ...values, koulutustyyppi, koulutus },
        registeredFields
      ),
    [koulutustyyppi, koulutus]
  );

  useSaveForm({ formName, submit, validate });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.TOTEUTUS}
      entity={toteutus}
      canUpdate={canUpdate}
      esikatseluUrl={
        formMode === FormMode.EDIT &&
        apiUrls.url('konfo-ui.toteutus', toteutus?.oid)
      }
    />
  );
};
