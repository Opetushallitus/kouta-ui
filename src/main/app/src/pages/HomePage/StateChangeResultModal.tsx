import React, { useCallback } from 'react';

import _ from 'lodash';
import { UseMutationResult, useQueryClient } from 'react-query';
import styled from 'styled-components';

import { RouterAnchor } from '#/src/components/Anchor';
import SmallStatusTag from '#/src/components/StatusTag/SmallStatusTag';
import { Icon } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { ResultModal } from '#/src/pages/HomePage/ResultModal';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import { useStateChangeConfirmationModal } from './StateChangeConfirmationModal';
import { useEntitySelection } from './useEntitySelection';

const NimiLink = ({ item, entityType, getLinkUrl }) => {
  const { selection } = useEntitySelection(entityType);
  const userLanguage = useUserLanguage();

  return (
    <RouterAnchor to={getLinkUrl(item.oid)}>
      {getFirstLanguageValue(selection?.[item.oid]?.nimi, userLanguage) ?? null}
    </RouterAnchor>
  );
};

const Tila = ({ item, entityType }) => {
  const { selection } = useEntitySelection(entityType);
  const vanhaTila = selection?.[item.oid]?.tila;
  const { tila } = useStateChangeConfirmationModal();
  const status = item.status;

  switch (status) {
    case 'success':
      return tila ? <SmallStatusTag status={tila} /> : null;
    case 'error':
      return <SmallStatusTag status={vanhaTila} />;
    default:
      return null;
  }
};

const Virhe = ({ errors }) => {
  const errorList = errors?.map(error => <p key={error}>{error}</p>);

  return <div>{errorList}</div>;
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
    render: item => (
      <NimiLink item={item} entityType={entityType} getLinkUrl={getLinkUrl} />
    ),
  },
  {
    title: t('etusivu.hakukohde.tilamuutos'),
    key: 'tilamuutos',
    render: item => <Tila item={item} entityType={entityType} />,
  },
  {
    title: t('etusivu.hakukohde.tilamuuttunut'),
    key: 'tilamuuttunut',
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
  {
    title: t('etusivu.hakukohde.tilaVirhe'),
    key: 'tilaVirhe',
    render: item => {
      const status = item.status;
      return status === 'error' ? <Virhe errors={item.errorPaths} /> : null;
    },
  },
  {
    title: t('etusivu.hakukohde.tilaVirheSyy'),
    key: 'tilaVirheSyy',
    render: item => {
      const status = item.status;
      return status === 'error' ? <Virhe errors={item.errorMessages} /> : null;
    },
  },
];

type StateChangeResultItem = {
  oid: string;
};

const isStateChangeResultSuccessful = mutationResult =>
  _.isArray(mutationResult?.data) &&
  _.every(mutationResult?.data, { status: 'success' });

export const StateChangeResultModal = ({
  entityType,
  headerText,
  mutationResult,
  getLinkUrl,
}: {
  entityType: ENTITY;
  headerText: string;
  mutationResult: UseMutationResult<Array<StateChangeResultItem>, unknown, any>;
  getLinkUrl: any;
}) => {
  const { removeSelection } = useEntitySelection(entityType);

  const queryClient = useQueryClient();

  const onClose = useCallback(() => {
    if (isStateChangeResultSuccessful(mutationResult)) {
      removeSelection();
    }
    mutationResult.reset();
    queryClient.invalidateQueries('search.homepage.hakukohteet');
  }, [mutationResult, removeSelection, queryClient]);

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
