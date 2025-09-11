import { castArray, isEmpty, head, filter, some, uniq } from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { KoutaApiQueryConfig, useApiQuery } from '#/src/hooks/useApiQuery';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import getUserOrganisaatiotWithRoles from '#/src/utils/getUserOrganisaatiotWithRoles';
import getUserRoles from '#/src/utils/getUserRoles';
import { useOppilaitostyypitByKoulutustyypit } from '#/src/utils/koulutus/getOppilaitostyypitByKoulutustyypit';
import getOrganisaatiotByOids from '#/src/utils/organisaatio/getOrganisaatiotByOids';

export const useOrganisaatio = (
  oid: string,
  options: KoutaApiQueryConfig = {}
) => {
  const { organisaatiot, ...rest } = useOrganisaatiot(oid, options);

  return { organisaatio: organisaatiot?.[0], ...rest };
};

export const useOrganisaatiot = (oids, options: KoutaApiQueryConfig = {}) => {
  const { data: organisaatiot, ...rest } = useApiQuery<
    Array<OrganisaatioModel>
  >(
    'getOrganisaatiot',
    getOrganisaatiotByOids,
    { oids: castArray(oids) },
    {
      ...options,
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled: !isEmpty(oids) && options.enabled,
      retry: 0,
    }
  );

  return { ...rest, organisaatiot };
};

const organisaationKoulutustyypit = (o, oppilaitostyypitByKoulutustyypit) => {
  const oppilaitostyyppi = o?.oppilaitostyyppiUri?.replace(/#\d/i, '');

  return filter(oppilaitostyypitByKoulutustyypit, obj =>
    obj.oppilaitostyypit.includes(oppilaitostyyppi)
  );
};

const isParent = parentOid => org => org?.parentOids?.includes(parentOid);

const isChild = childOid => org =>
  org.oid === childOid || head(org.children?.filter(isChild(childOid)));

const hasSameOppilaitostyyppiAsOneOfOrgsKoulutustyyppis =
  oppilaitoksenKoulutustyypit => org => {
    const oppilaitostyypit = oppilaitoksenKoulutustyypit.flatMap(
      obj => obj.oppilaitostyypit
    );

    return (
      some(
        oppilaitostyypit,
        oppilaitostyyppi => oppilaitostyyppi === org.oppilaitostyyppiUri
      ) ||
      head(
        org.children?.filter(
          hasSameOppilaitostyyppiAsOneOfOrgsKoulutustyyppis(
            oppilaitoksenKoulutustyypit
          )
        )
      )
    );
  };

export const isSameKoulutustyyppiWithOrganisaatio = (
  organisaatio,
  hierarkia,
  oppilaitostyypitByKoulutustyypit
) => {
  const oppilaitoksenKoulutustyypit = organisaationKoulutustyypit(
    organisaatio,
    oppilaitostyypitByKoulutustyypit
  );

  return (
    isEmpty(oppilaitoksenKoulutustyypit) &&
    head(
      hierarkia?.filter(
        hasSameOppilaitostyyppiAsOneOfOrgsKoulutustyyppis(
          oppilaitoksenKoulutustyypit
        )
      )
    )
  );
};

export const usePreferredOrganisaatio = (
  creatorOrganisaatioOid: string,
  creatorOrganisaatioIsLoading: boolean
) => {
  const user = useAuthorizedUser();
  const roles = getUserRoles(user);
  const orgOids = uniq(getUserOrganisaatiotWithRoles(user, roles));
  const { organisaatiot } = useOrganisaatiot(orgOids);
  const { hierarkia, isLoading: hierarkiaIsLoading } = useOrganisaatioHierarkia(
    creatorOrganisaatioOid,
    {
      skipParents: false,
    }
  );

  const { oppilaitostyypitByKoulutustyypit, isLoading: loadingMappings } =
    useOppilaitostyypitByKoulutustyypit();

  if (loadingMappings || creatorOrganisaatioIsLoading || hierarkiaIsLoading) {
    return {};
  } else {
    const firstSameKoulutustyyppiOrganisation =
      organisaatiot &&
      hierarkia &&
      head(
        organisaatiot
          .filter(org =>
            isSameKoulutustyyppiWithOrganisaatio(
              org,
              hierarkia,
              oppilaitostyypitByKoulutustyypit
            )
          )
          .map(_ => _.oid)
      );

    const firstChildOrganisation =
      organisaatiot &&
      hierarkia &&
      head(orgOids.filter(org => hierarkia.filter(isChild(org.oid))));
    const firstParentOrganisation =
      organisaatiot &&
      hierarkia &&
      head(orgOids.filter(org => hierarkia.filter(isParent(org.oid))));

    const preferredOrganisaatio =
      organisaatiot &&
      hierarkia &&
      (firstSameKoulutustyyppiOrganisation ||
        firstChildOrganisation ||
        firstParentOrganisation ||
        creatorOrganisaatioOid);

    return { preferredOrganisaatio };
  }
};

export default useOrganisaatio;
