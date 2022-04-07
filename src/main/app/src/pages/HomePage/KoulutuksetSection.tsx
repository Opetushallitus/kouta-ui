import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import {
  makeJulkinenColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
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
      {
        title: t('etusivu.kiinnitetytToteutukset'),
        key: 'toteutukset',
        render: ({ toteutusCount = 0 }) => (
          <Badge color="primary">{toteutusCount}</Badge>
        ),
      },
      makeJulkinenColumn(t),
    ],
    [t, organisaatioOid]
  );

export const KoulutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const columns = useTableColumns(t, organisaatioOid);
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
        />
      </ListCollapse>
    </>
  );
};
