import React, { useCallback } from 'react';

import _ from 'lodash';
import { useHistory } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ORGANISAATIOTYYPPI, ENTITY } from '#/src/constants';
import { useFormName } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import updateKoulutus from '#/src/utils/koulutus/updateKoulutus';
import validateKoulutusForm from '#/src/utils/koulutus/validateKoulutusForm';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const EditKoulutusFooter = ({ koulutus, organisaatioOid, canUpdate }) => {
  const history = useHistory();

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: _.negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateKoulutus({
        httpClient,
        apiUrls,
        koulutus: _.omit(
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

      history.replace({
        state: {
          koulutusUpdatedAt: Date.now(),
        },
      });
    },
    [hierarkia, koulutus, history]
  );

  const formName = useFormName();
  const { save } = useSaveForm({
    form: formName,
    submit,
    validate: values =>
      validateKoulutusForm({
        organisaatioOid: koulutus.organisaatioOid,
        ...values,
      }),
  });

  return (
    <FormFooter entity={ENTITY.KOULUTUS} save={save} canUpdate={canUpdate} />
  );
};

export default EditKoulutusFooter;
