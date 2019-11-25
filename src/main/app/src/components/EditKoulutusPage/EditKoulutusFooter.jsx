import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import without from 'lodash/without';
import uniq from 'lodash/uniq';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps, isArray } from '../../utils';
import Box from '../Box';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import updateKoulutus from '../../utils/kouta/updateKoulutus';
import useSaveForm from '../useSaveForm';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { KOULUTUS_ROLE } from '../../constants';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import iterateTree from '../../utils/iterateTree';
import isOphOrganisaatio from "../../utils/isOphOrganisaatio";

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
    normalizedAvailableOids.includes(o),
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

const EditKoulutusFooter = ({ koulutus, organisaatioOid, history }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(koulutus.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const availableTarjoajaOids = useMemo(
    () => getAvailableTarjoajaOids(hierarkia),
    [hierarkia],
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
            availableTarjoajaOids,
          ),
        },
      });

      history.replace({
        state: {
          koulutusUpdatedAt: Date.now(),
        },
      });
    },
    [koulutus, history, availableTarjoajaOids],
  );

  const minTarjoajat = isOphOrganisaatio(koulutus.organisaatioOid) ? 0 : 1;

  const { save } = useSaveForm({
    form: 'editKoulutusForm',
    submit,
    validate: values => validateKoulutusForm({...values, minTarjoajat}),
  });

  return (
    <Box display="flex" justifyContent="flex-end">
      <Box>
        <Button
          disabled={!canUpdate}
          onClick={save}
          title={
            !canUpdate ? t('koulutuslomake.eiMuokkausOikeutta') : undefined
          }
          {...getTestIdProps('tallennaKoulutusButton')}
        >
          {t('yleiset.tallenna')}
        </Button>
      </Box>
    </Box>
  );
};

export default withRouter(EditKoulutusFooter);
