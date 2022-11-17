import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { toteutusService } from '#/src/machines/filterMachines';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchToteutukset } from '#/src/utils/toteutus/searchToteutukset';

import {
  CopyConfirmationModal,
  CopyConfirmationWrapper,
  useCopyConfirmationModal,
} from '../CopyConfirmationModal';
import { CopyResultModal } from '../CopyResultModal';
import { EntityListActionBar } from '../EntityListActionBar';
import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import {
  SERVICE_BY_ENTITY,
  useEntitySelection,
  useEntitySelectionApi,
} from '../useEntitySelection';
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
  const { selection, removeSelection } = useEntitySelection(TOTEUTUS);

  const { openModal } = useCopyConfirmationModal();

  return (
    <EntityListActionBar
      entityType={TOTEUTUS}
      selection={selection}
      removeSelection={removeSelection}
      copyEntities={openModal}
    />
  );
};

export const createGetToteutusLinkUrl = organisaatioOid => oid =>
  `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`;

const ToteutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const { selection } = useEntitySelectionApi(SERVICE_BY_ENTITY[TOTEUTUS]);

  const columns = useMemo(
    () =>
      createToteutusListColumns(
        t,
        organisaatioOid
      )(SERVICE_BY_ENTITY[TOTEUTUS]),
    [t, organisaatioOid]
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

  const filterState = useFilterState(TOTEUTUS, toteutusService);

  return copyMutation.isLoading ? (
    <OverlaySpin text={t('etusivu.toteutus.kopioidaan')} />
  ) : (
    <CopyConfirmationWrapper entities={selection}>
      <CopyConfirmationModal
        onCopySelection={copyMutation.mutate}
        entities={selection}
        headerText={t('etusivu.toteutus.vahvistaKopiointiOtsikko')}
        createColumns={createColumnsForConfirmationModal}
      />
      <CopyResultModal
        entityType={TOTEUTUS}
        headerText={t('etusivu.kopioinninTuloksetOtsikko')}
        mutationResult={copyMutation}
        getLinkUrl={createGetToteutusLinkUrl(organisaatioOid)}
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
    </CopyConfirmationWrapper>
  );
};

export default ToteutuksetSection;
