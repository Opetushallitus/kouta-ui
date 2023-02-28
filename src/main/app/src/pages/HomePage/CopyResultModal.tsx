import React, { useCallback } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { RouterAnchor } from '#/src/components/Anchor';
import { Icon } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { ResultModal } from '#/src/pages/HomePage/ResultModal';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import { useCopyBatchOpsApi } from './CopyConfirmationModal';
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
    title: t('yleiset.nimi'),
    key: 'nimi',
    render: item => <Nimi item={item} entityType={entityType} />,
  },
  {
    title: t('etusivu.alkuperainen'),
    key: 'alkuperainen',
    render: item => (
      <RouterAnchor to={getLinkUrl(item.oid)}>{item.oid}</RouterAnchor>
    ),
  },
  {
    title: t('etusivu.kopio'),
    key: 'kopio',
    render: item => {
      const oid = item?.created?.[`${entityType}Oid`];
      return oid ? (
        <RouterAnchor to={getLinkUrl(oid)}>{oid}</RouterAnchor>
      ) : null;
    },
  },
  {
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

const isCopyResultSuccessful = mutationResult =>
  _.isArray(mutationResult) && _.every(mutationResult, { status: 'success' });

export const CopyResultModal = ({
  entityType,
  headerText,
  getLinkUrl,
}: {
  entityType: ENTITY;
  headerText: string;
  getLinkUrl: any;
}) => {
  const { removeSelection } = useEntitySelection(entityType);

  const { close, result, service } = useCopyBatchOpsApi();

  const onClose = useCallback(() => {
    if (isCopyResultSuccessful(result)) {
      removeSelection();
    }
    close();
  }, [result, removeSelection, close]);

  const { t } = useTranslation();

  const columns = useTableColumns(t, entityType, getLinkUrl);

  return (
    <ResultModal
      onClose={onClose}
      headerText={headerText}
      batchOpsService={service}
      columns={columns}
    />
  );
};
