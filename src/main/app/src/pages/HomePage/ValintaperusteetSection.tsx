import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '#/src/components/Button';
import {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
import { searchValintaperusteet } from '#/src/utils/valintaperuste/searchValintaperusteet';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';

const { VALINTAPERUSTE } = ENTITY;

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button
      as={Link}
      to={`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/`}
    >
      {t('yleiset.luoUusiValintaperuste')}
    </Button>
  );
};

const makeTableColumns = (t, organisaatioOid) => [
  makeNimiColumn(t, {
    getLinkUrl: ({ id }) =>
      `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`,
  }),
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const ValintaperusteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  return (
    <>
      <NavigationAnchor id="valintaperusteet" />
      <ListCollapse
        icon={ICONS[VALINTAPERUSTE]}
        header={t('yleiset.valintaperusteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchValintaperusteet}
          organisaatioOid={organisaatioOid}
          entityType={VALINTAPERUSTE}
          makeTableColumns={makeTableColumns}
          nimiPlaceholder={t('etusivu.haeValintaperusteita')}
        />
      </ListCollapse>
    </>
  );
};

export default ValintaperusteetSection;
