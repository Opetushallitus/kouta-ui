import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InterpreterFrom } from 'xstate';

import ErrorAlert from '#/src/components/ErrorAlert';
import ListTable from '#/src/components/ListTable';
import Modal from '#/src/components/Modal';
import { Box, Button } from '#/src/components/virkailija';
import { BatchOpsMachine } from '#/src/machines/batchOpsMachine';

import { useBatchOpsApi } from './CopyConfirmationModal';

const InfoText = styled(Box)`
  padding-bottom: 15px;
`;

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
  batchOpsService: InterpreterFrom<typeof BatchOpsMachine>;
  columns: Array<{
    key: string;
    title?: string;
    sortable?: boolean;
    Component?: React.Component;
    render?: (x: any) => any;
    style?: React.CSSProperties;
  }>;
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
        <>
          <InfoText>{t('etusivu.hakukohde.tilanmuutosOhje')}</InfoText>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              {t('yleiset.sulje')}
            </Button>
          </Box>
        </>
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
