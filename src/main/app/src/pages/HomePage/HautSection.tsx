import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  makeCountColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
  makeHakutapaColumn,
  makeKoulutuksenAlkamiskausiColumn,
} from '#/src/components/ListTable';
import { Button } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { hakuService } from '#/src/machines/filterMachines';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHaut } from '#/src/utils/haku/searchHaut';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';

const { HAKU } = ENTITY;

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/haku`}>
      {t('yleiset.luoUusiHaku')}
    </Button>
  );
};

const useTableColumns = (t, organisaatioOid, userLanguage) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`,
      }),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
      makeHakutapaColumn(t, userLanguage),
      makeKoulutuksenAlkamiskausiColumn(t, userLanguage),
      makeCountColumn({
        title: t('etusivu.kiinnitetytHakukohteet'),
        key: 'hakukohteet',
        propName: 'hakukohdeCount',
      }),
    ],
    [t, organisaatioOid, userLanguage]
  );

const HautSection = ({ organisaatioOid, canCreate }) => {
  const { t } = useTranslation();

  const userLanguage = useUserLanguage();

  const columns = useTableColumns(t, organisaatioOid, userLanguage);

  const filterState = useFilterState(HAKU, hakuService);

  return (
    <div id="haut" data-test-id="hautSection">
      <ListCollapse
        icon={ICONS[HAKU]}
        header={t('yleiset.haut')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchHaut}
          organisaatioOid={organisaatioOid}
          entityType={HAKU}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeHakuja')}
          filterState={filterState}
          searchPage="homepage.haut"
        />
      </ListCollapse>
    </div>
  );
};

export default HautSection;
