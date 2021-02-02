import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';

import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import { getHakukohdeByFormValues } from '#/src/utils/hakukohde/getHakukohdeByFormValues';
import updateHakukohde from '#/src/utils/hakukohde/updateHakukohde';
import { ENTITY, FormMode } from '#/src/constants';
import { FormFooter } from '#/src/components/FormPage';
import { useForm, useFormName } from '#/src/hooks/form';
import { HakuModel } from '#/src/types/hakuTypes';
import { HakukohdeModel } from '#/src/types/hakukohdeTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import createHakukohde from '#/src/utils/hakukohde/createHakukohde';
import { getValuesForSaving } from '#/src/utils';

type HakukohdeFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  hakukohde?: HakukohdeModel;
  haku: HakuModel;
  toteutus: ToteutusModel;
  canUpdate?: boolean;
};

export const HakukohdeFooter = ({
  formMode,
  organisaatioOid,
  hakukohde = {},
  haku,
  toteutus,
  canUpdate,
}: HakukohdeFooterProps) => {
  const history = useHistory();

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
        queryCache.invalidateQueries(ENTITY.HAKUKOHDE);
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
    ]
  );

  const save = useSaveHakukohde({ submit, haku, toteutus, formName });

  return (
    <FormFooter entity={ENTITY.HAKUKOHDE} save={save} canUpdate={canUpdate} />
  );
};
