import React from 'react';

import { useTranslation } from 'react-i18next';

import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import {
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { searchToteutukset } from '#/src/utils/toteutus/searchToteutukset';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import { KoulutusModal } from './KoulutusModal';

const { TOTEUTUS } = ENTITY;

const makeTableColumns = (t, organisaatioOid) => [
  makeNimiColumn(t, {
    getLinkUrl: ({ oid }) =>
      `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
  }),
  makeKoulutustyyppiColumn(t),
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: t('etusivu.kiinnitetytHakukohteet'),
    key: 'hakukohteet',
    render: ({ hakukohdeCount = 0 }) => (
      <Badge color="primary">{hakukohdeCount}</Badge>
    ),
  },
];

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <KoulutusModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('yleiset.luoUusiToteutus')}</Button>
    </>
  );
};

const ToteutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  return (
    <>
      <NavigationAnchor id="toteutukset" />
      <ListCollapse
        icon={ICONS[TOTEUTUS]}
        header={t('yleiset.toteutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchToteutukset}
          organisaatioOid={organisaatioOid}
          entityType={TOTEUTUS}
          makeTableColumns={makeTableColumns}
          nimiPlaceholder={t('etusivu.haeToteutuksia')}
        />
      </ListCollapse>
    </>
  );
};

export default ToteutuksetSection;
