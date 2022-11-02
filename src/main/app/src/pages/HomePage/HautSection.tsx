import React, { useMemo } from 'react';

import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '#/src/components/Button';
import {
  makeCountColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
  makeHakutapaColumn,
  makeKoulutuksenAlkamiskausiColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
import { filterService } from '#/src/hooks/useFilter';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHaut } from '#/src/utils/haku/searchHaut';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';

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

  const [state, send] = useActor(filterService);

  const filterState = useFilterState(HAKU, state, send);

  return (
    <>
      <NavigationAnchor id="haut" />
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
        />
      </ListCollapse>
    </>
  );
};

export default HautSection;
