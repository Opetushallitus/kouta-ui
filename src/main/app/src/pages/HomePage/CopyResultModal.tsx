import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { UseMutationResult } from 'react-query';
import styled from 'styled-components';

import { RouterAnchor } from '#/src/components/Anchor';
import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable from '#/src/components/ListTable';
import Modal from '#/src/components/Modal';
import { Box, Button, Icon } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import { useEntitySelection } from './useEntitySelection';

const Nimi = ({ item, entityType }) => {
  const { selection } = useEntitySelection(entityType);
  const userLanguage = useUserLanguage();
  return (
    getFirstLanguageValue(selection?.[item.oid]?.nimi, userLanguage) ?? null
  );
};

const SuccessIcon = styled(Icon).attrs({ type: 'done' })`
  color: ${({ theme }) => theme.colors.success.main};
`;

const ErrorIcon = styled(Icon).attrs({ type: 'error' })`
  color: ${({ theme }) => theme.colors.red.main};
`;

const useTableColumns = (t, entityType, getLinkUrl) => [
  {
    title: t('nimi'),
    key: 'nimi',
    render: item => <Nimi item={item} entityType={entityType} />,
  },
  {
    title: t('alkuperainen'),
    key: 'alkuperainen',
    render: item => (
      <RouterAnchor to={getLinkUrl(item.oid)}>{item.oid}</RouterAnchor>
    ),
  },
  {
    title: t('kopio'),
    key: 'kopio',
    render: item => {
      const oid = item?.created?.[`${entityType}Oid`];
      return oid ? (
        <RouterAnchor to={getLinkUrl(oid)}>{oid}</RouterAnchor>
      ) : null;
    },
  },
  {
    title: t('tulos'),
    key: 'tulos',
    render: item => {
      const status = item.status;
      switch (status) {
        case 'success':
          return <SuccessIcon />;
        case 'error':
          return <ErrorIcon />;
        default:
          return null;
      }
    },
  },
];

export const CopyResultList = ({ data, entityType, getLinkUrl }) => {
  const { t } = useTranslation();
  const columns = useTableColumns(t, entityType, getLinkUrl);
  const rows = useMemo(
    () => _fp.map(result => ({ ...result, key: result.oid }), data),
    [data]
  );

  return <ListTable rows={rows} columns={columns} />;
};

type CopyResultItem = {
  oid: string;
  created: {
    toteutusOid?: string;
    hakukohdeOid?: string;
  };
};

export const CopyResultModal = ({
  entityType,
  headerText,
  mutationResult,
  getLinkUrl,
}: {
  entityType: ENTITY;
  headerText: string;
  mutationResult: UseMutationResult<
    Array<CopyResultItem>,
    unknown,
    Array<string>
  >;
  getLinkUrl: any;
}) => {
  const { t } = useTranslation();

  const isOpen = ['success', 'error'].includes(mutationResult.status);

  const onClose = mutationResult.reset;

  return (
    <Modal
      minHeight="90vh"
      style={{ maxWidth: '1200px', width: '90vw' }}
      open={isOpen}
      onClose={onClose}
      header={headerText}
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose}>
            {t('yleiset.sulje')}
          </Button>
        </Box>
      }
    >
      {mutationResult.isSuccess && (
        <CopyResultList
          data={mutationResult.data}
          entityType={entityType}
          getLinkUrl={getLinkUrl}
        />
      )}
      {mutationResult.isError && (
        <ErrorAlert center>Kopiointi epäonnistui!</ErrorAlert>
      )}
    </Modal>
  );
};
