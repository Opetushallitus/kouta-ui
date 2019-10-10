import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import without from 'lodash/without';
import uniq from 'lodash/uniq';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps, isArray } from '../../utils';
import Box from '../Box';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import validateToteutusForm from '../../utils/validateToteutusForm';
import useSaveForm from '../useSaveForm';
import updateToteutus from '../../utils/kouta/updateToteutus';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { TOTEUTUS_ROLE } from '../../constants';
import iterateTree from '../../utils/iterateTree';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';

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
  history,
}) => {
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

  const { save } = useSaveForm({
    form: 'editToteutusForm',
    submit,
    validate: validateToteutusForm,
  });

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        disabled={!canUpdate}
        onClick={save}
        title={!canUpdate ? t('toteutuslomake.eiMuokkausOikeutta') : undefined}
        {...getTestIdProps('tallennaToteutusButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default withRouter(EditToteutusFooter);
