import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray, uniq, without, negate } from 'lodash';

import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import updateKoulutus from '../../utils/kouta/updateKoulutus';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { KOULUTUS_ROLE, ORGANISAATIOTYYPPI, ENTITY } from '#/src/constants';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import iterateTree from '../../utils/iterateTree';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatioService/organisaatioMatchesTyyppi';
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

const mergeTarjoajat = (koulutusOids, valueOids, availableOids) => {
  const { inserted, deleted } = getTarjoajaOperations(availableOids, valueOids);

  return uniq(without([...(koulutusOids || []), ...inserted], ...deleted));
};

const EditKoulutusFooter = ({ koulutus, organisaatioOid }) => {
  const history = useHistory();
  const { organisaatio } = useOrganisaatio(koulutus.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

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
        koulutus: {
          ...koulutus,
          ...getKoulutusByFormValues(values),
          tarjoajat: mergeTarjoajat(
            koulutus.tarjoajat,
            values.tarjoajat,
            availableTarjoajaOids
          ),
        },
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
