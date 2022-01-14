import React from 'react';

import { useTranslation } from 'react-i18next';

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
import { searchHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const makeTableColumns = (t, organisaatioOid) => [
  makeNimiColumn(t, {
    getLinkUrl: ({ oid }) =>
      `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
  }),
  makeKoulutustyyppiColumn(t),
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <LiitoksetModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('yleiset.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  return (
    <>
      <NavigationAnchor id="hakukohteet" />
      <ListCollapse
        icon={ICONS[HAKUKOHDE]}
        header={t('yleiset.hakukohteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchHakukohteet}
          organisaatioOid={organisaatioOid}
          entityType={HAKUKOHDE}
          makeTableColumns={makeTableColumns}
          nimiPlaceholder={t('etusivu.haeHakukohteita')}
        />
      </ListCollapse>
    </>
  );
};

export default HakukohteetSection;
