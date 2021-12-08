import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode, KOULUTUSTYYPPI } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue, useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { KoulutusModel } from '#/src/types/koulutusTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { getValuesForSaving } from '#/src/utils';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import { postUpdate } from '#/src/utils/postUpdate';
import createToteutus from '#/src/utils/toteutus/createToteutus';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import updateToteutus from '#/src/utils/toteutus/updateToteutus';
import { validateToteutusForm } from '#/src/utils/toteutus/validateToteutusForm';

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
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const history = useHistory();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  const unregisteredFields = useSelector(state => state?.unregisteredFields);
  const initialValues = useSelector(state => state.form?.[formName]?.initial);

  const dataSendFn =
    formMode === FormMode.CREATE ? createToteutus : updateToteutus;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const valuesForSaving = getValuesForSaving(
        values,
        form.registeredFields,
        unregisteredFields,
        initialValues
      );
      const { oid } = await dataSendFn({
        httpClient,
        apiUrls,
        toteutus:
          formMode === FormMode.CREATE
            ? {
                ...getToteutusByFormValues({
                  ...valuesForSaving,
                  koulutustyyppi,
                }),
                organisaatioOid,
                koulutusOid: koulutus?.oid,
              }
            : {
                ...toteutus,
                ...getToteutusByFormValues({
                  ...valuesForSaving,
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
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`
        );
      } else {
        postUpdate(queryClient, history, ENTITY.TOTEUTUS, valuesForSaving.tila);
      }
    },
    [
      dataSendFn,
      form.registeredFields,
      formMode,
      hierarkia,
      history,
      initialValues,
      koulutus,
      koulutustyyppi,
      organisaatioOid,
      toteutus,
      unregisteredFields,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: values =>
      validateToteutusForm(
        { ...values, koulutustyyppi, koulutus },
        form?.registeredFields
      ),
  });

  const apiUrls = useUrls();
  const name = useFieldValue('tiedot.nimi');

  return (
    <FormFooter
      entityType={ENTITY.TOTEUTUS}
      entity={toteutus}
      entityName={name}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={
        formMode === FormMode.EDIT &&
        apiUrls.url('konfo-ui.toteutus', toteutus?.oid)
      }
    />
  );
};
