import React, { useMemo } from 'react';

import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import {
  makeHakuColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
import { filterService } from '#/src/hooks/useFilter';
import useModal from '#/src/hooks/useModal';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
      }),
      makeHakuColumn(t, {
        getLinkUrl: ({ hakuOid }) =>
          `/organisaatio/${organisaatioOid}/haku/${hakuOid}/muokkaus/`,
      }),
      makeKoulutustyyppiColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
    ],
    [t, organisaatioOid]
  );

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
  const [state, send] = useActor(filterService);

  const filterState = useFilterState(HAKUKOHDE, state, send);

  const columns = useTableColumns(t, organisaatioOid);
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
          columns={columns}
          nimiPlaceholder={t('etusivu.haeHakukohteita')}
          filterState={filterState}
        />
      </ListCollapse>
    </>
  );
};

export default HakukohteetSection;
