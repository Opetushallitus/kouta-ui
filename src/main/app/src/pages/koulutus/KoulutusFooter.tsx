import React, { useCallback } from 'react';

import _ from 'lodash';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ORGANISAATIOTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormNameContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getValuesForSaving } from '#/src/utils';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import createKoulutus from '#/src/utils/koulutus/createKoulutus';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import updateKoulutus from '#/src/utils/koulutus/updateKoulutus';
import validateKoulutusForm from '#/src/utils/koulutus/validateKoulutusForm';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

type KoulutusFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  koulutus?: KoulutusModel;
  canUpdate?: boolean;
};

export const KoulutusFooter = ({
  formMode,
  organisaatioOid,
  koulutus,
  canUpdate,
}: KoulutusFooterProps) => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: _.negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const form = useForm();
  const formName = useFormName();
  const unregisteredFields = useSelector(state => state?.unregisteredFields);
  const initialValues = useSelector(state => state.form?.[formName]?.initial);

  const dataSendFn =
    formMode === FormMode.CREATE ? createKoulutus : updateKoulutus;

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
        koulutus:
          formMode === FormMode.CREATE
            ? {
                ...getKoulutusByFormValues(valuesForSaving),
                organisaatioOid,
              }
            : _.omit(
                {
                  ...koulutus,
                  ...getKoulutusByFormValues(valuesForSaving),
                  tarjoajat: getTarjoajaOids({
                    hierarkia,
                    existingTarjoajat: koulutus.tarjoajat,
                    newTarjoajat: values?.tarjoajat?.tarjoajat,
                  }),
                  // This is a workaround for updating tarjoajat. Muokkaaja-field shouldn't be needed anymore
                  // but backend requires it when creating new ones.
                  // TODO: Remove this when backend works without muokkaaja
                  muokkaaja: koulutus?.muokkaaja,
                },
                // modified-field also prevented updating tarjoajat, this is a workaround. See above.
                'modified'
              ),
      });

      if (formMode === FormMode.CREATE) {
        history.push(
          `/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`
        );
      } else {
        queryClient.invalidateQueries(ENTITY.KOULUTUS);
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
      organisaatioOid,
      unregisteredFields,
      queryClient,
    ]
  );

  const { save } = useSaveForm({
    form: formName,
    submit,
    validate: values =>
      validateKoulutusForm({
        organisaatioOid,
        ...values,
      }),
  });

  return (
    <FormFooter entity={ENTITY.KOULUTUS} save={save} canUpdate={canUpdate} />
  );
};

export default KoulutusFooter;
