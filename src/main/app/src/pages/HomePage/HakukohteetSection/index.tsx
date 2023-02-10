import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { hakukohdeService } from '#/src/machines/filterMachines';
import { EntityListActionBar } from '#/src/pages/HomePage/EntityListActionBar';
import { useChangeHakukohteetTilaMutation } from '#/src/pages/HomePage/HakukohteetSection/changeHakukohteetState';
import { createHakukohdeListColumns } from '#/src/pages/HomePage/HakukohteetSection/createHakukohdeListColumns';
import {
  StateChangeConfirmationModal,
  StateChangeConfirmationWrapper,
  useStateChangeConfirmationModal,
} from '#/src/pages/HomePage/StateChangeConfirmationModal';
import { StateChangeResultModal } from '#/src/pages/HomePage/StateChangeResultModal';
import {
  SERVICE_BY_ENTITY,
  useEntitySelection,
} from '#/src/pages/HomePage/useEntitySelection';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const HakukohdeActionBar = () => {
  const { selection } = useEntitySelection(HAKUKOHDE);
  const { openModal, tila } = useStateChangeConfirmationModal();

  const changeTila = useCallback(
    tila => {
      if (tila !== null && !_.isEmpty(selection)) {
        openModal({ tila, entities: selection });
      }
    },
    [selection, openModal]
  );

  return (
    <EntityListActionBar
      entityType={HAKUKOHDE}
      changeTila={changeTila}
      tila={tila}
    />
  );
};

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

export const createGetHakukohdeLinkUrl = organisaatioOid => oid =>
  `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`;

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () =>
      createHakukohdeListColumns(
        t,
        organisaatioOid
      )(SERVICE_BY_ENTITY[HAKUKOHDE]),
    [t, organisaatioOid]
  );

  const createColumnsForConfirmationModal = useMemo(
    () => createHakukohdeListColumns(t, organisaatioOid),
    [t, organisaatioOid]
  );

  const tilaMutationResult = useChangeHakukohteetTilaMutation();

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  return tilaMutationResult.isLoading ? (
    <OverlaySpin text={t('etusivu.hakukohde.tilaaVaihdetaan')} />
  ) : (
    <StateChangeConfirmationWrapper>
      <StateChangeConfirmationModal
        startBatchMutation={tilaMutationResult.mutate}
        headerText={t('etusivu.hakukohde.vahvistaTilanmuutosOtsikko')}
        createColumns={createColumnsForConfirmationModal}
      />
      <StateChangeResultModal
        entityType={HAKUKOHDE}
        headerText={t('etusivu.hakukohde.tilamuutosTuloksetOtsikko')}
        mutationResult={tilaMutationResult}
        getLinkUrl={createGetHakukohdeLinkUrl(organisaatioOid)}
      />
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
          ActionBar={HakukohdeActionBar}
          searchEntities={searchHakukohteet}
          organisaatioOid={organisaatioOid}
          entityType={HAKUKOHDE}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeHakukohteita')}
          filterState={filterState}
          searchPage="homepage.hakukohteet"
        />
      </ListCollapse>
    </StateChangeConfirmationWrapper>
  );
};

export default HakukohteetSection;
