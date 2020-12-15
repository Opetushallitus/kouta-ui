import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import updateToteutus from '#/src/utils/toteutus/updateToteutus';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';
import { useForm, useFormName } from '#/src/hooks/form';
import { ENTITY, FormMode } from '#/src/constants';
import { queryCache } from 'react-query';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import { getValuesForSaving } from '#/src/utils';
import createToteutus from '#/src/utils/toteutus/createToteutus';

export const ToteutusFooter = ({
  formMode,
  toteutus,
  koulutustyyppi,
  organisaatioOid,
  koulutus,
  canUpdate,
}) => {
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const history = useHistory();

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
        queryCache.invalidateQueries(ENTITY.TOTEUTUS);
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
    ]
  );

  const save = useSaveToteutus({
    formName,
    koulutustyyppi,
    koulutus,
    submit,
  });

  return (
    <FormFooter entity={ENTITY.TOTEUTUS} save={save} canUpdate={canUpdate} />
  );
};
