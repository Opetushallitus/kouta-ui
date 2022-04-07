import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { UseMutationResult } from 'react-query';

import { RouterAnchor } from '#/src/components/Anchor';
import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable from '#/src/components/ListTable';
import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';

const useTableColumns = (t, entityType, getLinkUrl) => [
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
      const oid = item.created[`${entityType}Oid`];
      return <RouterAnchor to={getLinkUrl(oid)}>{oid}</RouterAnchor>;
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

  console.log({ data, rows });

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
  mutationResult: UseMutationResult<Array<CopyResultItem>>;
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
