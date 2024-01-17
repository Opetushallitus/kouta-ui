import _ from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { Organisaatio } from '#/src/types/domainTypes';
import getUserOrganisaatiotWithRoles from '#/src/utils/getUserOrganisaatiotWithRoles';
import getUserRoles from '#/src/utils/getUserRoles';
import { useOppilaitostyypitByKoulutustyypit } from '#/src/utils/koulutus/getOppilaitostyypitByKoulutustyypit';
import getOrganisaatiotByOids from '#/src/utils/organisaatio/getOrganisaatiotByOids';

export const useOrganisaatio = (oid, options = {}) => {
  const { organisaatiot, ...rest } = useOrganisaatiot(oid, options);

  return { organisaatio: organisaatiot?.[0], ...rest };
};

export const useOrganisaatiot = (oids, options = {}) => {
  const { data: organisaatiot, ...rest } = useApiQuery<Array<Organisaatio>>(
    'getOrganisaatiot',
    getOrganisaatiotByOids,
    { oids: _.castArray(oids) },
    {
      ...options,
      ...LONG_CACHE_QUERY_OPTIONS,
      enabled: !_.isEmpty(oids) && options.enabled,
      retry: 0,
    }
  );

  return { ...rest, organisaatiot };
};

const organisaationKoulutustyypit = (o, oppilaitostyypitByKoulutustyypit) => {
  const oppilaitostyyppi = o?.oppilaitostyyppiUri?.replace(/#\d/i, '');

  return _.filter(oppilaitostyypitByKoulutustyypit, obj =>
    obj.oppilaitostyypit.includes(oppilaitostyyppi)
  );
};

const isParent = parentOid => org => org?.parentOids?.includes(parentOid);

const isChild = childOid => org =>
  org.oid === childOid || _.head(org.children?.filter(isChild(childOid)));

const hasSameOppilaitostyyppiAsOneOfOrgsKoulutustyyppis =
  oppilaitoksenKoulutustyypit => org => {
    const oppilaitostyypit = oppilaitoksenKoulutustyypit.flatMap(
      obj => obj.oppilaitostyypit
    );

    return (
      _.some(
        oppilaitostyypit,
        oppilaitostyyppi => oppilaitostyyppi === org.oppilaitostyyppiUri
      ) ||
      _.head(
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
    !_.isEmpty(oppilaitoksenKoulutustyypit) &&
    _.head(
      hierarkia?.filter(
        hasSameOppilaitostyyppiAsOneOfOrgsKoulutustyyppis(
          oppilaitoksenKoulutustyypit
        )
      )
    )
  );
};

export const usePreferredOrganisaatio = (
  creatorOrganisaatioOid,
  creatorOrganisaatioIsLoading
) => {
  const user = useAuthorizedUser();
  const roles = getUserRoles(user);
  const orgOids = _.uniq(getUserOrganisaatiotWithRoles(user, roles));
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
      _.head(
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
      _.head(orgOids.filter(org => hierarkia.filter(isChild(org.oid))));
    const firstParentOrganisation =
      organisaatiot &&
      hierarkia &&
      _.head(orgOids.filter(org => hierarkia.filter(isParent(org.oid))));

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
