import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray, uniq, without, negate, omit } from 'lodash';

import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import updateKoulutus from '#/src/utils/koulutus/updateKoulutus';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateKoulutusForm from '#/src/utils/koulutus/validateKoulutusForm';
import { ORGANISAATIOTYYPPI, ENTITY } from '#/src/constants';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { FormFooter } from '#/src/components/FormPage';
import { useFormName } from '#/src/hooks/form';

const getAvailableTarjoajaOids = hierarkia => {
  const oids = [];

  iterateTree(hierarkia, ({ oid }) => {
    oid && oids.push(oid);
  });

  return oids;
};

const getTarjoajaOperations = (availableOids, oids) => {
  const normalizedOids = isArray(oids) ? oids : [];
  const normalizedAvailableOids = isArray(availableOids) ? availableOids : [];

  const inserted = normalizedOids.filter(o =>
    normalizedAvailableOids.includes(o)
  );

  return {
    inserted,
    deleted: without(availableOids, ...inserted),
  };
};

const mergeTarjoajat = (koulutusOids = [], valueOids, availableOids) => {
  const { inserted, deleted } = getTarjoajaOperations(availableOids, valueOids);
  return uniq(without([...koulutusOids, ...inserted], ...deleted));
};

const EditKoulutusFooter = ({ koulutus, organisaatioOid, canUpdate }) => {
  const history = useHistory();

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const availableTarjoajaOids = useMemo(
    () => getAvailableTarjoajaOids(hierarkia),
    [hierarkia]
  );

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateKoulutus({
        httpClient,
        apiUrls,
        koulutus: omit(
          {
            ...koulutus,
            ...getKoulutusByFormValues(values),
            tarjoajat: mergeTarjoajat(
              koulutus.tarjoajat,
              values?.tarjoajat?.tarjoajat,
              availableTarjoajaOids
            ),
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
    [koulutus, history, availableTarjoajaOids]
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
