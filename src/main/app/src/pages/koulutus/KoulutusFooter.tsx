import React, { useCallback } from 'react';

import _ from 'lodash';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ORGANISAATIOTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
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

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: _.negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const dataSendFn =
    formMode === FormMode.CREATE ? createKoulutus : updateKoulutus;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await dataSendFn({
        httpClient,
        apiUrls,
        koulutus:
          formMode === FormMode.CREATE
            ? {
                ...getKoulutusByFormValues(values),
                organisaatioOid,
              }
            : _.omit(
                {
                  ...koulutus,
                  ...getKoulutusByFormValues(values),
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
        queryCache.invalidateQueries(ENTITY.KOULUTUS);
      }
    },
    [dataSendFn, formMode, hierarkia, history, koulutus, organisaatioOid]
  );

  const formName = useFormName();
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
