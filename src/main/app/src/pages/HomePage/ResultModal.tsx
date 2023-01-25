import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { UseMutationResult } from 'react-query';
import { usePrevious } from 'react-use';

import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable from '#/src/components/ListTable';
import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';

export const ResultModal = ({
  onClose,
  headerText,
  mutationResult,
  entityType,
  getLinkUrl,
  useTableColumns,
}: {
  onClose: any;
  headerText: string;
  mutationResult: UseMutationResult<Array<any>, unknown, Array<string>>;
  entityType: ENTITY;
  getLinkUrl: any;
  useTableColumns: any;
}) => {
  const { t } = useTranslation();

  const isOpen = ['success', 'error'].includes(mutationResult.status);

  const usePreviousNonNil = value => {
    const prev = usePrevious(value);
    return _fp.isEmpty(value) ? prev : value;
  };

  const data = usePreviousNonNil(mutationResult.data);

  const ResultList = ({ data, entityType, getLinkUrl }) => {
    const { t } = useTranslation();
    const columns = useTableColumns(t, entityType, getLinkUrl);
    const rows = useMemo(
      () => _fp.map(result => ({ ...result, key: result.oid }), data),
      [data]
    );
    return <ListTable rows={rows} columns={columns} />;
  };

  return (
    <Modal
      minHeight="90vh"
      maxWidth="1200px"
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
      {mutationResult.isError ? (
        <ErrorAlert center>
          {t('etusivu.hakukohde.tilanmuutosEpaonnistui')}
        </ErrorAlert>
      ) : (
        <ResultList
          data={data}
          entityType={entityType}
          getLinkUrl={getLinkUrl}
        />
      )}
    </Modal>
  );
};
