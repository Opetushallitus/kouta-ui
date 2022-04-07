import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import Button from '#/src/components/Button';
import { OverlaySpin } from '#/src/components/OverlaySpin';
import { ENTITY, ICONS } from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import useModal from '#/src/hooks/useModal';
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

type ToteutusCopyResponseItem = {
  oid: string;
  status: 'success' | 'error';
  created: {
    toteutusOid?: string;
  };
};

type ToteutusCopyResponseData = Array<ToteutusCopyResponseItem>;

const useCopyToteutukset = () => {
  const apiUrls = useUrls();
  const httpClient = useHttpClient();
  apiUrls.url('kouta-backend.login');
  return useCallback(
    async (toteutukset: Array<string>) => {
      const result = await httpClient.put(
        apiUrls.url('kouta-backend.toteutus-copy'),
        _.map(toteutukset, 'oid')
      );
      return result.data as ToteutusCopyResponseData;
    },
    [httpClient, apiUrls]
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
        organisaatioOid,
        SERVICE_BY_ENTITY[TOTEUTUS]
      ),
    [t, organisaatioOid]
  );

  const copyToteutukset = useCopyToteutukset();
  const copyMutation = useMutation<
    ToteutusCopyResponseData,
    unknown,
    Array<string>
  >(copyToteutukset);

  return copyMutation.isLoading ? (
    <OverlaySpin text={t('etusivu.toteutus.kopioidaan')} />
  ) : (
    <CopyConfirmationWrapper entities={selection}>
      <CopyConfirmationModal
        onCopySelection={copyMutation.mutate}
        entities={selection}
        headerText={t('etusivu.toteutus.vahvistaKopiointiOtsikko')}
        createColumns={createToteutusListColumns}
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
        />
      </ListCollapse>
    </CopyConfirmationWrapper>
  );
};

export default ToteutuksetSection;
