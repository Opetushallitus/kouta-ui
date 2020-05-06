import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { isArray, uniq, without } from 'lodash';
import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import updateToteutus from '../../utils/kouta/updateToteutus';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { TOTEUTUS_ROLE } from '../../constants';
import iterateTree from '../../utils/iterateTree';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { useSaveToteutus } from '#/src/hooks/formSaveHooks';

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

const EditToteutusFooter = ({
  toteutus,
  koulutustyyppi,
  organisaatioOid,
  koulutus,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(toteutus.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const availableTarjoajaOids = useMemo(
    () => getAvailableTarjoajaOids(hierarkia),
    [hierarkia],
  );

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(TOTEUTUS_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...toteutus,
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
          tarjoajat: mergeTarjoajat(
            toteutus.tarjoajat,
            values.tarjoajat,
            availableTarjoajaOids,
          ),
        },
      });

      history.replace({
        state: {
          toteutusUpdatedAt: Date.now(),
        },
      });
    },
    [toteutus, history, koulutustyyppi, availableTarjoajaOids],
  );

  const save = useSaveToteutus(submit, { koulutustyyppi, koulutus });

  return (
    <Box display="flex" justifyContent="flex-end">
      <Submit
        disabled={!canUpdate}
        onClick={save}
        title={!canUpdate ? t('toteutuslomake.eiMuokkausOikeutta') : undefined}
        {...getTestIdProps('tallennaToteutusButton')}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Box>
  );
};

export default EditToteutusFooter;
