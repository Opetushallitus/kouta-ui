import React from 'react';
import { Redirect } from 'react-router-dom';
import { ENTITY } from '#/src/constants';
import { FullSpin } from '#/src/components/FullSpin';
import { usePreferredOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

type RedirectProps = {
  entityType: ENTITY;
  getRedirectUrl: ({
    oid,
    organisaatioOid,
  }: {
    oid: string;
    organisaatioOid: string;
  }) => string;
};

export const createRedirectEntityPage = ({
  entityType,
  getRedirectUrl,
}: RedirectProps) => ({
  match: {
    params: { oid },
  },
}) => {
  const { data: entity = {} } = useEntityByOid(entityType, oid, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    entity?.organisaatioOid
  );

  return entity && preferredOrganisaatio ? (
    <Redirect
      to={getRedirectUrl({ oid, organisaatioOid: entity?.organisaatioOid })}
    />
  ) : (
    <FullSpin />
  );
};