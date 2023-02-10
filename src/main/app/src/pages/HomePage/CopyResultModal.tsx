import React, { useCallback } from 'react';

import _ from 'lodash';
import { UseMutationResult } from 'react-query';
import styled from 'styled-components';

import { RouterAnchor } from '#/src/components/Anchor';
import { Icon } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { ResultModal } from '#/src/pages/HomePage/ResultModal';
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

type CopyResultItem = {
  oid: string;
  created: {
    toteutusOid?: string;
    hakukohdeOid?: string;
  };
};

const isCopyResultSuccessful = mutationResult =>
  _.isArray(mutationResult?.data) &&
  _.every(mutationResult?.data, { status: 'success' });

export const CopyResultModal = ({
  entityType,
  headerText,
  mutationResult,
  getLinkUrl,
}: {
  entityType: ENTITY;
  headerText: string;
  mutationResult: UseMutationResult<Array<CopyResultItem>, unknown, any>;
  getLinkUrl: any;
}) => {
  const { removeSelection } = useEntitySelection(entityType);

  const onClose = useCallback(() => {
    if (isCopyResultSuccessful(mutationResult)) {
      removeSelection();
    }
    mutationResult.reset();
  }, [mutationResult, removeSelection]);

  return (
    <ResultModal
      onClose={onClose}
      headerText={headerText}
      mutationResult={mutationResult}
      entityType={entityType}
      getLinkUrl={getLinkUrl}
      useTableColumns={useTableColumns}
    />
  );
};
