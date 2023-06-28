import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  makeCountColumn,
  makeJulkinenColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Button } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import { koulutusService } from '#/src/machines/filterMachines';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchKoulutukset } from '#/src/utils/koulutus/searchKoulutukset';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';

const { KOULUTUS } = ENTITY;

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/koulutus`}>
      {t('yleiset.luoUusiKoulutus')}
    </Button>
  );
};

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`,
      }),
      makeKoulutustyyppiColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
      makeCountColumn({
        title: t('etusivu.kiinnitetytToteutukset'),
        key: 'toteutukset',
        propName: 'toteutusCount',
      }),
      makeJulkinenColumn(t),
    ],
    [t, organisaatioOid]
  );

export const KoulutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const columns = useTableColumns(t, organisaatioOid);

  const filterState = useFilterState(KOULUTUS, koulutusService);
  return (
    <>
      <NavigationAnchor id="koulutukset" />
      <ListCollapse
        icon={ICONS[KOULUTUS]}
        header={t('yleiset.koulutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchKoulutukset}
          organisaatioOid={organisaatioOid}
          entityType={KOULUTUS}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeKoulutuksia')}
          filterState={filterState}
          searchPage="homepage.koulutukset"
        />
      </ListCollapse>
    </>
  );
};
