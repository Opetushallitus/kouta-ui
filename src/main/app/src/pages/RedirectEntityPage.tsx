import React from 'react';

import { Navigate, useParams } from 'react-router-dom';

import { FullSpin } from '#/src/components/FullSpin';
import { ENTITY } from '#/src/constants';
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

export const createRedirectEntityPage =
  ({ entityType, getRedirectUrl }: RedirectProps) =>
  () => {
    const { oid } = useParams() as { oid: string };
    const { data: entity = {}, isLoading } = useEntityByOid(
      entityType,
      { oid },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

    const { preferredOrganisaatio } = usePreferredOrganisaatio(
      entity?.organisaatioOid,
      isLoading
    );

    return !isLoading && entity && preferredOrganisaatio ? (
      <Navigate
        to={getRedirectUrl({ oid, organisaatioOid: preferredOrganisaatio })}
        replace
      />
    ) : (
      <FullSpin />
    );
  };
