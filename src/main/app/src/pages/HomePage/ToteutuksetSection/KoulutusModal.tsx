import React, { useCallback, useMemo } from 'react';

import { isFuture } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { EntityModal } from '#/src/components/EntityModal';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useSearchAllKoulutuksetWithOid } from '#/src/utils/koulutus/searchKoulutukset';

const getEntitySuffix = e =>
  e.eperuste ? ` - ${e.eperuste.diaarinumero}` : '';

export const KoulutusModal = ({ onClose, organisaatioOid, open }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { data } = useSearchAllKoulutuksetWithOid({
    organisaatioOid,
  });

  const filteredResults = useMemo(
    () =>
      data?.result.filter(
        k =>
          !k.eperuste?.voimassaoloLoppuu ||
          isFuture(new Date(k.eperuste?.voimassaoloLoppuu))
      ),
    [data]
  );

  const options = useEntityOptions(filteredResults, getEntitySuffix);

  const onSubmit = useCallback(
    ({ oid }) => {
      history.push(`/organisaatio/${organisaatioOid}/koulutus/${oid}/toteutus`);
    },
    [history, organisaatioOid]
  );

  return (
    <EntityModal
      labelText={t('etusivu.toteutuksenKoulutus')}
      headerText={t('etusivu.valitseToteutuksenKoulutus')}
      submitText={t('yleiset.luoUusiToteutus')}
      options={options}
      onSubmit={onSubmit}
      onClose={onClose}
      open={open}
    />
  );
};
