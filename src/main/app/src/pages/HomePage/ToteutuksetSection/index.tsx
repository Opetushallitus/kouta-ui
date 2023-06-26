import React, { useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { toteutusService } from '#/src/machines/filterMachines';
import {
  StateChangeConfirmationModal,
  StateChangeConfirmationWrapper,
  useStateChangeBatchOpsApi,
} from '#/src/pages/HomePage/StateChangeConfirmationModal';
import { StateChangeResultModal } from '#/src/pages/HomePage/StateChangeResultModal';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchToteutukset } from '#/src/utils/toteutus/searchToteutukset';

import {
  CopyConfirmationModal,
  CopyConfirmationWrapper,
  useCopyBatchOpsApi,
} from '../CopyConfirmationModal';
import { CopyResultModal } from '../CopyResultModal';
import { EntityListActionBar } from '../EntityListActionBar';
import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import { SERVICE_BY_ENTITY, useEntitySelection } from '../useEntitySelection';
import { useChangeToteutuksetTilaMutation } from './changeToteutuksetState';
import { useCopyToteutuksetMutation } from './copyToteutukset';
import { createToteutusListColumns } from './createToteutusListColumns';
import { KoulutusModal } from './KoulutusModal';

const { TOTEUTUS } = ENTITY;

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

const ToteutusActionBar = () => {
  const { selection } = useEntitySelection(TOTEUTUS);

  const copyApi = useCopyBatchOpsApi();
  const { start, tila } = useStateChangeBatchOpsApi();

  const changeTila = useCallback(
    tila => {
      start({ tila, entities: selection });
    },
    [selection, start]
  );

  const copy = useCallback(() => {
    copyApi.start({ entities: selection });
  }, [selection, copyApi]);

  return (
    <EntityListActionBar
      entityType={TOTEUTUS}
      copyEntities={copy}
      changeTila={changeTila}
      tila={tila}
    />
  );
};

export const createGetToteutusLinkUrl = organisaatioOid => oid =>
  `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`;

const ToteutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const selectionRef = SERVICE_BY_ENTITY[TOTEUTUS];

  const columns = useMemo(
    () => createToteutusListColumns(t, organisaatioOid)(selectionRef),
    [t, organisaatioOid, selectionRef]
  );

  const createColumnsForConfirmationModal = useMemo(
    () =>
      createToteutusListColumns(
        t,
        organisaatioOid,
        ({ key }) => key !== 'hakukohteet'
      ),
    [t, organisaatioOid]
  );

  const copyMutation = useCopyToteutuksetMutation();
  const tilaMutationResult = useChangeToteutuksetTilaMutation();

  const filterState = useFilterState(TOTEUTUS, toteutusService);

  return (
    <CopyConfirmationWrapper mutateAsync={copyMutation.mutateAsync}>
      <CopyConfirmationModal
        headerText={t('etusivu.toteutus.vahvistaKopiointiOtsikko')}
        createColumns={createColumnsForConfirmationModal}
      />
      <CopyResultModal
        entityType={TOTEUTUS}
        headerText={t('etusivu.kopioinninTuloksetOtsikko')}
        getLinkUrl={createGetToteutusLinkUrl(organisaatioOid)}
      />
      <StateChangeConfirmationWrapper
        mutateAsync={tilaMutationResult.mutateAsync}
        entityTranslationKeyPath={'etusivu.toteutus'}
      >
        <StateChangeConfirmationModal
          createColumns={createColumnsForConfirmationModal}
          entityTranslationKeyPath={'etusivu.toteutus'}
        />
        <StateChangeResultModal
          entityType={TOTEUTUS}
          getLinkUrl={createGetToteutusLinkUrl(organisaatioOid)}
          entityTranslationKeyPath={'etusivu.toteutus'}
        />
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
            ActionBar={ToteutusActionBar}
            searchEntities={searchToteutukset}
            organisaatioOid={organisaatioOid}
            entityType={TOTEUTUS}
            columns={columns}
            nimiPlaceholder={t('etusivu.haeToteutuksia')}
            filterState={filterState}
            searchPage="homepage.toteutukset"
          />
        </ListCollapse>
      </StateChangeConfirmationWrapper>
    </CopyConfirmationWrapper>
  );
};

export default ToteutuksetSection;
