import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
  makeHakutapaColumn,
  makeKoulutuksenAlkamiskausiColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
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

const makeTableColumns = (t, organisaatioOid) => [
  makeNimiColumn(t, {
    getLinkUrl: ({ oid }) =>
      `/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`,
  }),
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  makeHakutapaColumn(t),
  makeKoulutuksenAlkamiskausiColumn(t),
  {
    title: t('etusivu.kiinnitetytHakukohteet'),
    key: 'hakukohteet',
    render: ({ hakukohdeCount = 0 }) => (
      <Badge color="primary">{hakukohdeCount}</Badge>
    ),
  },
];

const HautSection = ({ organisaatioOid, canCreate }) => {
  const { t } = useTranslation();

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
          makeTableColumns={makeTableColumns}
          nimiPlaceholder={t('etusivu.haeHakuja')}
        />
      </ListCollapse>
    </>
  );
};

export default HautSection;
