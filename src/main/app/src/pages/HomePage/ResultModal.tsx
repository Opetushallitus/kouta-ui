import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable from '#/src/components/ListTable';
import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';

import { useBatchOpsApi } from './CopyConfirmationModal';

const ResultList = ({ data, columns }) => {
  const rows = useMemo(
    () => _.map(data, result => ({ ...result, key: result.oid })),
    [data]
  );
  return <ListTable rows={rows} columns={columns} />;
};

export const ResultModal = ({
  onClose,
  headerText,
  batchOpsService,
  columns,
}: {
  onClose: any;
  headerText: string;
  batchOpsService: any;
  columns: any;
}) => {
  const { t } = useTranslation();

  const { result, isSuccess, isError } = useBatchOpsApi(batchOpsService);

  return (
    <Modal
      minHeight="90vh"
      maxWidth="1200px"
      open={isSuccess}
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
      {isError ? (
        <ErrorAlert center>
          {t('etusivu.hakukohde.tilanmuutosEpaonnistui')}
        </ErrorAlert>
      ) : (
        <ResultList data={result} columns={columns} />
      )}
    </Modal>
  );
};
